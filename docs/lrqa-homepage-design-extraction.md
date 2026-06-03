# LRQA Homepage Design Extraction

## 1. Capture Metadata

- Date: 2026-05-31
- Final URL: `https://www.lrqa.com/de-de/`
- Initial URL: `https://www.lrqa.com/`
- Redirects observed: yes, root redirected to `/de-de/`
- Locale accepted: `de-de`
- Document title: `LRQA – Assurance, Zertifizierung, Inspektion, Training`
- Visible H1: `Willkommen bei LRQA – Ihr Risk Management Advantage`
- Viewports captured: `1440x1200`, `1024x1200`, `768x1200`, `430x1200`, `390x1200`
- User agent: `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/148.0.0.0 Safari/537.36`
- Language: `en-US`
- Cookies / overlay: cookie banner was visible on the first load; an obvious accept control existed, the OneTrust flow was applied, and the final captures are clean
- Homepage verification: final URL was non-cookie, non-privacy, non-policy, non-consent; H1 was homepage copy; body text and section structure matched the LRQA marketing homepage

## 2. Homepage Structure

| # | Section Type | Dark / Light | Composition | Columns | CTA | Visual Element | Funnel Role |
|---|---|---|---|---|---|---|---|
| 1 | Utility + main header | Dark header row, light utility strip | Two-level IA with locale, utility links, brand row and main nav | 2 rows | `Kontaktieren Sie uns` | Logo, nav labels, search, menu, utility actions | Entry + routing |
| 2 | Hero / feature masthead | Dark | Large left-aligned statement over full-width image/video hero | 2 main zones | `Erfahren Sie mehr`, `Kontaktieren Sie uns` | Full-bleed environmental imagery, dark overlay, big H1, brief lead | Positioning |
| 3 | Promo / editorial block | Dark | Framed editorial card with strong accent and image wedge | 2 | Primary CTA inside card | Mint/magenta framed promo, angled geometry | Conversion / highlight |
| 4 | Quick links strip | Light | Horizontal pill strip of topical links | 1 | Pills act as lightweight actions | Chips / link pills | Fast routing |
| 5 | Insight / featured content card | Dark + accent | Large promo panel with strong visual wedge | 2 | Card CTA | Mint polygon, image tile, magenta label | Mid-funnel highlight |
| 6 | News / updates cards | Light or dark mixed cards | 3-card editorial row/grid | 3 | Small per-card links | Image cards with labels and overlays | Engagement |
| 7 | Solutions cluster | Dark | Grid of service / solution blocks with search field | 2-3 grid zones | `Suchen` | Large dark block, internal cards, search bar | Consideration |
| 8 | Industry selector / why LRQA | Light | White section with chips and explanatory text | 2 | Small links inside text block | Chip row, explanatory column | Education |
| 9 | News / events carousel | Dark | Carousel-like card row with arrows/dots | 3 visible cards | Card links + arrow controls | Three editorial cards, pagination dots | Retention / content |
| 10 | Newsletter CTA strip | Dark | Centered compact strip | 1 | `Jetzt registrieren` | Envelope icon, compact CTA band | Lead capture |
| 11 | Footer | Dark | Multi-column legal / interest / social footer | 3+ | Footer links | Dark canvas, social icons, legal links | Closure / utility |

## 3. Header System

- Utility row sits above the main nav and uses a light neutral background.
- Main nav row uses a very dark navy mass and the logo is pinned left.
- Main nav items on desktop: `Solutions`, `Branchen`, `Dienstleistungen`, `Trainingskurse & Fortbildungen`, `Neuigkeiten, Insights & Events`, `Karriere`, `Suchen`.
- Primary CTA is placed in the top utility row at the far right as a mint block: `Kontaktieren Sie uns`.
- Search is present as a separate main-nav action on desktop and becomes a full-screen overlay on interaction.
- Desktop header height from capture: 134px total for the top header area.
- Mobile header collapses to logo + menu button while keeping the utility row action visible above.
- Hover/open state: `Solutions` opens a large dark megamenu panel; `Suchen` opens a full-screen search overlay; mobile menu opens a full-screen drawer with search and stacked links.
- Header colors from capture:
  - main nav background: `rgb(15, 18, 50)` / `#0F1232`
  - nav text: `#ffffff`
  - CTA background: `#0FF2B2`
  - highlight accent: `#BF1F99`

## 4. Hero System

- Above-the-fold hero is a dark, full-width masthead with large environmental photography and a dark overlay.
- H1 size on desktop: `32px`, `font-weight: 900`, `line-height: 35.84px`.
- H1 font family: `Lato, sans-serif`.
- Lead size on desktop: `16px`, `line-height: 24px`, `font-weight: 400`.
- Lead font family: `Source Sans 3, sans-serif`.
- Hero copy is left-aligned with a large right-hand visual field and a compact CTA cluster.
- Primary CTAs in hero: `Erfahren Sie mehr`, `Kontaktieren Sie uns`.
- Proof / metadata elements: case studies, phone number, secondary links appear immediately under the hero copy.
- Mobile hero keeps the same dark mass, but compresses the copy and pushes the CTA / cookie space closer to the fold.
- Hero headline text color: `rgb(255, 255, 255)`.

