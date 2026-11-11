import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const source = (p) => fs.readFileSync(path.resolve("src",p), "utf8");
const service = source("components/ServicePage.astro");
const serviceCss = source("styles/service.css");
const interior = source("styles/interior.css");
const homepage = source("components/Homepage.astro");
const hero = source("components/Hero.astro");
const contacts = source("pages/contacts/index.astro");
const reqs = source("pages/requisites/index.astro");
const news = source("pages/news/index.astro");
const pdn = source("pages/152-fz/index.astro");
const pdnAudit = source("pages/152-fz/audit/index.astro");
const privacy = source("pages/privacy-policy/index.astro");
const consent = source("pages/personal-data-consent/index.astro");
const account = source("pages/account/index.astro");

test("the approved homepage remains unchanged by interior imports", () => {
  assert.doesNotMatch(homepage, /interior\.css|service\.css/);
  assert.doesNotMatch(hero, /interior\.css|service\.css/);
  assert.match(hero, /posterSrc="\/images\/hero\/roknord-hero-poster.webp"/);
  assert.match(hero, /mobilePosterSrc="\/images\/hero\/roknord-hero-poster-mobile.webp"/);
});
test("all service templates retain API forms and expose anchored steps", () => {
  for(const id of ["service-checks","service-result","service-start","service-faq"]) {
    assert.match(service, new RegExp(`id="${id}"`));
    assert.match(service, new RegExp(`href="#${id}"`));
  }
  assert.match(service, /<ContactForm/);
  assert.match(service, /heroFacts\.map/);
  assert.match(service, /class="service-faq"/);
  assert.match(serviceCss, /prefers-reduced-motion/);
});
test("news filtering is progressive and accessible", () => {
  assert.match(news, /data-news-filter="all" aria-pressed="true"/);
  assert.match(news, /aria-live="polite"/);
  assert.equal((news.match(/data-news-category="personal-data"/g)||[]).length, 3);
  assert.equal((news.match(/data-news-category="occupational-safety"/g)||[]).length, 1);
  assert.match(interior, /news-card\[hidden\]/);
});
test("contacts uses the same validated contact component and local anchor", () => {
  assert.match(contacts, /<ContactForm/);
  assert.match(contacts, /href="#contact"/);
  const form = source("components/ContactForm.astro");
  assert.match(form, /personal_data_consent/);
  assert.match(form, /contact\.php/);
  assert.match(form, /consent_timestamp/);
});
test("company credentials remain literal and copy feedback accessible", () => {
  assert.match(reqs, /7807406530/);
  assert.match(reqs, /1267800054686/);
  assert.match(reqs, /data-copy-detail/);
  assert.match(reqs, /aria-live="polite"/);
});
test("legal wording is not replaced by the optional TOC", () => {
  for(const page of [privacy,consent]) {
    assert.match(page, /<LegalToc \/>/);
    assert.match(page, /class="legal-page__section"/);
  }
  const toc = source("components/LegalToc.astro");
  assert.match(toc, /document\.createElement\("a"\)/);
  assert.match(toc, /toc\.hidden = false/);
});
test("152-FZ hub enhanced, dedicated audit and portal logic retained", () => {
  assert.match(pdn, /id="pdn-hub-process"/);
  assert.match(pdnAudit, /<PdnAuditLeadForm \/>/);
  assert.match(account, /import '..\/..\/scripts\/account'/);
  assert.match(account, /id="portal-workspace"/);
  assert.match(account, /id="login-form"/);
});
test("new scoped CSS doesn't override global navigation or the homepage", () => {
  assert.doesNotMatch(interior, /(^|\n)\s*(body|html|:root|\.hero-editorial|\.site-header)\s*\{/);
  assert.match(interior, /\.news-page/);
  assert.match(interior, /\.company-page/);
  assert.match(interior, /\.legal-page/);
  for(const style of [interior,serviceCss]) assert.equal((style.match(/\{/g)||[]).length,(style.match(/\}/g)||[]).length);
});
