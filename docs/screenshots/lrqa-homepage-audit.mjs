import { mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import http from 'node:http';
import net from 'node:net';

const CHROME_PATH =
  process.env.CHROME_PATH ||
  '/home/anton/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome';
const TARGET_URL = process.env.LRQA_URL || 'https://www.lrqa.com/';
const STORAGE_STATE_PATH = '/opt/roknord-site/docs/screenshots/lrqa-storage-state.json';
const PROFILE_DIR = '/opt/roknord-site/docs/screenshots/.pw-lrqa-profile';
const VIEWPORTS = [1440, 1024, 768, 430, 390];
const HERO_VIEWPORTS = [1440, 1024, 768, 430, 390];
const TASKS = [{ name: 'reference', outputDir: '/opt/roknord-site/docs/screenshots/reference' }];

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = ''] = arg.replace(/^--/, '').split('=');
    return [key, value];
  })
);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(s) {
  return String(s || '').trim().replace(/\s+/g, ' ');
}

async function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
  });
}

async function requestDebug(port, method, path, body) {
  const payload = body ? Buffer.from(JSON.stringify(body)) : null;
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: '127.0.0.1',
        port,
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

async function launchChrome(port) {
  const userDataDir = process.env.LRQA_PROFILE_DIR || PROFILE_DIR;
  await rm(userDataDir, { recursive: true, force: true });
  const child = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-sandbox',
      '--no-first-run',
      '--no-default-browser-check',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      'about:blank',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );
  let stderr = '';
  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString('utf8');
  });
  for (let i = 0; i < 60; i += 1) {
    try {
      await requestDebug(port, 'GET', '/json/version');
      return { child, userDataDir, stderr };
    } catch {
      if (child.exitCode !== null) throw new Error(`Chromium exited early: ${stderr}`);
      await sleep(200);
    }
  }
  child.kill('SIGKILL');
  throw new Error(`Chromium did not expose CDP: ${stderr}`);
}

async function createTab(port) {
  const created = await requestDebug(port, 'PUT', '/json/new?about:blank');
  return created.webSocketDebuggerUrl;
}

async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
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
    close() {
      try {
        ws.close();
      } catch {}
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

async function cdpEval(client, expression, opts = {}) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: Boolean(opts.awaitPromise),
    returnByValue: true,
  });
  return result.result?.value;
}

async function openPage(client, url) {
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Network.enable');
  await client.send('Page.navigate', { url });
  await sleep(3000);
}

async function detectPageState(client) {
  return cdpEval(
    client,
    `(() => {
      const title = document.title;
      const h1 = [...document.querySelectorAll('h1')].find((el) => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
      });
      const h1Text = h1 ? h1.innerText.trim().replace(/\\s+/g, ' ') : '';
      const overlayNodes = [...document.querySelectorAll('button, a, [role="button"]')].filter((el) => {
        const text = ((el.innerText || el.getAttribute('aria-label') || el.textContent || '') + '').toLowerCase();
        return /accept|agree|allow|cookie|privacy|consent|ok|got it|akzept|zustimmen|annehmen|принять|согласен/.test(text);
      }).map((el) => ((el.innerText || el.getAttribute('aria-label') || el.textContent || '') + '').trim()).filter(Boolean);
      return {
        url: location.href,
        title,
        h1Text,
        userAgent: navigator.userAgent,
        language: navigator.language,
        overlayNodes,
        bodyText: document.body.innerText.slice(0, 800),
      };
    })()`
  );
}

async function acceptCookiesIfVisible(client) {
  return cdpEval(
    client,
    `(() => {
      const selector = '#onetrust-accept-btn-handler';
      const byId = document.querySelector(selector);
      if (byId) {
        byId.click();
        return {
          clicked: true,
          text: (byId.innerText || byId.value || byId.getAttribute('aria-label') || '').trim(),
          selector
        };
      }
      const candidates = [...document.querySelectorAll('button, a, [role="button"], input[type="button"], input[type="submit"]')];
      const target = candidates.find((el) => {
        const text = ((el.innerText || el.value || el.getAttribute('aria-label') || '') + '').trim().toLowerCase();
        return /accept all|accept|agree|allow|i agree|ok|got it|akzept|zustimmen|annehmen|принять|согласен|согласна/.test(text);
      });
      if (!target) return { clicked: false };
      target.click();
      return {
        clicked: true,
        text: (target.innerText || target.value || target.getAttribute('aria-label') || '').trim(),
        selector: 'heuristic'
      };
    })()`
  );
}