## 5. Color Extraction

| Назначение | HEX/RGB | Где используется | Как адаптировать для Рокнорда |
|---|---|---|---|
| Header / dark foundation | `#0F1232` / `rgb(15, 18, 50)` | Main nav, large dark hero mass, dark content blocks | Use for header, hero, risk blocks, footer foundation |
| Main text | `#0F1232` / `rgb(15, 18, 50)` | Headings, nav in dark contexts, body UI text on light backgrounds | Use as dark text foundation and for strong headlines |
| Body text | `#000000` | Long-form content, table text, legal/footer copy | Use for body / legal text on white surfaces |
| White | `#FFFFFF` | Hero headlines, nav text, light surfaces | Use for high-contrast text and surfaces |
| Mint action | `#0FF2B2` | CTA background, search submit, header CTA, accent blocks | Use as the primary action color for Roknord CTAs and links |
| Magenta highlight | `#BF1F99` / `rgb(191, 31, 153)` | Accordion open accent, editorial labels, highlight details | Use only for editorial/report accents and tab labels |
| Surface white | `#FFFFFF` | Content sections and cards | Use for content surfaces and framed blocks |
| Light divider | `#F1F4F7` | Accordion keys / separators | Use for soft dividers and table borders |
| Inactive pagination | `#cfd0d6` | Carousel dots | Use for inactive state tokens only |
| Button secondary text/bg | `#0F1232` and `#ffffff` | Secondary buttons and hover states | Keep for contrast logic in Roknord CTA families |

Observed CSS variables on `:root` included:

- `--cta-colour-bg: #0FF2B2`
- `--theme-colour-bg: #0FF2B2`
- `--theme-colour-text: #0F1232`
- `--text-colour-highlight: #BF1F99`
- `--font-family-header: "Lato", sans-serif`
- `--font-family-body: "Source Sans 3", sans-serif`
- `--gutter-left/right: 2.5rem`
- `--spacing-default: 3.75rem`
- `--spacing-large: 5rem`
- `--footer-padding-block: 2.5rem`
- `--cta-padding-top: 0.875rem`
- `--cta-padding-sides: 1.875rem`

## 6. Typography Extraction

| Элемент | Desktop | Tablet | Mobile | Notes |
|---|---|---|---|---|
| H1 | `32px / 35.84px`, `Lato`, `900` | Same family, slightly tighter viewport fit | Same family, reduced line breaks and narrower column | Strong editorial headline, not a generic SaaS title |
| Section title | `22px / 23.98px`, `Lato`, `900` | Same family | Slightly tighter wrapping | Used for quick links and content sections |
| Lead | `16px / 24px`, `Source Sans 3`, `400` | Same family | Same family, narrower measure | Clear readable body lead |
| Body | `16px / 24px`, `Source Sans 3`, `400` | Same family | Same family | Good long-form density |
| Nav | `approx. 16px`, `Lato` / UI sans | Similar, often condensed | Mobile replaces nav with drawer | Compact enterprise nav, not a marketing nav |
| Button label | `approx. 14-16px`, bold/semibold feel | Similar | Larger tap targets, same tone | Weight and padding carry the hierarchy more than size |

## 7. Spacing / Grid Extraction

- Inferred max container width on 1440 viewport: about `1360px` from the 40px left/right gutters and text alignment.
- Desktop container gutter: `40px` (`2.5rem`) from root vars.
- Section rhythm tokens visible in CSS:
  - `--spacing-small: 2.5rem`
  - `--spacing-default: 3.75rem`
  - `--spacing-large: 5rem`
- Header height: `134px` for the full top header zone.
- Hero content block height: `586px` from the captured top section.
- Footer block height: `506px` in the captured homepage.
- Desktop spacing is built on clear vertical jumps rather than tight modular cards.
- Suggested pending tokens:
  - `container-max`
  - `container-x-desktop`
  - `container-x-mobile`
  - `section-y-xl`
  - `section-y-lg`
  - `card-padding-lg`
  - `card-gap`
  - `nav-height`
  - `utility-height`
  - `hero-min-height`

## 8. Card / Framed Block Extraction

- Promo / feature cards use dark backgrounds, thin frames, strong image wedges and mint/magenta accents.
- Editorial cards often have a small label tag in magenta and a dark image overlay.
- Service cards are dark, compact, and feel like structured panels rather than decorative tiles.
- CTA cards are compact dark strips with a mint button and a single clear action.
- Footer link groups are dense but minimal, with small text, grouped links, and social icons on a dark canvas.
- Framed text blocks on light sections use white surfaces with crisp but restrained borders.
- Mobile behavior: cards collapse to vertical stacking; image-heavy cards keep the label + title hierarchy intact; equal-card grids are replaced by long vertical stacks.

