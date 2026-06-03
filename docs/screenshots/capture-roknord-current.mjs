import { mkdir, writeFile, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import http from 'node:http';

const CHROME_PATH =
  process.env.CHROME_PATH ||
  '/home/anton/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome';
const DEBUG_PORT = Number(process.env.CHROME_DEBUG_PORT || 9222);
const VIEWPORTS = [1440, 768, 430, 390];
const VIEWPORT_HEIGHT = 1200;
const OUTPUT_DIR = '/opt/roknord-site/docs/screenshots/roknord-current';
const URL = process.env.ROKNORD_CAPTURE_URL || 'http://127.0.0.1:4321/';

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  const userDataDir = `/tmp/roknord-current-${DEBUG_PORT}-${Date.now()}-${Math.random()
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
  const child = spawn(CHROME_PATH, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  let stderr = '';
  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString('utf8');
  });

  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      await httpRequest('GET', '/json/version');
      return { child, userDataDir };
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
      await delay(50);
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

async function saveScreenshot(client, output, opts = {}) {
  const clip = opts.clip || null;
  const shot = await client.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: Boolean(opts.fullPage),
    clip: clip || undefined,
  });
  await writeFile(output, Buffer.from(shot.data, 'base64'));
  return output;
}

async function waitForReady(client) {
  await delay(2500);
  await client.send('Runtime.evaluate', {
    expression: `new Promise((resolve) => {
      const done = () => resolve({
        readyState: document.readyState,
        title: document.title,
        h1: document.querySelector('h1')?.textContent?.trim() || '',
      });
      if (document.readyState === 'complete') {
        requestAnimationFrame(() => requestAnimationFrame(done));
      } else {
        window.addEventListener('load', () => requestAnimationFrame(() => requestAnimationFrame(done)), { once: true });
      }
    })`,
    awaitPromise: true,
    returnByValue: true,
  });
}

async function setCookiePanelAccepted(client, accepted) {
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      try {
        if (${accepted ? 'true' : 'false'}) {
          window.localStorage.setItem('roknord-cookie-consent', 'accepted');
        } else {
          window.localStorage.removeItem('roknord-cookie-consent');
        }
      } catch {}
      return true;
    })()`,
    returnByValue: true,
  });
  await delay(150);
}

async function clickSelector(client, selector) {
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      el.click();
      return true;
    })()`,
    returnByValue: true,
  });
  await delay(250);
}

async function resetState(client) {
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      document.querySelectorAll('details[open]').forEach((el) => el.open = false);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return true;
    })()`,
    returnByValue: true,
  });
  await delay(200);
}

async function captureWidth(client, width, files) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: VIEWPORT_HEIGHT,
    deviceScaleFactor: 1,
    mobile: width <= 430,
    screenWidth: width,
    screenHeight: VIEWPORT_HEIGHT,
  });
  await client.send('Page.navigate', { url: URL });
  await waitForReady(client);
  await setCookiePanelAccepted(client, true);
  await client.send('Page.navigate', { url: URL });
  await waitForReady(client);
  await saveScreenshot(client, files.full, { fullPage: true });
  await saveScreenshot(client, files.hero, {
    clip: { x: 0, y: 0, width, height: VIEWPORT_HEIGHT, scale: 1 },
  });
}

async function captureDropdown(client, width, summarySelector, output) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: VIEWPORT_HEIGHT,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: width,
    screenHeight: VIEWPORT_HEIGHT,
  });
  await client.send('Page.navigate', { url: URL });
  await waitForReady(client);
  await setCookiePanelAccepted(client, true);
  await client.send('Page.navigate', { url: URL });
  await waitForReady(client);
  await resetState(client);
  await clickSelector(client, summarySelector);
  await saveScreenshot(client, output, {
    clip: { x: 0, y: 0, width, height: VIEWPORT_HEIGHT, scale: 1 },
  });
}

async function captureMobileDrawer(client, output) {
  const width = 390;
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: VIEWPORT_HEIGHT,
    deviceScaleFactor: 1,
    mobile: true,
    screenWidth: width,
    screenHeight: VIEWPORT_HEIGHT,
  });
  await client.send('Page.navigate', { url: URL });
  await waitForReady(client);
  await setCookiePanelAccepted(client, true);
  await client.send('Page.navigate', { url: URL });
  await waitForReady(client);
  await resetState(client);
  await clickSelector(client, '.mobile-menu > summary');
  await saveScreenshot(client, output, {
    clip: { x: 0, y: 0, width, height: VIEWPORT_HEIGHT, scale: 1 },
  });
}