async function clickVisibleText(client, patterns) {
  return cdpEval(
    client,
    `(() => {
      const nodes = [...document.querySelectorAll('button, a, [role="button"], input[type="button"], input[type="submit"]')];
      const target = nodes.find((el) => {
        const text = ((el.innerText || el.value || el.getAttribute('aria-label') || '') + '').trim();
        const visible = !!(el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
        return visible && ${JSON.stringify(patterns.map((p) => p.source))}.some((src) => new RegExp(src, 'i').test(text));
      });
      if (!target) return { clicked: false };
      target.click();
      return {
        clicked: true,
        text: (target.innerText || target.value || target.getAttribute('aria-label') || '').trim()
      };
    })()`
  );
}

async function getRootStyleData(client) {
  return cdpEval(
    client,
    `(() => {
      const cs = getComputedStyle(document.documentElement);
      const vars = {};
      for (let i = 0; i < cs.length; i += 1) {
        const name = cs[i];
        if (name.startsWith('--')) vars[name] = cs.getPropertyValue(name).trim();
      }
      return {
        vars,
        fontFamily: getComputedStyle(document.body).fontFamily,
      };
    })()`
  );
}

async function getTextStyles(client, selector) {
  return cdpEval(
    client,
    `(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return null;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        text: (el.innerText || '').trim().replace(/\\s+/g, ' ').slice(0, 200),
        tag: el.tagName.toLowerCase(),
        className: el.className,
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        fontWeight: s.fontWeight,
        color: s.color,
        backgroundColor: s.backgroundColor,
      };
    })()`
  );
}

async function listSections(client) {
  return cdpEval(
    client,
    `(() => {
      const candidates = [...document.querySelectorAll('main > * , main section, body > *')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 80;
      });
      return candidates.slice(0, 18).map((el, index) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        const heading = el.querySelector('h1,h2,h3,h4');
        const buttons = [...el.querySelectorAll('button,a')].slice(0, 5).map((n) => (n.innerText || n.getAttribute('aria-label') || '').trim()).filter(Boolean);
        return {
          index: index + 1,
          tag: el.tagName.toLowerCase(),
          className: el.className,
          top: Math.round(r.top),
          height: Math.round(r.height),
          bg: s.backgroundColor,
          color: s.color,
          columnsHint: buttons.length,
          heading: heading ? heading.innerText.trim().replace(/\\s+/g, ' ') : '',
          text: (el.innerText || '').trim().replace(/\\s+/g, ' ').slice(0, 180),
          buttons,
        };
      });
    })()`
  );
}

async function saveScreenshot(client, path, opts) {
  const shot = await client.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: Boolean(opts.fullPage),
    clip: opts.clip || undefined,
  });
  await writeFile(path, Buffer.from(shot.data, 'base64'));
}

async function hasCookieBanner(client) {
  return cdpEval(
    client,
    `(() => {
      const banner = document.querySelector('#onetrust-banner-sdk');
      if (!banner) return false;
      const s = getComputedStyle(banner);
      return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
    })()`
  );
}

async function setConsentCookies(client) {
  return cdpEval(
    client,
    `(() => {
      const expiry = 'Tue, 31 Dec 2030 23:59:59 GMT';
      document.cookie = 'OptanonAlertBoxClosed=2026-05-31T22:00:00.000Z; path=/; domain=.lrqa.com; expires=' + expiry + '; SameSite=Lax';
      document.cookie = 'OptanonConsent=isGpcEnabled=0&datestamp=Sun+May+31+2026+22%3A21%3A50+GMT%2B0200+(Central+European+Summer+Time)&version=202405.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=978070bd-a611-4ba7-98d8-61f5306f62b8&interactionCount=1&isAnonUser=1&landingPath=https%3A%2F%2Fwww.lrqa.com%2Fde-de%2F&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&geolocation=GB%3BENG; path=/; domain=.lrqa.com; expires=' + expiry + '; SameSite=Lax';
      return document.cookie;
    })()`
  );
}

