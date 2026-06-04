---
name: run-roknord-site
description: Run, start, build, screenshot, or verify the roknord-site Astro web app. Use this skill when asked to launch the site, check a UI change, take a screenshot, smoke-test the dev server, or verify a section looks correct.
---

# run-roknord-site

Astro static site (SSG + dev server). Driven via `driver.mjs` — a Playwright Node.js script that launches headless Chromium, dismisses the cookie banner automatically, and exposes `smoke`, `screenshot`, `scroll`, and `fullpage` commands.

All paths below are relative to `/opt/roknord-site/`.

## Prerequisites

- Node ≥ 22 (confirmed: v22.22.2 — `node --version`)
- Playwright browsers already cached at `~/.cache/ms-playwright/` (chromium-1223)
- `playwright` devDependency in `package.json` — installed via `npm install`

No `apt-get` packages needed. No `xvfb` needed (Playwright runs headless).

## Setup

```bash
npm install      # installs astro + playwright devDep
```

## Start dev server

```bash
npm run dev -- --port 4321 --host 0.0.0.0 &
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/
# expect: 200
```

Kill if already running: `pkill -f "astro dev"`

## Agent path — driver.mjs

Primary tool. Server must be running first.

```bash
# Smoke check (exit 1 on failure)
node .claude/skills/run-roknord-site/driver.mjs smoke

# Desktop screenshot (1280×800)
node .claude/skills/run-roknord-site/driver.mjs screenshot shot.png

# Mobile screenshot (390×844 @2x)
node .claude/skills/run-roknord-site/driver.mjs screenshot shot-mobile.png --mobile

# Scroll to section and screenshot (forces card animations)
node .claude/skills/run-roknord-site/driver.mjs scroll directions directions.png
node .claude/skills/run-roknord-site/driver.mjs scroll pricing pricing.png
node .claude/skills/run-roknord-site/driver.mjs scroll contact contact.png

# Full-page screenshot
node .claude/skills/run-roknord-site/driver.mjs fullpage full.png
```

Override port: `PORT=3000 node .claude/skills/run-roknord-site/driver.mjs smoke`

## Human path

```bash
npm run dev
# opens http://localhost:4321 in browser
```

## Build

```bash
npm run build
# output in dist/
```

## Key section IDs

| ID | Section |
|----|---------|
| `top` | Hero |
| `directions` | Основные сценарии помощи |
| `pricing` | Стоимость |
| `contact` | Контактная форма |

## Gotchas

- **IntersectionObserver in headless:** programmatic `scrollIntoView` does not trigger `IntersectionObserver`. Scenario cards stay `opacity:0` (collapsed clip-path). `driver.mjs scroll` handles this by force-adding `card-animating` class after scrolling and waiting 800ms.

- **Cookie banner:** appears on every fresh page load and covers content in screenshots. `driver.mjs` dismisses it automatically via `[data-cookie-accept]` click before screenshotting.

- **Port already in use:** `npm run dev` silently fails if port 4321 is taken. Kill first: `pkill -f "astro dev"`, then restart.

- **Playwright browsers:** `npm install --with-deps` requires sudo (will fail in this container). Run `npx playwright install chromium` (no `--with-deps`) — browsers download to `~/.cache/ms-playwright/` without needing system packages. Already done in this environment.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Cannot find package 'playwright'` | Run `npm install` |
| `net::ERR_CONNECTION_REFUSED` | Dev server not running — start with `npm run dev -- --port 4321 --host 0.0.0.0 &` |
| Screenshot shows collapsed/invisible cards | Use `scroll` command instead of `screenshot`, or cards are in the `#directions` section which needs `card-animating` force |
| `Failed to install browsers` with sudo error | Use `npx playwright install chromium` (not `--with-deps`) |
