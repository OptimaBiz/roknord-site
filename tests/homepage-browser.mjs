import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const base = "http://127.0.0.1:4387";
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || chromium.executablePath(),
  args: ["--no-sandbox"],
});
const failures = [];
const output = process.env.REVIEW_OUTPUT || "";
if (output) fs.mkdirSync(output, { recursive: true });

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
    page.on("pageerror", (error) => failures.push({ width, message: error.message }));
    page.on("request", (request) => {
      if (request.method() === "POST") failures.push({ width, message: "Unexpected form POST" });
    });
    const response = await page.goto(base + "/", { waitUntil: "domcontentloaded" });
    assert.equal(response?.status(), 200, `homepage ${width}`);
    await page.locator(".hero-media__poster").waitFor();
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(
      await page.locator(".hero-media__poster").getAttribute("src"),
      "/images/hero/roknord-hero-poster.webp",
      "keep original hero background",
    );
    assert.equal(await page.locator("img[src='/images/hero/roknord-hero-poster-mobile.webp']").count(), 0, "mobile background remains a picture source");
    assert.equal(
      await page.locator('source[media="(max-width: 47.99rem)"]').getAttribute("srcset"),
      "/images/hero/roknord-hero-poster-mobile.webp",
    );
    assert.equal(await page.locator(".situations-list--primary .situation-row").count(), 3);
    assert.equal(await page.locator(".situations-list--additional .situation-row").count(), 2);
    assert.equal(await page.locator(".situations-more").getAttribute("open"), null);
    assert.equal(await page.locator(".hero-action--primary").getAttribute("href"), "#express-assessment");
    assert.ok(await page.locator("#result .audit-outcome__sample").count());
    assert.equal(await page.locator("form[data-express-form]").count(), 1);
    assert.equal(await page.locator("form[data-contact-form]").count(), 1);
    assert.equal(await page.locator("form[data-express-form] input[name=personal_data_consent]").count(), 1);
    assert.equal(await page.locator("form[data-contact-form] input[name=personal_data_consent]").count(), 1);

    const mobile = width < 768;
    assert.equal(await page.locator(".hero-editorial__mobile-proof").isVisible(), mobile);
    assert.equal(await page.locator(".hero-editorial__secondary").isVisible(), !mobile);
    const cookieDecline = page.locator("[data-cookie-decline]");
    if (await cookieDecline.isVisible()) await cookieDecline.click();
    await page.locator(".situations-more > summary").click();
    assert.equal(await page.locator(".situations-more").getAttribute("open"), "");
    assert.ok(await page.locator("#scenario-scope-audit").isVisible());
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
      `horizontal overflow at ${width}px`,
    );
    await page.locator(".hero-action--primary").click();
    await page.waitForTimeout(180);
    assert.equal(new URL(page.url()).hash, "#express-assessment");
    assert.ok(
      Math.abs(await page.locator("#express-assessment").evaluate((node) => node.getBoundingClientRect().top)) < 220,
      `quick enquiry visible after hero CTA at ${width}px`,
    );
    if (output && [1440, 390].includes(width)) {
      await page.screenshot({ path: path.join(output, `homepage-${width}.png`), fullPage: true });
    }
    await context.close();
    console.log(`PASS homepage ${width}px`);
  }
  assert.deepEqual(failures, [], "no browser errors or accidental submissions");
} finally {
  await browser.close();
}
