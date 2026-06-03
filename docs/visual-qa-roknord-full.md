# Roknord Homepage Full Visual QA

## 1. Metadata

- Date: 2026-06-01
- Site URL used in captures: `http://127.0.0.1:4321/`
- Viewports reviewed: `1440x1200`, `768x1200`, `430x1200`, `390x1200`
- Roknord screenshots reviewed:
  - `docs/screenshots/roknord-current/roknord-current-1440.png`
  - `docs/screenshots/roknord-current/roknord-current-768.png`
  - `docs/screenshots/roknord-current/roknord-current-430.png`
  - `docs/screenshots/roknord-current/roknord-current-390.png`
  - `docs/screenshots/roknord-current/roknord-current-hero-1440.png`
  - `docs/screenshots/roknord-current/roknord-current-hero-768.png`
  - `docs/screenshots/roknord-current/roknord-current-hero-430.png`
  - `docs/screenshots/roknord-current/roknord-current-hero-390.png`
  - `docs/screenshots/roknord-current/roknord-current-services-dropdown-1440.png`
  - `docs/screenshots/roknord-current/roknord-current-audiences-dropdown-1440.png`
  - `docs/screenshots/roknord-current/roknord-current-mobile-drawer-390.png`
- Reference screenshots reviewed:
  - `docs/screenshots/reference/lrqa-1440.png`
  - `docs/screenshots/reference/lrqa-768.png`
  - `docs/screenshots/reference/lrqa-430.png`
  - `docs/screenshots/reference/lrqa-390.png`
  - `docs/screenshots/reference/lrqa-nav-open-1440.png`
  - `docs/screenshots/reference/lrqa-mobile-menu-390.png`
- Source documents reviewed:
  - `docs/ROKNORD-DESIGN-CANON.md`
  - `docs/ROKNORD-IMPLEMENTATION-BRIEF.md`
  - `docs/lrqa-homepage-design-extraction.md`
  - `docs/visual-gap-report-lrqa-roknord.md`

Capture status:

- The current capture report lists no capture problems.
- The current full-page frames show the live homepage, not browser error states.
- A small bottom-center floating browser/control artifact is visible in some hero captures. It should be treated as a capture limitation unless confirmed in live browser as site UI.

## 2. Executive Summary

The homepage now reads as a coherent corporate assurance / accreditation preparation site. It is no longer a generic landing page. The dark header / hero / proof / evidence / process / final CTA / footer system is directionally aligned with the Roknord canon and the LRQA reference logic.

Strongest areas:

- Header IA is correct: utility row plus main row, with only `Услуги` and `Кому помогаем` in primary desktop nav.
- Hero has the right dark mass, strong H1, controlled CTA set and evidence-led visual logic.
- Proof strip, evidence dashboard and process section give the page a procedural B2B backbone.
- FAQ and final CTA are now legally safer and more enterprise-like than the earlier placeholder state.
- Footer is a real dark structured navigation zone rather than a weak technical tail.

Main problems:

- The desktop hero has too much empty dark vertical mass above the headline; the first viewport feels underfilled compared with LRQA's denser editorial masthead.
- The page has a long run of light card sections on mobile, so the middle can still feel like a repetitive stack.
- The hero is evidence-dashboard-led; this is on-brief for Roknord, but it risks looking more internal-dashboard than image-led enterprise homepage.
- Some local hex gradients remain in `src/styles/sections.css`, which conflicts with the canon rule that colors should live in tokens.
- The footer includes `Пользовательское соглашение` as a `#contact` placeholder; it is not broken, but the label implies a document that does not exist yet.

Recommendation:

- No P0 blockers.
- No P1 blockers that should stop the next iteration.
- Proceed to a focused polish pass before final acceptance: hero vertical density, mid-page rhythm, token cleanup for local hex gradients, and footer document-link accuracy.

## 3. LRQA Reference Alignment

Aligned:

- Two-level header and dark main navigation mass are in place.
- Mint is used as action / link accent, not as a generic decoration color.
- The page uses dark and light bands with a structured footer, close to LRQA's corporate assurance logic.
- Dropdowns and mobile drawer are explicit navigation states, not hidden afterthoughts.
- Footer has multi-column grouped links and legal/document routing.

Not fully aligned:

- LRQA's homepage relies on stronger image/media-led editorial blocks. Roknord currently uses abstract geometry and dashboard panels more than image-led sections.
- LRQA has stronger variation between content patterns; Roknord still repeats white card grids for scenarios, audiences and services in sequence.
- LRQA footer feels denser and more mature as an information zone; Roknord footer is structurally correct but still sparse.

Interpretation:

