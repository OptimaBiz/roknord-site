import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

// Lightweight source-level regression checks. Run with:
// node --test tests/homepage-experience.test.mjs
const read = (name) => fs.readFileSync(path.resolve("src", name), "utf8");
const page = read("components/Homepage.astro");
const hero = read("components/Hero.astro");
const scenario = read("components/Scenarios.astro");
const sample = read("components/InspectionLogic.astro");
const express = read("components/ExpressAssessment.astro");
const expertise = read("components/ExpertiseTeamSection.astro");
const content = read("data/homepage.ts");

test("original hero image, mobile poster, and overlay stay unchanged", () => {
  assert.match(hero, /posterSrc="\/images\/hero\/roknord-hero-poster.webp"/);
  assert.match(hero, /mobilePosterSrc="\/images\/hero\/roknord-hero-poster-mobile.webp"/);
  assert.match(hero, /class="hero-editorial__veil"/);
  assert.match(hero, /hero-editorial__veil\{z-index:1;background:linear-gradient\(90deg,rgba\(0,31,26,\.46\)/);
});

test("homepage leads with the client scenario, then proof and fast enquiry", () => {
  const order = [
    "<Hero locale", "<Scenarios locale", "<InspectionLogic locale",
    "<ExpressAssessment locale", "<PricingSection locale", "<ProcessSection locale",
    "<ExpertiseTeamSection locale", "<TrustSection locale", "<AtlasBridge locale",
    "<FaqSection locale", "<ContactForm",
  ];
  const positions = order.map((fragment) => page.indexOf(fragment));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test("three primary scenarios are available, and two more remain reachable", () => {
  assert.match(scenario, /new Set\(\["scenario-primary-accreditation", "scenario-confirmation", "scenario-corrective-actions"\]\)/);
  assert.match(scenario, /<details class="situations-more">/);
  assert.match(scenario, /situations-list--additional/);
});

test("sample clearly describes an illustrative finding, not a client case", () => {
  assert.match(sample, /Учебный пример · не клиентский отчёт/);
  assert.match(sample, /не доказывает отсутствие компетентности/);
  assert.match(sample, /href="\/materials\/audit-report-example\/"/);
});

test("lead forms stay separate and keep consent and endpoint", () => {
  assert.match(hero, /href="#express-assessment"/);
  assert.match(page, /Детальный запрос/);
  assert.match(express, /Быстрый запрос · без оплаты/);
  assert.match(express, /href="#contact"/);
  assert.match(express, /name="personal_data_consent" type="checkbox" value="accepted" required/);
  assert.match(express, /https:\/\/api\.roknord\.ru\/contact\.php/);
});

test("team proof and updated copy support both languages", () => {
  assert.match(page, /<ExpertiseTeamSection locale=\{locale\} \/>/);
  assert.match(expertise, /locale === "en"/);
  for (const block of content.split("hero: {").slice(1)) {
    const heroCopy = block.split("scenarios: {")[0];
    assert.doesNotMatch(heroCopy, /НДС 22%|22% VAT/);
  }
});