Observed card cues:

- `Quick Links` pills on white background
- dark promo blocks with mint wedge and magenta label
- three-up news / article cards with image backgrounds
- service / solution cards in dark panels
- newsletter CTA strip as a compact CTA card

## 9. CTA Extraction

| CTA Type | Color | Size / Shape | Hover | Text Logic | Placement |
|---|---|---|---|---|---|
| Primary CTA | `#0FF2B2` | Medium pill / angled block, generous padding | Dark text on bright mint, strong contrast | Direct action verbs | Hero, header, newsletter, search submit |
| Secondary CTA | White / dark outline | Rounded pill | Inverted or dark hover states | Lower-commitment action | Hero / card sub-actions |
| Header CTA | `#0FF2B2` | Top-right utility block | Stays visually dominant | Contact / request contact | Utility row |
| Section CTA | Mint | Small-to-medium pill | Same accent family | Contextual action | Promo / solution blocks |
| Final CTA | Mint on dark | Compact strip button | Slightly stronger emphasis | Newsletter / sign-up | Footer-adjacent strip |
| Mobile CTA | Mint | Larger tap target, same family | Maintains contrast | Same as desktop, but touch-first | Hero, drawer, footer strip |

Observed CTA padding from vars:

- vertical: `0.875rem`
- horizontal: `1.875rem`

## 10. Footer Extraction

- Footer is dark and functions as a real structural region, not a tiny legal strip.
- Structure includes:
  - `Also of Interest`
  - social icons
  - quick link groups
  - legal / policy links
  - brand/legal copy
- Footer color family is the same dark navy family used in the header.
- On mobile the footer collapses to vertical stacks and dense legal rows.
- Footer spacing is controlled and uses the same spacing system as the page above.

## 11. Mobile Extraction

### 430

- Header reduces to compact logo + menu.
- Hero keeps the dark mass and large headline, but the text becomes denser and the overlay cookie widget competes with the hero.
- Quick links become a horizontal chip strip.
- Cards become long vertical stacks.
- Footer remains dark and compact, with dense but legible small text.

### 390

- Menu opens as a full-screen dark drawer.
- Search opens as a full-screen dark overlay with an input and popular links.
- Hero still reads as homepage, not as a miniaturized desktop.
- Card stacks remain vertical.
- Footer and newsletter CTA remain present below the fold.

Desktop vs mobile:

- Desktop feels like a broad enterprise homepage with wide sectional rhythm.
- Mobile is a compressed but still structured version; it is not just a shrink-to-fit layout.
- Mobile drawer and search overlay are explicit system states, not hidden afterthoughts.

## 12. Transfer Map LRQA → Roknord

| LRQA pattern | Что берём | Как адаптируем под Рокнорд | Где применить |
|---|---|---|---|
| Two-level header | Utility row + main nav separation | Keep service row above the brand row | Header |
| Dark hero mass | Large dark editorial first screen | Use navy foundation with strong H1 and proof strip | Hero |
| Mint action accent | Primary action color | Use for CTA and active link accents only | CTA system |
| Section rhythm | Dark / light alternation | Alternate dark editorial blocks and white evidence blocks | Homepage sections |
| Card discipline | Repeatable framed patterns | Standardize service, audience, risk and editorial cards | Cards |
| Footer structure | Real multi-column footer | Build a structured legal / interest footer | Footer |
| Mobile menu | Full-screen drawer | Keep big-thumb navigation and clear search | Mobile nav |
| CTA logic | Simple, direct actions | Use audit / readiness / risk language, no outcome claims | CTA blocks |
| Container / spacing discipline | 40px gutters and stable section spacing | Tokenize gutters and section gaps | Global tokens |

## 13. What to Implement in Roknord

- `tokens.css`
- `global.css`
- `sections.css`
- `header`
- `hero`
- `proof strip`
- `evidence/risk dashboard`
- `service/audience cards`
- `CTA system`
- `footer`
- `mobile drawer`

## 14. Risks / Limitations

- The overlay was visible on first load, then cleared through consent handling; it did not materially block extraction.
- The final homepage reference used here is the `/de-de/` locale, which is accepted as valid because the visual system is the target.
- Footer background and some section backgrounds are partly inferred from rendered screenshots because top-level computed background values can be transparent while nested wrappers paint the visual mass.
- Some nav/menu states were captured successfully, and a floating chat widget remains visible in the captured frames.
- The page is localized to `/de-de/`; this is the actual homepage in the captured browser state.
- No manual CSS mutation was used.
- Most style values were taken from computed styles where available; remaining values are inference from rendered screenshots and layout geometry.