async function captureFooterContact(client, width, output) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: VIEWPORT_HEIGHT,
    deviceScaleFactor: 1,
    mobile: width <= 430,
    screenWidth: width,
    screenHeight: VIEWPORT_HEIGHT,
  });
  await client.send('Page.navigate', { url: URL });
  await waitForReady(client);
  await setCookiePanelAccepted(client, true);
  await client.send('Page.navigate', { url: URL });
  await waitForReady(client);
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const target = document.querySelector('#contact');
      if (!target) return false;
      const top = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, left: 0, behavior: 'instant' });
      return true;
    })()`,
    returnByValue: true,
  });
  await delay(700);
  await saveScreenshot(client, output);
}

async function captureCookiePanel(client, width, output) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: VIEWPORT_HEIGHT,
    deviceScaleFactor: 1,
    mobile: width <= 430,
    screenWidth: width,
    screenHeight: VIEWPORT_HEIGHT,
  });
  await client.send('Page.navigate', { url: URL });
  await waitForReady(client);
  await setCookiePanelAccepted(client, false);
  await client.send('Page.navigate', { url: URL });
  await waitForReady(client);
  await saveScreenshot(client, output);
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const { child, userDataDir } = await startChrome();
  const results = [];
  const problems = [];

  try {
    const client = await connect(await createTab());
    try {
      await client.send('Page.enable');
      await client.send('Runtime.enable');
      await client.send('Network.enable');

      for (const width of VIEWPORTS) {
        const full = `${OUTPUT_DIR}/roknord-current-${width}.png`;
        const hero = `${OUTPUT_DIR}/roknord-current-hero-${width}.png`;
        await captureWidth(client, width, { full, hero });
        results.push(full, hero);
      }

      await captureDropdown(
        client,
        1440,
        '.site-nav .nav-dropdown summary[aria-controls="services-panel"]',
        `${OUTPUT_DIR}/roknord-current-services-dropdown-1440.png`
      );
      results.push(`${OUTPUT_DIR}/roknord-current-services-dropdown-1440.png`);

      await captureDropdown(
        client,
        1440,
        '.site-nav .nav-dropdown summary[aria-controls="audience-panel"]',
        `${OUTPUT_DIR}/roknord-current-audiences-dropdown-1440.png`
      );
      results.push(`${OUTPUT_DIR}/roknord-current-audiences-dropdown-1440.png`);

      await captureMobileDrawer(
        client,
        `${OUTPUT_DIR}/roknord-current-mobile-drawer-390.png`
      );
      results.push(`${OUTPUT_DIR}/roknord-current-mobile-drawer-390.png`);

      await captureFooterContact(
        client,
        1440,
        `${OUTPUT_DIR}/roknord-current-footer-contact-1440.png`
      );
      results.push(`${OUTPUT_DIR}/roknord-current-footer-contact-1440.png`);

      await captureFooterContact(
        client,
        390,
        `${OUTPUT_DIR}/roknord-current-footer-contact-390.png`
      );
      results.push(`${OUTPUT_DIR}/roknord-current-footer-contact-390.png`);

      await captureCookiePanel(
        client,
        1440,
        `${OUTPUT_DIR}/roknord-current-cookie-panel-1440.png`
      );
      results.push(`${OUTPUT_DIR}/roknord-current-cookie-panel-1440.png`);

      await captureCookiePanel(
        client,
        390,
        `${OUTPUT_DIR}/roknord-current-cookie-panel-390.png`
      );
      results.push(`${OUTPUT_DIR}/roknord-current-cookie-panel-390.png`);
    } finally {
      try {
        await client.close();
      } catch {}
    }
  } catch (error) {
    problems.push(error.message || String(error));
    throw error;
  } finally {
    child.kill('SIGKILL');
    await delay(400);
    await rm(userDataDir, { recursive: true, force: true, maxRetries: 4, retryDelay: 250 });
  }

  await writeFile(
    `${OUTPUT_DIR}/capture-report.json`,
    JSON.stringify(
      {
        url: URL,
        viewports: VIEWPORTS,
        screenshots: results,
        problems,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