- The Roknord result should not copy LRQA imagery, so the missing media is not automatically a defect.
- The remaining gap is composition maturity: fewer equal-feeling cards, more deliberate media/editorial blocks, and tighter first-screen density.

## 4. Viewport QA

### 1440

- Header is clear and has appropriate enterprise weight.
- Hero is visually strong, but the H1 begins low in the first screen, leaving a large empty dark field.
- Right-side evidence dashboard reads clearly.
- Proof strip and promo block are well aligned with the canonical dark / magenta / mint system.
- Card sections are orderly but visually quiet.
- FAQ, final CTA and footer close the page properly.

### 768

- The page preserves hierarchy and spacing discipline.
- Hero remains readable and the dashboard fits.
- Evidence/process sections survive well.
- Card sections become longer and more repetitive, but not broken.

### 430

- Mobile reads as an intentional mobile composition, not only a shrunken desktop.
- CTA remains visible near the first screen.
- Dashboard, proof strip and cards stack without obvious overflow.
- The long white card run becomes visually tiring.
- Footer remains readable.

### 390

- Main mobile structure is usable.
- Drawer labels now match the current page structure.
- Hero is strong but tall; the dashboard pushes the first section stack down.
- FAQ and footer stay readable.
- No horizontal overflow was visible in the reviewed capture.

## 5. Component QA

### Header

Pass:

- Utility row contains the approved links and CTA.
- Main nav contains only `Услуги` and `Кому помогаем`.
- Dropdowns are large enterprise panels.
- Mobile drawer is a real UX state and labels are current.

Issues:

- Desktop dropdowns still cover a large part of the first screen, though this is now controlled by containment.
- On mobile, the utility row shows only the first items plus CTA in the visible strip; remaining utility links rely on horizontal access or the drawer.

### Hero

Pass:

- Dark masthead is present.
- H1, lead and CTA copy match the canon.
- Primary and secondary CTAs are controlled.
- Evidence/risk dashboard is meaningful and avoids pseudo-official styling.

Issues:

- Desktop hero has too much empty vertical space before content begins.
- The main visual language is dashboard-heavy. This supports evidence logic, but it reduces the image-led editorial feel called out in the LRQA extraction and UI style skill.

### Proof Strip

Pass:

- Sits immediately under hero.
- Reads as a system component.
- Mobile horizontal behavior is acceptable.

Issues:

- It is visually competent but could be stronger as a transition between hero and the rest of the page.

### Scenario / Audience / Service Cards

Pass:

- Card families are standardized and functionally distinct.
- No obvious double-border problem.
- Mint is used for action links.
- Mobile readability is good.

Issues:

- Three light card sections in a row create a long white middle run.
- Some cards are still text-heavy relative to their small footprint.

### Evidence / Risk Dashboard

Pass:

- It reads as an expert check map.
- Status markers include text, so meaning is not color-only.
- No pseudo-official seal or agency UI imitation.

Issues:

- There are two dashboard-like areas on the page: hero dashboard and evidence section. This is coherent for the domain, but it should not expand further or the site will drift toward SaaS dashboard language.

### Process Block

Pass:

- Procedural, not promotional.
- Output labels make each step tangible.
- Mobile stack is readable.

Issues:

- Dense on mobile; acceptable now, but not much headroom for more copy.

### FAQ

Pass:

- Native disclosure pattern.
- Legal-safe answers.
- No outcome promises.
- Good information scent for skeptical B2B users.

Issues:

- All items are collapsed in screenshots, so the visual density is low. That is acceptable for disclosure UX.

### Final CTA

Pass:

- Enterprise panel, not aggressive sales block.
- Primary/secondary CTA system is consistent.
- Microcopy is legally safe.

Issues:

- CTA links stay within the page. This is acceptable for current launch state, but final production needs a real contact destination or clarified flow.

### Footer

Pass:

- Dark foundation returns.
- Multi-column grouped navigation is present.
- Mobile stacks cleanly.

Issues:

- `Пользовательское соглашение` points to `#contact`, not to a real document page.
- Footer is structurally correct but still feels sparser than LRQA's footer.

## 6. Copy Safety QA

Live source scan result:

- No forbidden promise was found in `src`.
- Forbidden phrases appear only inside the canon / brief as forbidden examples.

Reviewed forbidden phrases:

- `гарантируем прохождение`
- `гарантия прохождения`
- `гарантия аккредитации`
- `решим вопрос с Росаккредитацией`
- `договоримся с экспертами`
- `снимем замечания`
- `закроем несоответствия`
- `официальное сопровождение`
- `обеспечим положительное решение`
- `аккредитация под ключ`
- `получите аккредитацию точно`

Result:

