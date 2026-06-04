---
name: run-roknord-site
description: Run, start, build, screenshot, or verify the roknord-site Astro web app. Use this skill when asked to launch the site, check a UI change, take a screenshot, or smoke-test the dev server.
---

# run-roknord-site

Astro static site (Node 22 required). Dev server starts on port 4321. Driven via Playwright MCP tools in Claude Code sessions, or the `smoke.mjs` script for quick CLI verification.

Screenshot taken in this session: `.claude/skills/run-roknord-site/verified-desktop.png`

## Prerequisites

Node ≥ 22 (confirmed: v22.22.2). No extra apt packages needed.

```bash
node --version   # must be ≥ 22
npm install      # install deps if not done
```

## Start dev server

```bash
npm run dev -- --port 4321 --host 0.0.0.0 &
# wait ~3s then verify:
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/
# expect: 200
```

## Agent path — Playwright MCP

This project's Claude Code session has the `playwright` MCP server configured. Use it to navigate, screenshot, and interact:

```
mcp__playwright__browser_navigate  url="http://localhost:4321"
mcp__playwright__browser_resize    width=1280 height=800        # desktop
mcp__playwright__browser_resize    width=390  height=844        # mobile
mcp__playwright__browser_take_screenshot  filename="check.png"
mcp__playwright__browser_evaluate  function="() => document.title"
```

Scroll to a section:
```
mcp__playwright__browser_evaluate  function="() => document.getElementById('directions')?.scrollIntoView({ behavior: 'instant' })"
```

Force card animations (IntersectionObserver doesn't fire on programmatic scroll in headless):
```
mcp__playwright__browser_evaluate  function="() => {
  document.querySelectorAll('.scenario-card--featured').forEach(c => {
    c.classList.add('card-animating');
    c.addEventListener('animationend', () => {
      c.classList.remove('card-animating');
      c.classList.add('card-entered');
    }, { once: true });
  });
}"
```

## Agent path — smoke script

```bash
node .claude/skills/run-roknord-site/smoke.mjs 4321
# 4 passed, 0 failed
```

Checks: homepage renders, scenario cards present, hero title present, /primary-accreditation/ route not 500.

## Build (production)

```bash
npm run build
# output in dist/
```

## Human path

```bash
npm run dev
# opens http://localhost:4321 in browser automatically
```

## Key sections / IDs

| ID | Section |
|----|---------|
| `#top` | Hero |
| `#directions` | Основные сценарии помощи (scenario cards) |
| `#pricing` | Стоимость |
| `#contact` | Контактная форма |

## Gotchas

- **IntersectionObserver in headless:** Playwright's programmatic `scrollIntoView` does not trigger `IntersectionObserver`. Scenario cards stay `opacity:0` (collapsed clip-path). Use the force-animate snippet above to get the entered state before screenshotting cards.
- **Cookie banner overlaps:** A cookie consent panel appears on first load and can cover card content in screenshots. Either wait for it or dismiss via `mcp__playwright__browser_click target=".cookie-btn-accept"` (check actual selector).
- **Port already in use:** if dev server is already running from a previous session, `npm run dev` fails. Kill with `pkill -f "astro dev"` then restart.
- **Mobile animations:** hover effects use `@media (hover: hover)` — not triggered in desktop Playwright. Touch effects (`card-touching` class) must be set via `evaluate` to test them.
