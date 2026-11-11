import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const base = "http://127.0.0.1:4388";
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || chromium.executablePath(),
  args: ["--no-sandbox"],
});
const output = process.env.REVIEW_OUTPUT || "";
if (output) fs.mkdirSync(output, { recursive: true });
const errors = [];
const routes = [
  "/", "/testing-labs/", "/medical-labs/", "/certification-bodies/",
  "/product-certification/", "/inspection-bodies/", "/calibration-labs/",
  "/proficiency-testing/", "/halal-certification/",
  "/primary-accreditation/", "/competence-confirmation/", "/accreditation-scope/",
  "/corrective-actions/", "/special-directions/", "/occupational-safety/",
  "/company/", "/company/mission/", "/contacts/", "/requisites/",
  "/materials/", "/materials/audit-report-example/",
  "/materials/karta-riskov-pk-os-smk-2026/",
  "/news/", "/152-fz/", "/152-fz/audit/",
  "/privacy-policy/", "/personal-data-consent/", "/account/", "/ral-atlas/",
  "/404/",
];
const shots = new Set([
  "1440:/testing-labs/",
  "1440:/news/",
  "1440:/materials/",
  "390:/contacts/",
  "390:/requisites/",
  "390:/testing-labs/",
  "390:/privacy-policy/",
  "390:/152-fz/",
]);

try {
  for (const width of [1440, 768, 390, 320]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      locale: "ru-RU",
      reducedMotion: "reduce",
    });
    await context.route("**/*", (route) =>
      route.request().url().startsWith(base) ? route.continue() : route.abort(),
    );
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push({ width, error: error.message }));
    page.on("request", (req) => {
      if (req.method() === "POST") errors.push({ width, error: "Unexpected POST request" });
    });

    for (const route of routes) {
      const response = await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 25000 });
      if (route==="/404/") {
        assert.ok([200,404].includes(response?.status()), "404 static fallback response");
      } else {
        assert.equal(response?.status(), 200, route + " HTTP " + response?.status());
      }
      assert.equal(await page.locator("main h1").count(), 1, route + " has exactly one H1");
      const cookieDecline = page.locator("[data-cookie-decline]");
      if (await cookieDecline.count() && await cookieDecline.isVisible()) await cookieDecline.click();
      if (route==="/testing-labs/" || route==="/occupational-safety/") {
        assert.equal(await page.locator(".service-hero__facts li").count(), 3);
        assert.equal(await page.locator(".service-jumpnav a").count(), 5);
        assert.equal(await page.locator(".service-faq details").count(), 4);
        await page.locator(".service-faq summary").first().click();
        assert.equal(await page.locator(".service-faq details").first().getAttribute("open"), "");
      }
      if (route==="/news/") {
        assert.equal(await page.locator(".news-card").count(), 4);
        await page.locator('[data-news-filter="occupational-safety"]').click();
        assert.equal(await page.locator(".news-card:visible").count(), 1);
        assert.equal(await page.locator('[data-news-filter="occupational-safety"]').getAttribute("aria-pressed"), "true");
        await page.locator('[data-news-filter="all"]').click();
        assert.equal(await page.locator(".news-card:visible").count(), 4);
      }
      if (route==="/contacts/") assert.equal(await page.locator("form[data-contact-form]").count(), 1);
      if (route==="/requisites/") assert.equal(await page.locator("[data-copy-detail]").count(), 2);
      if (route==="/privacy-policy/" || route==="/personal-data-consent/") {
        await page.locator("[data-legal-toc]:not([hidden])").waitFor({ timeout: 8000 });
        assert.ok(await page.locator("[data-legal-toc-links] li").count() > 3);
      }
      if (route==="/account/") {
        assert.equal(await page.locator("#login-form").count(), 1);
        assert.equal(await page.locator("#portal-workspace").count(), 1);
      }
      if (route==="/152-fz/") assert.equal(await page.locator(".pdn-hub__process-list li").count(), 3);
      if (route==="/materials/") assert.equal(await page.locator(".library-card").count(), 3);

      const overflow = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        width: window.innerWidth,
      }));
      assert.ok(overflow.doc <= overflow.width + 1,
        "Unexpected horizontal overflow on " + route + " at " + width + "px: " + JSON.stringify(overflow));

      const shot = width + ":" + route;
      if (output && shots.has(shot)) {
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
        await page.waitForTimeout(120);
        await page.screenshot({
          path: path.join(output, (route.replaceAll("/", "-").replace(/^-|-$/g, "") || "home") + "-" + width + ".png"),
          fullPage: true,
          animations: "disabled",
        });
      }
      console.log("PASS " + width + "px " + route);
    }
    await context.close();
  }
  assert.deepEqual(errors, [], "no uncaught page errors or unexpected submissions");
} finally {
  await browser.close();
}