- Copy is acceptable for the reviewed homepage state.

## 7. Engineering / Token QA

Pass:

- The rendered palette mostly follows the approved dark navy / mint / white / magenta system.
- Main accent usage is disciplined.

Issue:

- Local hex values remain in `src/styles/sections.css` inside image/media gradient placeholder rules. They are visually close to the navy canon, but they violate the design canon rule that local colors should not live outside tokens.

This is not a visual blocker, but it is a system-quality issue.

## 8. Issues List

| Priority | Area | Issue | Viewport | Recommendation |
| --- | --- | --- | --- | --- |
| P0 | None | No build-breaking, page-breaking, or capture-blocking issue found. | All | No P0 action required. |
| P1 | None | No critical visual or UX blocker found that should stop the next pass. | All | No P1 action required. |
| P2 | Hero | Too much empty dark vertical mass before the desktop headline; first screen feels underfilled. | 1440, 768 | Pull hero content upward or reduce hero top spacing while preserving dark masthead weight. |
| P2 | Section rhythm | Long run of light card sections creates a repetitive middle, especially on mobile. | 1440, 768, 430, 390 | Convert one mid-page light section into a stronger mixed/media block or add a darker transition earlier. |
| P2 | Visual language | Hero plus evidence section creates two dashboard-like moments. | 1440, 768, 430, 390 | Keep evidence dashboard, but avoid adding any more dashboard panels; use more editorial/media blocks in future sections. |
| P2 | Token discipline | Local hex gradients remain in `sections.css`. | Code / visual system | Move remaining local colors to tokens or replace with existing canonical tokens. |
| P2 | Footer documents | `Пользовательское соглашение` routes to `#contact` despite implying a real legal page. | All | Either create the page later or remove/rename the link until it exists. |
| P3 | Header dropdown | Desktop dropdowns remain visually heavy even after containment. | 1440 | Keep as enterprise panel, but consider slightly tighter panel padding / title scale. |
| P3 | Footer density | Footer is structurally right but still lighter than LRQA's mature footer. | 1440, 768 | Add only real links or verified business details when available; do not invent content. |
| P3 | Capture artifact | Small bottom-center floating control appears in some screenshots. | Hero captures | Confirm whether this is browser/capture artifact or site UI before acting. |
| P3 | Mobile utility row | Mobile top utility strip exposes only part of the utility nav at first glance. | 430, 390 | Acceptable because drawer contains links; optional polish is to simplify topbar on mobile. |

## 9. Acceptance Checklist

| Criterion | Status | Notes |
| --- | --- | --- |
| Desktop 1440 cohesive LRQA-style editorial system | Pass with P2 | Strong direction; hero spacing and mid-page repetition need polish. |
| Tablet 768 preserves hierarchy | Pass | Structure holds. |
| Mobile 390 deliberate composition | Pass with P2 | No overflow; long card stack remains heavy. |
| Two-level header | Pass | IA matches canon. |
| Main nav approved only | Pass | `Услуги`, `Кому помогаем`. |
| Utility topbar approved links + CTA | Pass | Present. |
| One dropdown open at a time | Pass from implementation and state captures | No conflicting open states seen. |
| Dark hero mass | Pass | Strong but vertically loose. |
| Strong H1 | Pass | Clear and canonical. |
| Evidence / risk dashboard | Pass | Present and meaningful. |
| Proof strip | Pass | Present and readable. |
| Standardized cards | Pass with P2 | Standardized, but many light cards in sequence. |
| Mint used as action accent | Pass | Good discipline. |
| Magenta only editorial/report accent | Pass | Promo block follows pattern. |
| Footer structured information zone | Pass with P3 | Correct structure, sparse maturity. |
| No local colors outside tokens | Fail / P2 | Local hex gradients remain in `sections.css`. |
| No random cards | Pass | Card families are now recognizable. |
| No SaaS/Tilda generic look | Pass with P2 | Not Tilda; dashboard density should be capped. |
| No forbidden promises | Pass | Source scan clean outside docs. |
| Screenshots without error state | Pass | Current reviewed captures are valid. |

## 10. Next Recommendation

Proceed with a final polish pass, not another structural rebuild.

Recommended order:

1. Tighten desktop hero vertical spacing.
2. Reduce mid-page repetition by strengthening one light card section or inserting a more editorial transition.
3. Move remaining local hex gradients into tokens.
4. Resolve the `Пользовательское соглашение` footer link.
5. Recapture 1440 / 768 / 430 / 390 and produce a final acceptance report.

Do not start by rebuilding header, hero, cards, evidence dashboard or footer from scratch. The system is already coherent; the remaining work is focused polish and token discipline.
