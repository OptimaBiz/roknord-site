# CODEMAP
_generated: 2026-06-04 | files: 79 | components: 19 | styles: 11 | pages: 9_

## Project Overview
Astro SSG marketing site for Рокнорд — independent accreditation readiness consulting. Russian-language, no client framework (pure Astro + vanilla JS). Token-first CSS design system with dark navy / mint brand palette. Montserrat font. Dev server: `npm run dev -- --port 4321`. No database, no API routes — all pages are static.

## Directory Tree (annotated)
```
src/
  layouts/
    BaseLayout.astro      # HTML shell — imports global CSS, Header, Footer, CookiePanel, ScrollUpControl, LoginModal
  pages/
    index.astro           # Homepage — composes all main-page sections in order
    thank-you/            # Post-form submission confirmation
    primary-accreditation/
    testing-labs/
    certification-bodies/
    medical-labs/
    personal-data-consent/
    privacy-policy/
    materials/
      karta-riskov-pk-os-smk-2026/  # PDF landing page
  components/             # One component per section / UI unit
  styles/                 # Token-first CSS — no CSS-in-JS, no Tailwind

public/
  icons/                  # SVG icons (phone, envelope, account)
  images/materials/       # Material/document thumbnails (webp + png)
  pdf/                    # Downloadable PDFs
  favicon.svg / .ico

.agents/skills/           # Codex agent skills (brand, copy, UI, visual-reference)
.claude/skills/
  run-roknord-site/       # Playwright driver + smoke.mjs + SKILL.md
.codex/agents/            # Agent role configs (TOML)
docs/                     # Design canon, implementation brief, visual QA reports
```

## Component Index

### src/layouts/BaseLayout.astro
- **purpose**: HTML `<head>` + site shell wrapper for all pages
- **props**: `title: string`, `description: string`
- **slot**: page `<main>` content
- **imports**: Header, Footer, CookiePanel, ScrollUpControl, LoginModal; `global.css`, `sections.css`
- **notes**: sets `theme-color` meta from CSS var `--color-bg` via inline script

### src/pages/index.astro
- **purpose**: homepage — full section composition
- **section order** (top → bottom):
  1. `Hero` — cinematic video hero, `#top`
  2. `RequestStrip` — phone + contact CTA bar
  3. `ExpertMaterial` — promo card for expert PDF/material
  4. `ProofStrip` — approach marquee strip, `#approach`
  5. `AudienceSection` — audience cards, `#deliverables`
  6. `Scenarios` — scenario cards, `#directions`
  7. `ProcessSection` — how-we-work steps, `#formats`
  8. `PricingSection` — pricing packages, `#pricing`
  9. `ContactForm` — lead form, `#contact`
  10. `FaqSection` — accordion FAQ, `#faq`

### src/components/Hero.astro (50 lines)
- **purpose**: cinematic full-viewport hero with background video
- **section id**: `#top`
- **imports**: HeroMedia
- **key elements**: `.hero-title` (h1), `.hero-lead` (descriptor), `.hero-links` (nav)
- **desktop**: title centered via `@media (min-width: 64rem)` in responsive.css

### src/components/HeroMedia.astro (67 lines)
- **purpose**: responsive video/poster switcher
- **props**: `posterSrc`, `posterAlt`, `mobileVideoMp4Src`, `videoMp4Src`, `videoWebmSrc`, `className`
- **logic**: shows mobile video on `max-width: 47.99rem`, desktop video above; falls back to poster

### src/components/Header.astro (190 lines)
- **purpose**: sticky site header with desktop mega-nav dropdowns + mobile menu
- **imports**: MobileMenu
- **data**: `serviceLinks`, `audienceLinks`, `utilityLinks`, `sectionLinks` (all inline arrays)
- **dropdowns**: `#services-panel`, `#audience-panel`
- **JS**: hover intent for dropdowns, scroll-based `--stuck` state

### src/components/MobileMenu.astro (48 lines)
- **purpose**: `<details>`-based mobile navigation drawer
- **props**: `serviceLinks`, `audienceLinks`, `utilityLinks` (passed from Header)

### src/components/RequestStrip.astro
- **purpose**: sticky contact bar — phone link + "Написать нам" CTA
- **JS**: `--stuck` class on scroll via IntersectionObserver on sentinel

### src/components/ExpertMaterial.astro
- **purpose**: promo card for expert PDF material download
- **visual**: dark promo card with magenta frame (`framed-card--dark`), visual block with cover image

### src/components/ProofStrip.astro
- **purpose**: "Наш подход" dark strip with scrolling marquee of audit objects
- **section id**: `#approach`

### src/components/AudienceSection.astro (228 lines)
- **purpose**: audience cards with photo backgrounds — "Кому помогаем"
- **section id**: `#deliverables`
- **data**: inline `audiences[]` array (5 items)
- **animations**: GPU-accelerated hover effects, photo overlay transitions

### src/components/Scenarios.astro (358 lines)
- **purpose**: scenario cards — "Основные сценарии помощи"
- **section id**: `#directions`
- **data**: inline `scenarios[]` array (5 items)
- **animations**:
  - Entrance: clip-path curtain reveal per card via per-card IntersectionObserver (threshold 0.12)
  - Desktop hover: translateY(-4px) + mint drop-shadow + mouse-tracking spotlight
  - Mobile touch: touchstart spotlight at touch coords, ripple burst, scan-line on deliverable badge
