#!/usr/bin/env node
/**
 * Smoke test for roknord-site dev server.
 * Usage: node smoke.mjs [port]
 * Checks key routes and prints pass/fail.
 */

const PORT = process.argv[2] ?? '4321';
const BASE = `http://localhost:${PORT}`;

const checks = [
  { url: '/', expect: 'Рокнорд', label: 'Homepage renders' },
  { url: '/', expect: 'scenario-card', label: 'Scenario cards present' },
  { url: '/', expect: 'hero-title', label: 'Hero title present' },
  { url: '/primary-accreditation/', expect: null, label: 'Primary accreditation route (200 or 404)' },
];

let passed = 0;
let failed = 0;

for (const check of checks) {
  try {
    const res = await fetch(`${BASE}${check.url}`);
    const body = await res.text();

    if (check.expect === null) {
      // Just check it doesn't 500
      if (res.status < 500) {
        console.log(`✓ ${check.label} (${res.status})`);
        passed++;
      } else {
        console.log(`✗ ${check.label} — got ${res.status}`);
        failed++;
      }
    } else if (!res.ok) {
      console.log(`✗ ${check.label} — HTTP ${res.status}`);
      failed++;
    } else if (!body.includes(check.expect)) {
      console.log(`✗ ${check.label} — "${check.expect}" not found in response`);
      failed++;
    } else {
      console.log(`✓ ${check.label}`);
      passed++;
    }
  } catch (e) {
    console.log(`✗ ${check.label} — ${e.message}`);
    failed++;
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
