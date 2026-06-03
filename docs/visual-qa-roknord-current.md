# Roknord Current Visual QA

## 1. Metadata

- Date: 2026-06-01
- URL: `http://127.0.0.1:4321/`
- Reference basis: `docs/ROKNORD-DESIGN-CANON.md`, `docs/ROKNORD-IMPLEMENTATION-BRIEF.md`, `docs/lrqa-homepage-design-extraction.md`, LRQA reference screenshots.
- Viewports checked: `1440x1200`, `768x1200`, `430x1200`, `390x1200`.
- Commands used:
  - `git status -sb`
  - `npm run build`
  - `node docs/screenshots/capture-roknord-current.mjs`
  - `git diff --check`
- Capture URL: `http://127.0.0.1:4321/`
- Capture report: `docs/screenshots/roknord-current/capture-report.json`

Screenshots updated:

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
- `docs/screenshots/roknord-current/roknord-current-footer-contact-1440.png`
- `docs/screenshots/roknord-current/roknord-current-footer-contact-390.png`
- `docs/screenshots/roknord-current/roknord-current-cookie-panel-1440.png`
- `docs/screenshots/roknord-current/roknord-current-cookie-panel-390.png`

Capture notes:

- Full-page and state screenshots were captured with the local cookie consent state accepted so the site UI is not blocked.
- Cookie panel was captured separately on desktop and mobile.
- A small bottom-center browser/capture artifact is visible in several viewport screenshots. It is treated as a capture limitation, not a site UI defect.

## 2. Executive Summary

The homepage now reads as a substantially more coherent LRQA-style corporate / assurance / certification system. The top mass, proof strip, content cards, evidence/risk block, process block, FAQ, final CTA, and footer share the same dark navy, mint action, white surface, hard-grid visual language.

Strong points:

- The post-hero request strip gives the first screen a clear follow-up action without becoming an aggressive sales banner.
- The lower page now has a proper FAQ, enterprise-style final CTA, and structured dark footer instead of a weak technical tail.
- Featured cards gained a sharper framed treatment with magenta editorial accent, improving brand distinctiveness without making all cards decorative.
- Cookie panel and mobile scroll-up control are present and visually consistent with the dark/mint system.
- Copy is safer and less internal: no forbidden outcome promises were found in `src`.

Remaining issues:

- `P2`: The mobile page is long and still card-heavy, especially between proof strip and process.
- `P2`: Desktop dropdown open states remain large and obscure much of the hero, though this is acceptable as an intentional enterprise overlay state.
- `P3`: Footer is structurally correct, but contact/legal density can still be polished after real contact details are available.
- `P3`: Capture artifact at the bottom center should be removed from the screenshot pipeline if it appears again in final acceptance captures.

Recommendation:

- Proceed to final acceptance QA / browser interaction testing. No structural redesign is needed before that.

## 3. Header QA

- Two-level header is present.
- Utility topbar contains the approved service links and `Разобрать задачу`.
- Main nav contains only `Услуги` and `Кому помогаем`.
- Desktop dropdowns remain enterprise-style panels, not small tooltips.
- Mobile drawer uses the current section anchors and includes `#faq` / `#contact`.
- Touch targets are readable on `390`.
- Remaining note: open desktop dropdowns are visually heavy and cover much of the first viewport. This is not blocking, but should remain a conscious product decision.

## 4. Hero + Request Strip QA

- Hero remains a dark masthead with a strong H1, short lead, primary CTA, secondary CTA, and evidence/risk dashboard.
- The previous excess desktop vertical looseness is reduced by fixing hero min-height to the canonical hero mass rather than forcing full viewport height.
- Request strip appears directly after hero and before proof strip.
- Request strip copy is clear: `Есть срок ПК, РОА или замечания?`
- Button `Отправить запрос` links to `#contact`, uses mint/action styling, and does not overlap proof strip on mobile.
- Hero still has dashboard-like content, but the panel is domain-specific and not a generic SaaS metric widget.

## 5. Proof Strip QA

- Proof strip remains directly after the request strip.
- It still reads as a system component, not random badges.
- Mobile horizontal scroll remains intact.
- It does not compete with the hero CTA or request strip because its role is evidence object navigation, not conversion.

## 6. Cards / Framing QA

- Scenario, audience, and service cards remain functionally differentiated.
- Featured scenario/service cards now use magenta framed treatment with an angular lower-left cut.
- Mint is still reserved for links/actions and does not compete with magenta in the same visual node.
- No local HEX values were found in `sections.css`, `global.css`, components, or pages after the polish pass.
- No obvious double-border issue is visible in the featured cards.
- Remaining note: the page still contains many cards; this is acceptable for the current information architecture but should not be expanded further without stronger image/editorial blocks.

## 7. Evidence / Risk + Process QA

- Evidence/risk section reads as an expert check matrix.
- Status markers use text labels and do not rely on color alone.
- Process block is now readable on dark background after the contrast fix.
- Process outputs remain visible and procedural.
- Mobile stack does not show horizontal overflow.
- Remaining note: the evidence dashboard and hero dashboard should not be expanded further, otherwise the site may drift toward a SaaS-dashboard feel.

## 8. FAQ QA

