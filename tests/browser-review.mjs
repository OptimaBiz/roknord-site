import { chromium } from "playwright";
import assert from "node:assert/strict";
const base = "http://127.0.0.1:4387";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
  headless: true,
});
const routes = process.env.REVIEW_ROUTES?.split(',') || [
  "/",
  "/testing-labs/",
  "/medical-labs/",
  "/certification-bodies/",
  "/occupational-safety/",
  "/materials/",
  "/ral-atlas/",
  "/account/",
  "/news/",
  "/postanovlenie-805-ohrana-truda-2026/",
  "/152-fz/audit/",
];
const errors = [];
try {
  for (const width of [1440, 768, 390, 320]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await context.route("**/*", (route) =>
      route.request().url().startsWith(base) ? route.continue() : route.abort(),
    );
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push({ width, error: e.message }));
    for (const route of routes) {
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200, route);
      await page.waitForTimeout(200);
      const result = await page.evaluate(() => ({
        h1: document.querySelectorAll("h1").length,
        overflow: document.documentElement.scrollWidth > innerWidth,
        broken: [...document.querySelectorAll('a[href^="#"]')]
          .filter(
            (a) =>
              a.hash.length > 1 &&
              !document.getElementById(decodeURIComponent(a.hash.slice(1))),
          )
          .map((a) => a.hash),
      }));
      assert.equal(result.h1, 1, route);
      assert.equal(result.overflow, false, `${route} width ${width}`);
      assert.deepEqual(result.broken, [], route);
      if (route === "/") {
        assert.equal(
          await page
            .locator("video")
            .evaluate((v) => v.paused && !v.getAttribute("src")),
          true,
          "reduced motion prevents video load",
        );
        await page.locator("[data-cookie-decline]").click();
        if (await page.locator(".nav-dropdown>summary").last().isVisible()) {
          await page.locator(".nav-dropdown>summary").last().focus();
          await page.keyboard.press("Enter");
          assert.equal(
            await page.locator("#audiences-panel").isVisible(),
            true,
          );
          await page.keyboard.press("Escape");
          assert.equal(
            await page.locator("#audiences-panel").isVisible(),
            false,
          );
        } else {
          await page.locator(".mobile-menu>summary").click();
          assert.equal(
            await page.locator("main").evaluate((e) => e.inert),
            true,
          );
          await page.keyboard.press("Escape");
          assert.equal(
            await page.locator("main").evaluate((e) => e.inert),
            false,
          );
        }
        await page.locator(".hero-action--primary").click();
        await page.waitForTimeout(250);
        assert.ok(
          Math.abs(
            await page
              .locator("#contact")
              .evaluate((e) => e.getBoundingClientRect().top),
          ) < 80,
          "contact anchor",
        );
      }
      if (await page.locator('[data-article-toc]').count()) {
        for (const link of await page.locator('[data-article-toc] a').all()) {
          const target = await link.getAttribute('href');
          await page.locator(target).evaluate(e => e.scrollIntoView({block:'start'}));
          await page.waitForTimeout(100);
          assert.equal(await link.getAttribute('aria-current'), 'location', `scrollspy ${target} ${width}`);
        }
      }
      if (route === "/account/") {
        await page.locator("#portal-login").waitFor({ state: "visible" });
        assert.equal(
          await page.locator("script[data-roknord-metrika]").count(),
          0,
        );
        await page
          .locator("#login-form input[name=email]")
          .fill("demo@roknord.example");
        await page
          .locator("#login-form input[name=password]")
          .fill("Roknord-Demo-2026!");
        await page.locator("#login-form button").click();
        await page.locator("#portal-workspace").waitFor({ state: "visible" });
        await page.locator('.account-nav a[href="#documents"]').click();
        await page.waitForTimeout(150);
        assert.ok(await page.locator('#documents-title').evaluate(e => e.getBoundingClientRect().top >= Math.max(0, document.querySelector('.header').getBoundingClientRect().bottom)), 'cabinet anchor clears header');
        await page.evaluate(() => window.scrollTo(0, 0));
        assert.equal(await page.locator(".account-document").count(), 3);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          `cabinet overflow ${width}`,
        );
        if (process.env.REVIEW_OUTPUT && [1440, 390].includes(width))
          await page.screenshot({
            path: `${process.env.REVIEW_OUTPUT}/account-${width}.png`,
            fullPage: true,
          });
        await page.locator("#portal-logout").click();
        await page.locator("#portal-login").waitFor({ state: "visible" });
      }
      if (
        process.env.REVIEW_OUTPUT &&
        [1440, 390].includes(width) &&
        ["/testing-labs/", "/news/"].includes(route)
      )
        await page.screenshot({
          path: `${process.env.REVIEW_OUTPUT}/${route.split("/")[1]}-${width}.png`,
          fullPage: true,
        });
      console.log(`PASS ${width} ${route}`);
    }
    await context.close();
  }
  assert.deepEqual(errors, [], "browser JS errors");
  console.log("PASS all browser checks");
} finally {
  await browser.close();
}
