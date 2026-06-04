# CLAUDE.md — Roknord Project Instructions

## Claude Operating Mode

- Respond in Russian unless the user explicitly requests another language.
- Treat this file as the project canon for Roknord website work.
- Before editing, inspect the relevant files and existing tokens/components.
- Prefer small, reviewable diffs.
- Do not invent regulatory claims, guarantees, affiliations, or official status.
- If a user request conflicts with this canon, flag the conflict before implementing.
- For UI tasks, preserve approved Roknord brand tokens, navigation structure, and current Astro/CSS architecture.

## Brand Invariant

Рокнорд — комплексная подготовка к аккредитации и подтверждению компетентности.

Сложные процедуры. Твёрдая подготовка.

Документы, процессы, доказательства и риски — в логике проверки ФСА / Росаккредитации.

## Positioning

Рокнорд — независимая экспертная подготовка к процедурам Росаккредитации.

Рокнорд — не сертификационный центр, не государственная услуга, не инфобизнес и не «аккредитация под ключ с гарантией».

Position Roknord around:

- independent readiness audit;
- risk map;
- evidence review;
- accreditation scope review;
- QMS / СМК review;
- FGIS / ФГИС consistency review;
- corrective action preparation;
- document, process, evidence, and risk logic.

## Forbidden Claims

Never use these claims in copy, UI, CTA text, proposals, summaries, or agent output:

- гарантируем прохождение;
- гарантия прохождения;
- гарантия аккредитации;
- решим вопрос с Росаккредитацией;
- договоримся с экспертами;
- снимем замечания;
- закроем несоответствия;
- официальное заключение;
- официальное сопровождение;
- обеспечим положительное решение;
- аккредитация под ключ с гарантией;
- пройдёте без замечаний;
- гарантированно расширим область;
- обеспечим возобновление аккредитации.

Do not use pseudo-safe negations as marketing claims, for example: «не гарантия прохождения».

## Allowed Language

Prefer:

- независимый аудит готовности;
- карта рисков;
- проверка доказательств;
- подготовка к процедуре;
- анализ области аккредитации;
- корректирующие действия;
- сопоставление документов и фактической практики;
- проверка доказательной базы;
- выявление рисков до подачи;
- план корректирующих действий;
- проверка анкеты самообследования;
- анализ выборки дел;
- подготовка к интервью / witness;
- проверка связки «требование → процедура → запись → доказательство».

## Visual Direction

Roknord visual system:

- dark navy base with mint accents, white surfaces, and restrained grey neutrals;
- large dark hero;
- large typography;
- blocky editorial composition;
- image-led sections;
- sharp rectangular rhythm;
- corporate assurance feel;
- fewer dashboards unless the dashboard directly explains evidence/risk logic;
- fewer equal cards;
- no generic SaaS/Tilda look;
- mobile as a separate composition, not a compressed desktop.

Do not copy external brand assets, logos, texts, images, or exact HTML/CSS from any outside site.

Use external references only for composition principles, rhythm, enterprise navigation logic, large image placeholders, blocky solution/resource sections, and corporate assurance mood.

## Current Implementation Canon

The current repository uses Astro/CSS and a token-first design system.

Primary implementation files to inspect before UI edits:

- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/styles/utilities.css`
- `src/styles/header.css`
- `src/styles/hero.css`
- `src/styles/promo.css`
- `src/components/Header.astro`
- `src/components/Hero.astro`
- `src/components/RequestStrip.astro`
- relevant section components under `src/components/`

Do not introduce local one-off hex/rgb/hsl values in components when a token already exists.

## Typography Canon

The current implemented site uses Montserrat.

Use the existing tokens from `src/styles/tokens.css`:

- `--font-family-base`
- `--font-family-heading`
- `--font-body`
- `--font-heading`

Do not switch the project back to Lato / Source Sans 3 unless explicitly requested.

Lato and Source Sans 3 may appear in older LRQA extraction notes as reference observations, but they are not the current implementation requirement.

## Color Canon

Use the current token system in `src/styles/tokens.css`.

The repository already contains the LRQA-derived base tokens:

```css
--lrqa-navy: #0E0B3A;
--lrqa-navy-2: #0F0B38;
--lrqa-nav: #110D34;
--lrqa-dark-mass: #0F0C37;
--lrqa-mint: #00FAB0;
--lrqa-mint-2: #00F8AF;
--lrqa-mint-3: #00F9B0;
--lrqa-white: #FFFFFF;
--lrqa-white-soft: #FEFEFE;
--lrqa-card-light: #F9F9FA;
--lrqa-card-grey: #ECECEC;
--lrqa-warning: #FED503;
--lrqa-black: #000000;
--lrqa-dark-border: #27274E;
--lrqa-muted-dark: #3A3752;
--lrqa-muted: #55536E;
--lrqa-muted-2: #73718B;
--lrqa-border: #B9B8C5;
--lrqa-border-soft: #DEDDE4;