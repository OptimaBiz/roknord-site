# CLAUDE.md — Roknord Project Instructions

## Claude Operating Mode

- Respond in Russian unless the user explicitly requests another language.
- Treat this file as the project canon for Roknord website work.
- Before editing, inspect the relevant files and existing tokens/components.
- Prefer small, reviewable diffs.
- Do not invent regulatory claims, guarantees, affiliations, or official status.
- If a user request conflicts with this canon, flag the conflict before implementing.
- For UI tasks, preserve approved Roknord brand tokens and navigation structure.

## Brand Invariant

Рокнорд — комплексная подготовка к аккредитации и подтверждению компетентности.

Сложные процедуры. Твёрдая подготовка.

Документы, процессы, доказательства и риски — в логике проверки ФСА (Росаккредитация).

## Positioning

Рокнорд — независимая экспертная подготовка к процедурам Росаккредитации.

Рокнорд — не сертификационный центр, не государственная услуга, не инфобизнес, не "аккредитация под ключ с гарантией".

Position Roknord around:
- readiness audit;
- risk map;
- evidence review;
- accreditation scope review;
- QMS / СМК review;
- FGIS / ФГИС consistency review;
- corrective action preparation.

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
- Не гарантия прохождения.

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
- план корректирующих действий.

## Visual Direction

Roknord visual system:
- dark navy base with mint accents, white surfaces, and restrained grey neutrals;
- large dark hero;
- large typography;
- blocky editorial composition;
- image-led sections;
- sharp rectangular rhythm;
- corporate assurance feel;
- fewer dashboards;
- fewer equal cards;
- no generic SaaS/Tilda look.

Do not copy external brand assets, logos, texts, images, or exact HTML/CSS from any outside site.
Repeat the color system, composition principles, header/hero rhythm, large image placeholders, blocky solution/resource sections, and corporate assurance mood.

## Header Navigation Canon

The site header has two levels:

1. A stationary top service row.
2. A main product navigation row with the Roknord logo on the left and only two primary items: `Услуги` and `Кому помогаем`.

Top service row links:
- О компании
- Личный кабинет
- Карьера
- Сотрудничество
- Контакты

Top service row CTA:
- Разобрать задачу

Dropdown `Услуги`:
- Подготовка к подтверждению компетентности
- Аудит и актуализация области аккредитации
- Корректирующие действия после несоответствий
- Подготовка к первичной аккредитации
- Специальные направления

Dropdown `Кому помогаем`:
- Испытательным лабораториям
- Медицинским лабораториям
- Органам по сертификации систем менеджмента
- Органам по сертификации продукции
- Органам инспекции
- Калибровочным лабораториям
- Провайдерам МСИ
- Органам по сертификации халяль

Do not place `О компании`, `Материалы`, or `Контакты` in the main navigation row. `О компании` and `Контакты` belong only in the top service row. Do not return `Материалы` to header/navigation unless a separate approved placement is added.

## Editorial Promo Pattern

For editorial, promo, report, and expert-material blocks, use a magenta/purple accent-frame and an integrated angled label-tab. The label-tab is part of the top border line, not a floating green badge inside the card.

Use tokens for this pattern:
- `--color-editorial-accent`
- `--color-promo-border-accent`
- `--color-promo-label-bg`
- `--color-promo-label-text`
- `--editorial-frame-bevel`
- `--editorial-label-bevel`
- `--button-bevel`

Reusable style pattern:
- editorial cards use a shared frame utility with a beveled lower-left corner;
- editorial label-tabs use a shared angled tab utility attached to the frame;
- all filled CTA buttons use a shared two-sided angled CTA shape utility.

Do not replace the promo/report label-tab with green. Green is reserved for CTA, links, arrows, and key brand accents.

## Mandatory Color Canon

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
```

Do not use the previous approximate palette as part of the approved canon:
- #B7FF00
- #D7FF3F
- #003A40
- #002D32
- #F4F1EA

## Claude Code Engineering Rules

- Work in the local repository tree only.
- Do not commit or push without an explicit user command.
- Keep changes narrow unless the task explicitly asks for a radical visual redesign.
- Use Astro/CSS.
- Avoid heavy libraries.
- Avoid decorative JavaScript.
- Desktop first.
- Mobile clean and readable.
- After frontend changes, run `npm run build` and report the result.
- Do not modify application source files unless the task explicitly requires it.

## Repo-Local Skills / Reference Files

- `roknord-brand`: brand, positioning, accreditation framing, forbidden and allowed language.
- `roknord-copy-rules`: Russian evidence-driven B2B copy rules for headings, sections, CTAs, and legal-safe wording.
- `roknord-ui-style`: strict visual canon, composition rules, UI anti-template checks.
- `roknord-lrqa-visual-reference`: visual-system canon and composition rules.

## Claude Review Roles

- Use `roknord_art_director` logic for strict senior visual direction review.
- Use `roknord_qa_guardian` logic for strict QA and brand-compliance review.
- Use `roknord_frontend_implementer` logic for Astro/CSS implementation of approved Roknord visual briefs.