- `#faq` exists.
- FAQ uses native `details/summary`.
- Questions are readable and keyboard-accessible by browser default.
- Copy is short and legally safe.
- The outcome-promise question was rewritten to `Можно ли обещать исход процедуры?` to avoid repeating forbidden guarantee language.

## 9. Final CTA / Contact QA

- `#contact` exists.
- Final CTA reads as an enterprise contact panel.
- Primary CTA: `Разобрать задачу`.
- Secondary CTA: `Получить карту рисков`.
- Microcopy explicitly frames the work as independent preparation without promising procedure outcome.
- Prequalification cues are visible: type of accredited entity, procedure scenario, deadline, nonconformities, FGIS/anketa/case sample.
- No backend or fake form was added.

## 10. Footer QA

- Footer returns to dark foundation.
- Footer is a structured navigation zone with groups for services, audiences, company, documents, and contacts.
- Placeholder legal link to a non-existing user agreement was removed.
- Mobile footer stacks vertically and remains readable.
- Remaining note: footer can be improved later with real phone/email/legal entity details if those are approved.

## 11. Cookie Panel QA

- Cookie panel exists and stores accepted state in `localStorage`.
- Desktop panel is small and bottom-left.
- Mobile panel is compact and leaves space for the scroll-up control.
- It does not appear in normal full-page screenshots after acceptance.
- It has a keyboard-accessible `Принять` button and a `Подробнее` link to privacy policy.
- Remaining note: on first mobile visit, the panel can cover part of the hero dashboard. It does not cover the main hero CTA.

## 12. Mobile Scroll-Up QA

- Mobile-only scroll-up control exists.
- `aria-label="Подняться выше"` is present.
- It appears after scrolling and moves roughly two content sections upward.
- It is not the only navigation mechanism.
- In footer/contact mobile capture, the control is visible but does not block CTA controls.

## 13. Copy Safety QA

Source scan found no forbidden claims in `src`:

- No `гарантируем прохождение`.
- No `гарантия прохождения`.
- No `решим вопрос с Росаккредитацией`.
- No `договоримся с экспертами`.
- No `снимем замечания`.
- No `закроем несоответствия`.
- No `официальное сопровождение`.
- No `получите аккредитацию точно в срок`.

Copy remains aligned with approved language:

- independent preparation;
- risk map;
- evidence review;
- accreditation scope;
- QMS / СМК;
- FGIS / ФГИС;
- corrective actions;
- preparation before ПК / РОА / primary accreditation.

## 14. Issues List

| Priority | Area | Issue | Viewport | Recommendation |
| --- | --- | --- | --- | --- |
| P0 | None | No build, navigation, or page-breaking issue found. | All | No action. |
| P1 | None | No critical visual/UX blocker found after contrast fix. | All | No action. |
| P2 | Page rhythm | The mobile page remains long and card-heavy between proof strip and process. | `430`, `390` | Do not add more card sections; future additions should use larger editorial/media blocks. |
| P2 | Desktop dropdown | Open dropdown panels still obscure much of the hero. | `1440` | Keep if intentional; otherwise reduce height further in a focused navigation polish task. |
| P2 | Cookie panel | First-visit mobile cookie panel covers part of the hero dashboard. | `390`, `430` | Acceptable for now; if stricter UX is required, shrink copy or move to a bottom sheet with tighter height. |
| P3 | Footer | Footer lacks real contact/legal entity details. | All | Add only when approved content exists. |
| P3 | Capture | Bottom-center browser/capture artifact appears in some screenshots. | All | Clean screenshot environment before final external presentation. |

## 15. Fixes Made In This Pass

- Added post-hero request strip with `Отправить запрос`.
- Added localStorage-based cookie panel.
- Added mobile scroll-up control.
- Moved local gradient HEX usage out of `sections.css` into tokenized color mixes.
- Added stronger light-section readability overrides.
- Added magenta angular framing to featured cards.
- Improved process-block contrast on dark background.
- Rewrote section copy away from internal brief language.
- Removed footer placeholder link to a non-existing user agreement.
- Added footer contact group.
- Updated screenshot utility to capture footer/contact and cookie states.

## 16. Acceptance Checklist

- Desktop `1440`: pass with P2 notes.
- Tablet `768`: pass with no blocking issue.
- Mobile `430`: pass with card-length note.
- Mobile `390`: pass with card-length and cookie-panel notes.
- Header: pass.
- Dropdowns: pass with P2 visual-weight note.
- Mobile drawer: pass.
- Hero: pass.
- Request strip: pass.
- Proof strip: pass.
- Cards: pass.
- Evidence/risk dashboard: pass.
- Process: pass after contrast fix.
- FAQ: pass.
- Final CTA: pass.
- Footer: pass.
- Cookie panel: pass with first-visit mobile note.
- Scroll-up control: pass.
- Forbidden copy: pass.
- Local HEX outside tokens in touched source/CSS: pass.

## 17. Recommendation For Next Task

Proceed to final acceptance QA. Recommended next task:

1. Run interaction QA in browser for dropdowns, drawer, FAQ, cookie accept, and scroll-up.
2. Remove or isolate the screenshot capture artifact.
3. Capture final clean presentation screenshots.
4. Prepare a short final visual acceptance report.
