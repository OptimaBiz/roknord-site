import { mkdir, writeFile, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import http from 'node:http';

const CHROME_PATH =
  process.env.CHROME_PATH ||
  '/home/anton/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome';
const DEBUG_PORT = Number(process.env.CHROME_DEBUG_PORT || 9222);
const VIEWPORTS = [1440, 1024, 768, 430, 390];
const VIEWPORT_HEIGHT = 1200;
const TASKS = [
  {
    name: 'reference',
    url: 'https://www.lrqa.com/',
    outputDir: '/opt/roknord-site/docs/screenshots/reference',
    filePrefix: 'lrqa',
  },
  {
    name: 'roknord',
    url: process.env.ROKNORD_CAPTURE_URL || 'http://149.102.155.76:4321/',
    outputDir: '/opt/roknord-site/docs/screenshots/roknord',
    filePrefix: 'roknord',
  },
];
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = ''] = arg.replace(/^--/, '').split('=');
    return [key, value];
  })
);

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mkdirs() {
  for (const task of TASKS) {
    await mkdir(task.outputDir, { recursive: true });
  }
}

async function httpRequest(method, path, body) {
  const payload = body ? Buffer.from(JSON.stringify(body)) : null;
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: '127.0.0.1',
        port: DEBUG_PORT,
        path,
        method,
        headers: payload
          ? {
              'Content-Type': 'application/json',
              'Content-Length': String(payload.length),
            }
          : undefined,
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          if (res.statusCode >= 400) {
            reject(new Error(`${method} ${path} failed: ${res.statusCode} ${text}`));
            return;
          }
          try {
            resolve(text ? JSON.parse(text) : {});
          } catch (error) {
            reject(error);
          }
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function startChrome() {
  const userDataDir = `/tmp/roknord-chrome-${DEBUG_PORT}-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-sandbox',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${userDataDir}`,
    'about:blank',
  ];
  const child = spawn(CHROME_PATH, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let stderr = '';
  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString('utf8');
  });
  child.stdout.on('data', () => {});

  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      await httpRequest('GET', '/json/version');
      return { child, stderr, userDataDir };
    } catch {
      if (child.exitCode !== null) {
        throw new Error(`Chromium exited early: ${stderr}`);
      }
      await delay(200);
    }
  }
  child.kill('SIGKILL');
  throw new Error(`Chromium did not open CDP port: ${stderr}`);
}

async function createTab() {
  const created = await httpRequest('PUT', '/json/new?about:blank');
  return created.webSocketDebuggerUrl;
}

async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', () => resolve(), { once: true });
    ws.addEventListener('error', (event) => reject(event.error || new Error('WebSocket error')), {
      once: true,
    });
  });
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data));
    if (typeof message.id === 'number' && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    }
  });
  return {
    close: async () => {
      try {
        ws.close();
      } catch {}
      await delay(100);
    },
    send(method, params = {}) {
      const msgId = ++id;
      ws.send(JSON.stringify({ id: msgId, method, params }));
      return new Promise((resolve, reject) => {
        pending.set(msgId, { resolve, reject });
      });
    },
  };
}

async function tryAcceptCookies(client, problems) {
  const expression = `(() => {
    const labels = [
      'accept', 'accept all', 'allow all', 'agree',
      'i agree', 'got it', 'ok',
      'принять', 'принять все', 'согласен', 'согласна', 'разрешить'
    ];
    const nodes = [...document.querySelectorAll('button, a, [role="button"], input[type="button"], input[type="submit"]')];
    const match = nodes.find((node) => {
      const text = ((node.innerText || node.value || node.getAttribute('aria-label') || '') + '')
        .trim()
        .toLowerCase();
      return text && labels.some((label) => text === label || text.includes(label));
    });
    if (!match) return { clicked: false };
    match.click();
    return { clicked: true, text: (match.innerText || match.value || match.getAttribute('aria-label') || '').trim() };
  })()`;
  const result = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
  });
  if (result.result?.value?.clicked) {
    problems.push(`Cookie banner accepted via "${result.result.value.text}".`);
    await delay(1500);
  }
}

async function waitForImages(client) {
  const expression = `new Promise((resolve) => {
    let ticks = 0;
    const done = () => resolve({
      readyState: document.readyState,
      imageCount: document.images.length,
      completeImages: [...document.images].filter((img) => img.complete).length
    });
    const timer = setInterval(() => {
      window.scrollTo(0, document.body.scrollHeight);
      window.scrollTo(0, 0);
      ticks += 1;
      if (ticks >= 6) {
        clearInterval(timer);
        requestAnimationFrame(() => requestAnimationFrame(done));
      }
    }, 700);
  })`;
  await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
}

async function captureTask(task, width, problems) {
  const wsUrl = await createTab();
  const client = await connect(wsUrl);
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Network.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: VIEWPORT_HEIGHT,
    deviceScaleFactor: 1,
    mobile: width <= 430,
    screenWidth: width,
    screenHeight: VIEWPORT_HEIGHT,
  });
  await client.send('Page.navigate', { url: task.url });
  try {
    await delay(3500);
    await tryAcceptCookies(client, problems);
    await waitForImages(client);
    const metrics = await client.send('Page.getLayoutMetrics');
    const contentWidth = Math.ceil(metrics.contentSize.width || width);
    const contentHeight = Math.ceil(metrics.contentSize.height || VIEWPORT_HEIGHT);
    const screenshot = await client.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      clip: {
        x: 0,
        y: 0,
        width: contentWidth,
        height: contentHeight,
        scale: 1,
      },
    });
    const output = `${task.outputDir}/${task.filePrefix}-${width}.png`;
    await writeFile(output, Buffer.from(screenshot.data, 'base64'));
    return output;
  } finally {
    try {
      await client.close();
    } catch {}
  }
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    delay(ms).then(() => {
      throw new Error(`${label} timed out after ${ms}ms`);
    }),
  ]);
}

async function main() {
  await mkdirs();
  const notes = [];
  const results = [];
  const taskFilter = args.get('task');
  const widthFilter = args.get('width');
  const selectedTasks = TASKS.filter((task) => !taskFilter || task.name === taskFilter);
  const selectedWidths = VIEWPORTS.filter((width) => !widthFilter || String(width) === widthFilter);
  for (const task of selectedTasks) {
    for (const width of selectedWidths) {
      const problems = [];
      const { child, userDataDir } = await startChrome();
      try {
        try {
          const file = await withTimeout(captureTask(task, width, problems), 45000, `${task.name} ${width}`);
          results.push(file);
        } catch (error) {
          const message = `${task.name} ${width}: ${error.message}`;
          notes.push(message);
          console.error(message);
        }
        for (const problem of problems) {
          notes.push(`${task.name} ${width}: ${problem}`);
        }
      } finally {
        child.kill('SIGKILL');
        await rm(userDataDir, { recursive: true, force: true });
      }
    }
  }
  console.log(JSON.stringify({ results, notes }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
