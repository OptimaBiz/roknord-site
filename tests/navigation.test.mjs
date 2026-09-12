import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = 'http://127.0.0.1:4387';
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
const errors = [];
try {
  for (const [width, height] of [[1440, 900], [1280, 800], [1024, 768], [768, 900], [767, 900], [390, 844], [320, 568], [667, 375]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    await context.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base);
    await page.locator('[data-cookie-decline]').click();
    assert.equal(await page.locator('footer a').filter({ hasText: 'РАЛ-Атлас' }).count(), 0);
    assert.equal(await page.locator('.site-nav > details').count(), 2);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (width >= 768) {
      for (const href of ['/news/', 'https://atlas.roknord.ru/']) {
        assert.ok(await page.locator('.utility-nav a[href="' + href + '"]').isVisible());
      }
      assert.equal(await page.locator('.utility-nav').evaluate(e => e.scrollWidth > e.clientWidth), false);
      const box = await page.locator('.utility-nav').boundingBox();
      const cta = await page.locator('.header-service .service-cta:not(.service-cta--mobile)').boundingBox();
      assert.ok(box.x + box.width <= cta.x, 'utility navigation must not overlap CTA');
      if (process.env.REVIEW_OUTPUT && width === 1440) await page.screenshot({ path: process.env.REVIEW_OUTPUT + '/navigation-desktop.png' });
    } else {
      const toggle = page.locator('.mobile-menu > summary');
      const panel = page.locator('.mobile-menu-panel');
      await page.evaluate(() => scrollTo({ top: 600, behavior: 'instant' }));
      const before = await page.evaluate(() => scrollY);
      await toggle.click();
      await page.waitForTimeout(80);
      assert.equal(await toggle.getAttribute('aria-label'), 'Закрыть меню');
      assert.equal(await page.locator('main').evaluate(e => e.inert), true);
      assert.equal(await page.locator('.header .brand').evaluate(e => e.inert), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.ok(await panel.evaluate(e => Math.abs(e.getBoundingClientRect().bottom - innerHeight) <= 2));
      assert.ok(await toggle.evaluate(e => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= document.querySelector('.mobile-menu-panel').getBoundingClientRect().top; }), 'close control stays above panel after scroll lock');
      assert.ok(await panel.evaluate(e => e.scrollHeight <= e.clientHeight + 1), 'only the content area scrolls');
      for (const href of ['/news/', 'https://atlas.roknord.ru/', '/account/']) {
        assert.ok(await panel.locator('a[href="' + href + '"]').isVisible());
      }
      if (process.env.REVIEW_OUTPUT) await page.screenshot({ path: process.env.REVIEW_OUTPUT + '/navigation-' + width + '.png' });
      await toggle.focus();
      await page.keyboard.press('Shift+Tab');
      assert.ok(await page.locator('.mobile-menu-cta').evaluate(e => e === document.activeElement), 'reverse focus wraps');
      await page.keyboard.press('Tab');
      assert.ok(await toggle.evaluate(e => e === document.activeElement), 'forward focus wraps');
      const groups = page.locator('.mobile-menu-group');
      await groups.nth(0).locator('summary').click();
      assert.equal(await groups.nth(0).locator('summary').getAttribute('aria-expanded'), 'true');
      assert.equal(await page.locator('#mobile-services a').count(), 7);
      assert.equal(await page.locator('#mobile-services details').count(), 0);
      await groups.nth(1).locator('summary').click();
      assert.equal(await groups.nth(0).getAttribute('open'), null, 'one group at a time');
      assert.equal(await page.locator('#mobile-audiences a').count(), 8);
      const actionBox = await page.locator('.mobile-menu-cta').boundingBox();
      assert.ok(actionBox.y >= 0 && actionBox.y + actionBox.height <= height, 'CTA stays visible');
      const tooSmall = await panel.locator('a, summary').evaluateAll(items => items.filter(e => e.getClientRects().length && e.getBoundingClientRect().height < 44).map(e => e.textContent));
      assert.deepEqual(tooSmall, [], '44px touch targets');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(80);
      assert.equal(await page.locator('main').evaluate(e => e.inert), false);
      assert.ok(await toggle.evaluate(e => e === document.activeElement));
      assert.ok(Math.abs(await page.evaluate(() => scrollY) - before) <= 1, 'scroll restored on close');
      await toggle.click();
      await page.waitForTimeout(50);
      await page.locator('.mobile-menu-cta').click();
      await page.waitForTimeout(100);
      assert.equal(await page.locator('main').evaluate(e => e.inert), false);
      assert.ok(await page.locator('#contact').evaluate(e => e === document.activeElement));
      assert.ok(await page.locator('#contact').evaluate(e => Math.abs(e.getBoundingClientRect().top) < 80));
      await toggle.click();
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.waitForTimeout(80);
      assert.equal(await page.locator('.mobile-menu').getAttribute('open'), null);
      assert.equal(await page.locator('main').evaluate(e => e.inert), false);
      assert.equal(await page.locator('body').evaluate(e => getComputedStyle(e).position === 'fixed'), false);
      await page.setViewportSize({ width, height });
      await page.goto(base + '/competence-confirmation/');
      await toggle.click();
      await page.waitForTimeout(80);
      assert.equal(await page.locator('#mobile-services a[aria-current="page"]').count(), 1);
      assert.ok(await page.locator('#mobile-services a[aria-current="page"]').isVisible());
      await page.keyboard.press('Escape');
    }
    await context.close();
    console.log('PASS navigation ' + width + '×' + height);
  }
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  await context.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
  const page = await context.newPage();
  await page.goto(base + '/account/');
  await page.locator('.mobile-menu > summary').click();
  await page.locator('.mobile-menu-group > summary').first().click();
  assert.ok(await page.locator('#mobile-services a').first().isVisible(), 'native disclosure works without JS');
  await page.locator('.mobile-menu > summary').click();
  assert.equal(await page.locator('.mobile-menu-panel').isVisible(), false);
  await context.close();
  assert.deepEqual(errors, []);
  console.log('PASS navigation without JavaScript; no browser errors');
} finally {
  await browser.close();
}
