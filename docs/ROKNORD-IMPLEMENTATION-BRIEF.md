# ROKNORD IMPLEMENTATION BRIEF

## 1. Purpose

This document translates the approved design canon into a concrete implementation plan.

It exists to define what will change before any CSS or component work starts.

The next task after this brief should be code implementation, not more analysis.

## 2. Sources of truth

- [docs/ROKNORD-DESIGN-CANON.md](/opt/roknord-site/docs/ROKNORD-DESIGN-CANON.md)
- [docs/lrqa-homepage-design-extraction.md](/opt/roknord-site/docs/lrqa-homepage-design-extraction.md)
- [docs/visual-gap-report-lrqa-roknord.md](/opt/roknord-site/docs/visual-gap-report-lrqa-roknord.md)
- screenshots in `docs/screenshots/reference/` and `docs/screenshots/roknord/`

## 3. Implementation goal

Rebuild the Roknord homepage as a strict LRQA-style corporate / assurance / certification system:

- two-level header;
- dark hero mass;
- strong proof strip;
- evidence / risk dashboard;
- standardized cards;
- strict CTA system;
- dark structured footer;
- independent mobile composition;
- all colors and spacing driven by tokens.

## 4. Files likely to change on implementation stage

Actual paths found in the repo:

- `src/pages/index.astro`
- `src/layouts/BaseLayout.astro`
- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/styles/sections.css`
- `src/components/PlaceholderPage.astro`

Current state note:

- there is no dedicated `Header.astro`, `Hero.astro`, or `Footer.astro` yet;
- the homepage is currently assembled in `src/pages/index.astro`;
- the next coding task will likely either refactor `index.astro` heavily or extract new components into `src/components/`.

Expected implementation targets on the next coding step:

- header component(s);
- hero component(s);
- proof strip component;
- evidence / risk dashboard component;
- card family components or shared card primitives;
- footer component.

## 5. Tokens implementation plan

### Colors

Introduce or normalize these tokens:

- `--color-dark-foundation: #0F1232`
- `--color-mint-action: #0FF2B2`
- `--color-magenta-editorial: #BF1F99`
- `--color-divider-light: #F1F4F7`
- `--color-white: #FFFFFF`
- `--color-black: #000000`
- `--color-text-primary`
- `--color-text-muted`
- `--color-text-inverse`
- `--color-surface-page`
- `--color-surface-light`
- `--color-surface-card`
- `--color-surface-card-dark`
- `--color-border-subtle`
- `--color-border-strong`
- `--color-status-risk-low`
- `--color-status-risk-medium`
- `--color-status-risk-high`

### Typography

Introduce or normalize:

- `--font-heading: Lato, sans-serif` or the approved local equivalent;
- `--font-body: Source Sans 3, sans-serif` or the approved local equivalent;
- `--font-size-hero-title`
- `--line-height-hero-title`
- `--font-weight-hero-title`
- `--font-size-section-title`
- `--line-height-section-title`
- `--font-size-body`
- `--line-height-body`

### Spacing

Introduce or normalize:

- `--container-max` around `1360px`
- `--container-x-desktop: 40px / 2.5rem`
- `--container-x-mobile`
- `--section-y-xl: 5rem`
- `--section-y-lg: 3.75rem`
- `--section-y-md: 2.5rem`
- `--card-padding-xl`
- `--card-padding-lg`
- `--card-gap-lg`
- `--proof-strip-x`
- `--nav-height`
- `--utility-height`
- `--hero-min-height`
- `--footer-padding-block`

### CTA

- `--cta-padding-y: 0.875rem`
- `--cta-padding-x: 1.875rem`

Implementation rule:

- tokens must be the only place where these values live;
- do not introduce local hex values or ad hoc spacing in components.

## 6. Header implementation plan

Future header structure:

- utility topbar on top;
- main nav row below;
- main nav contains only `Услуги` and `Кому помогаем`;
- utility links are `О компании`, `Личный кабинет`, `Карьера`, `Сотрудничество`, `Контакты`;
- CTA is `Разобрать задачу`;
- CTA must read as part of the header system;
- dropdowns must feel like enterprise panels;
- only one dropdown open at a time;
- mobile drawer is a separate UX state, not just hidden desktop links;
- search overlay can be added later as an optional future component.

Header acceptance:

- desktop 1440 reads as a real corporate nav system;
- mobile 390 is thumb-friendly and readable;
- no random colors;
- no local spacing;
- no thin landing-page header.

## 7. Hero implementation plan

Future hero structure:

- dark full-width hero mass;
- strong H1;
- short lead;
- primary CTA: `Разобрать задачу`;
- at most one secondary CTA;
- minimize secondary noise above the fold;
- right side must be an evidence / risk dashboard;
- proof strip sits directly below hero;
- hero must not read as a generic consulting banner.

Hero content logic:

- H1: `Комплексная подготовка к аккредитации и подтверждению компетентности`
- Lead: `Документы, процессы, доказательства и риски — в логике проверки Росаккредитации.`
- Proof strip: `Область аккредитации · СМК · Анкета самообследования · Выборка дел · ФГИС · Корректирующие действия`