- **CSS classes**: `.card-animating` → `.card-entered` → `.card-touching` / `.card-rippling`
- **gotcha**: IntersectionObserver doesn't fire on programmatic scroll in headless browsers; use `driver.mjs scroll directions` which force-adds `card-animating`

### src/components/ProcessSection.astro (72 lines)
- **purpose**: "Как работаем" numbered steps
- **section id**: `#formats`
- **data**: inline `processSteps[]` array (5 items)

### src/components/PricingSection.astro (492 lines)
- **purpose**: pricing packages + included items table
- **section id**: `#pricing`
- **data**: `packages[]` (3 items), `commonItems[]`

### src/components/ContactForm.astro (628 lines)
- **purpose**: lead capture form with validation
- **section id**: `#contact`
- **props**: `id`, `eyebrow`, `title`, `subtitle` (optional; defaults used on homepage)
- **JS**: client-side validation, fetch POST, redirect to `/thank-you/`

### src/components/FaqSection.astro (64 lines)
- **purpose**: accordion FAQ
- **section id**: `#faq`
- **data**: inline `faq[]` array (7 items)
- **JS**: `<details>`-based accordion, no custom JS needed

### src/components/Footer.astro (87 lines)
- **purpose**: site footer with nav columns + contacts
- **data**: `footerServices[]`, `footerAudiences[]`, `footerCompany[]`, `footerDocs[]`, `footerContacts[]`

### src/components/CookiePanel.astro
- **purpose**: GDPR cookie consent banner
- **dismiss**: `[data-cookie-accept]` button, stores consent in localStorage key `roknord-cookie-consent`
- **driver note**: `driver.mjs` auto-clicks this before screenshotting

### src/components/ScrollUpControl.astro (62 lines)
- **purpose**: scroll-to-top button, visible after scrolling down
- **JS**: IntersectionObserver on a sentinel near top

### src/components/LoginModal.astro (307 lines)
- **purpose**: "Личный кабинет" login dialog (UI only, no backend yet)
- **trigger**: header CTA button with `data-login-open`
- **dismiss**: overlay click or `[data-login-close]`

### src/components/PlaceholderPage.astro
- **purpose**: reusable stub layout for unfinished section pages
- **props**: `eyebrow`, `title`, `description`, `points[]`, `note`
- **used by**: `/primary-accreditation/`, `/testing-labs/`, `/certification-bodies/`, `/medical-labs/`, `/personal-data-consent/`, `/privacy-policy/`

### src/components/ThankYouPage.astro (235 lines)
- **purpose**: post-form submission confirmation page
- **used by**: `/thank-you/`

## Style Architecture

All CSS is global (no scoped modules). Load order via `global.css` imports:

```
tokens.css        # CSS custom properties — colors, spacing, typography, z-index, transitions
global.css        # Base reset, body, typography defaults, focus styles, selection
sections.css      # Section wrapper classes (.section, .section--light, .section--dark, page-container)
utilities.css     # Shared UI patterns: .card, .card--light, .card--editorial, .framed-card, CTAs, form elements
content.css       # Section-specific layout: .scenario-grid, .audience-grid, .pricing-shell, .faq-shell, etc.
header.css        # Header, nav, dropdowns, mega-nav, utility bar
hero.css          # Hero section, HeroMedia, hero layout
promo.css         # ExpertMaterial promo card, framed card visuals
media.css         # Responsive image/video helpers
footer.css        # Footer layout, columns
responsive.css    # All @media overrides (48rem tablet, 64rem desktop, 47.99rem mobile-only)
```

**Token conventions** (from `tokens.css`):
- Colors: `--lrqa-navy`, `--lrqa-mint`, `--color-mint-action`, `--color-editorial-accent` (magenta)
- Spacing: `--space-1` … `--space-20` (0.25rem steps)
- Typography: `--font-family-base` = Montserrat; `--font-weight-hero-title` = 900
- All radii = 0 (sharp rectangular design system)
- Shadows = none (visual depth via clip-path + drop-shadow filters only)

## Section ID Map
| Anchor | Component | Section |
|--------|-----------|---------|
| `#top` | Hero | Главный экран |
| `#approach` | ProofStrip | Наш подход |
| `#deliverables` | AudienceSection | Кому помогаем |
| `#directions` | Scenarios | Основные сценарии |
| `#formats` | ProcessSection | Как работаем |
| `#pricing` | PricingSection | Стоимость |
| `#contact` | ContactForm | Контактная форма |
| `#faq` | FaqSection | Вопросы |

## Key Patterns & Conventions
- **No framework JS** — all interactivity is vanilla JS in `<script>` blocks within components
- **IntersectionObserver** for scroll-triggered animations and sticky states
- **Inline data arrays** in component frontmatter (`---`) — no CMS, no external data fetch
- **clip-path** for decorative beveled corners (`--editorial-frame-bevel: 2.25rem`)
- **`::before` / `::after`** pseudo-elements for magenta border frames on cards
- **`isolation: isolate`** on cards to scope z-index stacking
- **CSS custom properties** for animation state (`--mx`, `--my` for spotlight; `--rx`, `--ry` for ripple)
- **`@media (hover: hover)`** guards all hover effects; touch effects use `.card-touching` class added via `touchstart`
- **No rounding** — `--radius-*` tokens all = 0; brand uses sharp rectangles + clip-path geometry
- **Forbidden copy**: never use guarantee language (see `CLAUDE.md` Forbidden Claims section)