async function getStorageState(client) {
  const [cookiesResult, localStorageResult] = await Promise.all([
    client.send('Network.getAllCookies'),
    cdpEval(
      client,
      `(() => {
        const origins = [];
        origins.push({
          origin: location.origin,
          localStorage: Object.entries(localStorage).map(([name, value]) => ({ name, value })),
        });
        return origins;
      })()`
    ),
  ]);
  const cookies = (cookiesResult.cookies || []).map((cookie) => ({
    name: cookie.name,
    value: cookie.value,
    domain: cookie.domain,
    path: cookie.path,
    expires: cookie.expires,
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: cookie.sameSite,
  }));
  return {
    cookies,
    origins: localStorageResult || [],
  };
}

async function writeStorageState(client) {
  const state = await getStorageState(client);
  await writeFile(STORAGE_STATE_PATH, `${JSON.stringify(state, null, 2)}\n`);
  return state;
}

async function loadStorageState() {
  try {
    const raw = await readFile(STORAGE_STATE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function applyStorageState(client, state) {
  if (!state?.cookies?.length) return;
  const domainCookies = state.cookies.filter((cookie) => /(^|\.)lrqa\.com$/i.test(cookie.domain));
  for (const cookie of domainCookies) {
    const parts = [
      `${cookie.name}=${cookie.value}`,
      `path=${cookie.path || '/'}`,
      cookie.domain ? `domain=${cookie.domain}` : null,
      cookie.secure ? 'secure' : null,
      cookie.httpOnly ? 'HttpOnly' : null,
      cookie.sameSite ? `SameSite=${cookie.sameSite}` : null,
    ].filter(Boolean);
    await cdpEval(
      client,
      `(() => {
        document.cookie = ${JSON.stringify(parts.join('; '))};
        return document.cookie;
      })()`
    );
  }
}

async function main() {
  await mkdir(TASKS[0].outputDir, { recursive: true });
  const debugPort = Number(process.env.CHROME_DEBUG_PORT || 0) || (await findFreePort());
  const { child, userDataDir } = await launchChrome(debugPort);
  const pageInfo = {};
  const styleInfo = {};
  const sectionInfo = {};
  const screenshots = [];
  const heroScreenshots = [];
  const issues = [];
  const navShots = [];
  let consentState = await loadStorageState();
  const homeUrl = 'https://www.lrqa.com/';

  try {
    const wsUrl = await createTab(debugPort);
    const client = await connect(wsUrl);
    try {
      // Consent prep: try the obvious OneTrust button first, then fall back to direct cookie state.
      await openPage(client, homeUrl);
      let state = await detectPageState(client);
      pageInfo.initial = state;
      const consentClick = await acceptCookiesIfVisible(client);
      if (consentClick?.clicked) issues.push(`Cookie banner clicked via "${consentClick.text}" (${consentClick.selector}).`);
      await sleep(1000);
      if (await hasCookieBanner(client)) {
        await setConsentCookies(client);
        await sleep(500);
      }
      await openPage(client, homeUrl);
      await sleep(1500);
      state = await detectPageState(client);
      pageInfo.final = state;

      if (await hasCookieBanner(client)) {
        issues.push('Cookie banner still visible after consent prep.');
      }

      const finalUrl = state.url;
      const finalTitle = state.title;
      const finalH1 = state.h1Text;

      if (/cookie|privacy|guideline|policy|consent/i.test(`${finalUrl} ${finalTitle} ${finalH1}`)) {
        issues.push(`Final state still looks like a service page: url="${finalUrl}" title="${finalTitle}" h1="${finalH1}"`);
      }

      consentState = await writeStorageState(client);
      await sleep(2000);
      await cdpEval(client, `window.scrollTo(0, 0)`);

      styleInfo.root = await getRootStyleData(client);
      styleInfo.h1 = await getTextStyles(client, 'main h1, h1');
      styleInfo.h2 = await getTextStyles(client, 'main h2, h2');
      styleInfo.body = await getTextStyles(client, 'main p');
      sectionInfo.sections = await listSections(client);

      for (const width of VIEWPORTS) {
        await client.send('Emulation.setDeviceMetricsOverride', {
          width,
          height: 1200,
          deviceScaleFactor: 1,
          mobile: width <= 430,
          screenWidth: width,
          screenHeight: 1200,
        });
        await openPage(client, finalUrl);
        await sleep(3000);
        await cdpEval(client, `window.scrollTo(0, 0)`);
        await sleep(500);
        await applyStorageState(client, consentState);
        const file = `/opt/roknord-site/docs/screenshots/reference/lrqa-${width}.png`;
        await saveScreenshot(client, file, { fullPage: true });
        screenshots.push(file);

        const heroFile = `/opt/roknord-site/docs/screenshots/reference/lrqa-hero-${width}.png`;
        await saveScreenshot(client, heroFile, {
          fullPage: false,
          clip: { x: 0, y: 0, width, height: 1200, scale: 1 },
        });
        heroScreenshots.push(heroFile);
      }

      await client.send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 1200,
        deviceScaleFactor: 1,
        mobile: false,
        screenWidth: 1440,
        screenHeight: 1200,
      });
      await openPage(client, finalUrl);
      await sleep(1500);
      await cdpEval(client, `window.scrollTo(0, 0)`);
      await applyStorageState(client, consentState);
      const navOpen = await clickVisibleText(client, [/solutions/i, /branchen/i, /dienstleistungen/i]);
      await sleep(1200);
      await saveScreenshot(client, '/opt/roknord-site/docs/screenshots/reference/lrqa-nav-open-1440.png', {
        fullPage: false,
        clip: { x: 0, y: 0, width: 1440, height: 1200, scale: 1 },
      });
      navShots.push({ kind: 'nav-open', viewport: 1440, result: navOpen });

      await openPage(client, finalUrl);
      await sleep(1500);
      await cdpEval(client, `window.scrollTo(0, 0)`);
      await applyStorageState(client, consentState);
      const searchOpen = await clickVisibleText(client, [/search/i]);
      await sleep(1200);
      await saveScreenshot(client, '/opt/roknord-site/docs/screenshots/reference/lrqa-search-open-1440.png', {
        fullPage: false,
        clip: { x: 0, y: 0, width: 1440, height: 1200, scale: 1 },
      });
      navShots.push({ kind: 'search-open', viewport: 1440, result: searchOpen });

      await client.send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 1200,
        deviceScaleFactor: 1,
        mobile: true,
        screenWidth: 390,
        screenHeight: 1200,
      });
      await openPage(client, finalUrl);
      await sleep(1500);
      await cdpEval(client, `window.scrollTo(0, 0)`);
      await applyStorageState(client, consentState);
      const mobileMenu = await clickVisibleText(client, [/menü/i, /menu/i]);
      await sleep(1200);
      await saveScreenshot(client, '/opt/roknord-site/docs/screenshots/reference/lrqa-mobile-menu-390.png', {
        fullPage: false,
        clip: { x: 0, y: 0, width: 390, height: 1200, scale: 1 },
      });
      navShots.push({ kind: 'mobile-menu', viewport: 390, result: mobileMenu });
    } finally {
      client.close();
    }
  } finally {
    try {
      child.kill('SIGKILL');
    } catch {}
    try {
      await rm(userDataDir, { recursive: true, force: true });
    } catch {}
  }

  const result = {
    pageInfo,
    styleInfo,
    sectionInfo,
    screenshots,
    heroScreenshots,
    navShots,
    issues,
  };
  const out = '/opt/roknord-site/docs/screenshots/lrqa-homepage-audit.json';
  await writeFile(out, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