## 8. Evidence / risk dashboard implementation plan

This is not a SaaS widget and not decorative geometry.

It must behave as an expert map of the checking process.

Allowed content:

- area of accreditation;
- QMS / СМК;
- self-assessment questionnaire;
- case selection;
- FGIS / ФГИС;
- corrective actions;
- evidence status;
- risk level;
- procedure timing;
- documents and records;
- personnel competence.

Forbidden:

- pseudo-official seals;
- imitation of the Rosakkreditatsiya UI;
- decorative charts without meaning;
- outcome promises.

## 9. Proof strip implementation plan

The proof strip is a standalone system component.

It must:

- sit immediately under the hero;
- connect hero to the sections below;
- support horizontal scroll on mobile if needed;
- avoid looking like random badges;
- read as a stronger, more deliberate system element than the current solution.

Possible strip items:

- Область аккредитации
- СМК
- Анкета самообследования
- Выборка дел
- ФГИС
- Корректирующие действия
- Карта рисков
- Доказательства компетентности

## 10. Card system implementation plan

Cards must be standardized, not improvised.

Card families:

- service card;
- audience card;
- risk card;
- process card;
- expert material card;
- compact link card;
- CTA card;
- article / material card;
- framed editorial block.

Each family must define:

- surface;
- border;
- accent;
- title style;
- body style;
- padding;
- hover / focus;
- mobile behavior.

Rules:

- no random cards;
- no double borders on framed cards;
- service and audience cards must be strict;
- expert material cards use magenta editorial accent;
- CTA cards use mint action accent;
- risk cards use status markers without visual noise;
- materials cards must be visually distinguishable.

## 11. Section rhythm implementation plan

Target homepage order:

1. Header
2. Hero
3. Proof strip
4. Main help scenarios
5. Who we help
6. Key services
7. Evidence / risk dashboard
8. How we work
9. Expert materials / directions
10. CTA block
11. FAQ
12. Footer

For each section, implementation must define:

- purpose;
- visual type;
- dark / light;
- which components it uses;
- what must improve relative to the current build.

Rhythm rules:

- do not repeat the same section rhythm everywhere;
- alternate dark mass / white analytical mass / dark mass;
- white sections must not feel flat;
- footer must not be weaker than the hero in compositional closure.

## 12. CTA implementation plan

One CTA system across hero, sections, and footer.

Allowed CTA copy:

- Разобрать задачу
- Запросить первичный разбор
- Проверить готовность
- Обсудить ситуацию
- Получить карту рисков
- Проверить область аккредитации
- Подготовить план действий

Forbidden CTA copy:

- Гарантируем прохождение
- Пройдёте без замечаний
- Решим вопрос с Росаккредитацией
- Получите аккредитацию точно в срок
- Официальное сопровождение

Rules:

- mint is reserved for action;
- CTA must not feel aggressive or salesy;
- final contact block should read as an enterprise panel;
- sticky is allowed only as a post-hero CTA strip;
- CTA must not cover forms on mobile.

## 13. Footer implementation plan

Future footer requirements:

- dark foundation;
- multi-column layout;
- grouped links for services, audiences, company, contacts, legal;
- footer must be a structural navigation zone;
- footer must not feel like a template tail;
- mobile footer should collapse to a vertical stack.

## 14. Mobile implementation plan

Mobile must be its own composition.

Requirements:

- 390 and 430 are mandatory QA viewports;
- mobile is not compressed desktop;
- hero is single-column;
- CTA must be visible above the fold;
- minimize secondary noise;
- mobile drawer must be a full UX state;
- proof strip may scroll horizontally;
- cards must stack vertically;
- long stacks need rhythm breaks;
- touch targets must be large;
- sticky CTA must not obstruct forms.

## 15. QA / screenshots plan

On the implementation pass, capture:

- desktop 1440;
- tablet 768;
- mobile 430;
- mobile 390.

Check:

- header;
- dropdown;
- hero;
- proof strip;
- cards;
- CTA;
- footer;
- mobile drawer;
- no local colors;
- no random cards;
- no forbidden promises.

## 16. Implementation order for next coding task

Recommended order:

1. Update `tokens.css`.
2. Update `global.css` and `sections.css`.
3. Refactor header.
4. Refactor hero.
5. Build proof strip.
6. Standardize card families.
7. Refactor evidence / risk dashboard.
8. Refactor CTA panels.
9. Refactor footer.
10. Tune mobile.
11. Run build.
12. Capture screenshots.
13. Write the visual QA report.

## 17. Explicit non-goals

Do not:

- rewrite the entire site without need;
- change business meaning;
- change the approved menu;
- add new services;
- use LRQA imagery;
- copy LRQA text;
- use outcome promises;
- add heavy animation libraries.

## 18. Acceptance criteria for this brief

- `docs/ROKNORD-IMPLEMENTATION-BRIEF.md` exists;
- production code is unchanged;
- CSS is unchanged;
- `tokens.css` is unchanged;
- components and pages are unchanged;
- the brief is specific enough to hand off the next coding task directly.

