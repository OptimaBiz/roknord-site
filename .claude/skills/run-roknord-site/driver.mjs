#!/usr/bin/env node
/**
 * driver.mjs — Playwright driver for roknord-site
 *
 * Usage:
 *   node driver.mjs [command] [args...]
 *
 * Commands:
 *   screenshot [filename] [--mobile]   Take a viewport screenshot (default: shot.png)
 *   scroll <sectionId> [filename]      Scroll to section and screenshot
 *   smoke                              Run HTTP smoke checks, exit 1 on failure
 *   fullpage [filename]                Full-page screenshot
 *
 * The dev server must already be running on PORT (default 4321).
 * Set PORT env var to override.
 *
 * Examples:
 *   node driver.mjs screenshot
 *   node driver.mjs screenshot hero.png --mobile
 *   node driver.mjs scroll directions cards.png
 *   node driver.mjs smoke
 *   node driver.mjs fullpage full.png
 */

import { chromium } from 'playwright';

const PORT = process.env.PORT ?? '4321';
const BASE = `http://localhost:${PORT}`;
const [,, cmd = 'screenshot', ...rest] = process.argv;

async function withPage(fn, opts = {}) {
  const mobile = opts.mobile ?? false;
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext(
    mobile
      ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }
      : { viewport: { width: 1280, height: 800 } }
  );
  const page = await ctx.newPage();
  try {
    await fn(page);
  } finally {
    await browser.close();
  }
}

async function dismissCookieBanner(page) {
  try {
    const btn = page.locator('[data-cookie-accept]');
    if (await btn.isVisible({ timeout: 1500 })) await btn.click();
  } catch { /* banner not present */ }
}

async function smoke() {
  const checks = [
    { url: '/', expect: 'Рокнорд',       label: 'Homepage renders' },
    { url: '/', expect: 'scenario-card', label: 'Scenario cards present' },
    { url: '/', expect: 'hero-title',    label: 'Hero title present' },
    { url: '/primary-accreditation/', expect: null, label: 'Primary accreditation route' },
  ];
  let passed = 0, failed = 0;
  for (const c of checks) {
    const res = await fetch(`${BASE}${c.url}`);
    const body = await res.text();
    const ok = c.expect === null ? res.status < 500 : res.ok && body.includes(c.expect);
    console.log(`${ok ? '✓' : '✗'} ${c.label}${ok ? '' : ` (${res.status})`}`);
    ok ? passed++ : failed++;
  }
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

async function screenshot(filename = 'shot.png', { mobile = false } = {}) {
  await withPage(async (page) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await dismissCookieBanner(page);
    await page.screenshot({ path: filename, type: 'png' });
    console.log(`Screenshot saved: ${filename}`);
  }, { mobile });
}

async function scrollSection(sectionId, filename = 'section.png') {
  await withPage(async (page) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await dismissCookieBanner(page);
    await page.evaluate((id) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, sectionId);
    // Force card animations — IntersectionObserver doesn't fire on programmatic scroll in headless
    await page.evaluate(() => {
      document.querySelectorAll('.scenario-card--featured').forEach((c) => {
        c.classList.add('card-animating');
        c.addEventListener('animationend', () => {
          c.classList.remove('card-animating');
          c.classList.add('card-entered');
        }, { once: true });
      });
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: filename, type: 'png' });
    console.log(`Section screenshot saved: ${filename}`);
  });
}

async function fullpage(filename = 'fullpage.png') {
  await withPage(async (page) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await dismissCookieBanner(page);
    await page.screenshot({ path: filename, fullPage: true, type: 'png' });
    console.log(`Full-page screenshot saved: ${filename}`);
  });
}

switch (cmd) {
  case 'smoke':
    await smoke();
    break;
  case 'screenshot': {
    const mobile = rest.includes('--mobile');
    const file = rest.find(a => !a.startsWith('--')) ?? 'shot.png';
    await screenshot(file, { mobile });
    break;
  }
  case 'scroll': {
    const [sectionId, file = 'section.png'] = rest;
    if (!sectionId) { console.error('Usage: scroll <sectionId> [filename]'); process.exit(1); }
    await scrollSection(sectionId, file);
    break;
  }
  case 'fullpage': {
    const [file = 'fullpage.png'] = rest;
    await fullpage(file);
    break;
  }
  default:
    console.error(`Unknown command: ${cmd}\nCommands: smoke, screenshot, scroll, fullpage`);
    process.exit(1);
}
