# Visual Gap Report: LRQA → Roknord

## 1. Цель анализа

Анализ нужен не для копирования бренда LRQA, его кода, изображений или точной айдентики.

Цель практическая:

- перенести композиционную дисциплину homepage LRQA на Рокнорд;
- извлечь системную логику header, hero, cards, CTA, footer и mobile;
- зафиксировать цветовую, типографическую и spacing-иерархию;
- понять, какие элементы можно безопасно адаптировать под позиционирование Рокнорда как независимой экспертной подготовки к процедурам Росаккредитации.

## 2. Использованные материалы

- `docs/ROKNORD-DESIGN-CANON.md`
- `docs/screenshots/SCREENSHOT-MANIFEST.md`
- `docs/lrqa-homepage-design-extraction.md`
- `docs/screenshots/reference/lrqa-1440.png`
- `docs/screenshots/reference/lrqa-1024.png`
- `docs/screenshots/reference/lrqa-768.png`
- `docs/screenshots/reference/lrqa-430.png`
- `docs/screenshots/reference/lrqa-390.png`
- `docs/screenshots/reference/lrqa-hero-1440.png`
- `docs/screenshots/reference/lrqa-hero-1024.png`
- `docs/screenshots/reference/lrqa-hero-768.png`
- `docs/screenshots/reference/lrqa-hero-430.png`
- `docs/screenshots/reference/lrqa-hero-390.png`
- `docs/screenshots/reference/lrqa-nav-open-1440.png`
- `docs/screenshots/reference/lrqa-search-open-1440.png`
- `docs/screenshots/reference/lrqa-mobile-menu-390.png`
- `docs/screenshots/roknord/roknord-1440.png`
- `docs/screenshots/roknord/roknord-1024.png`
- `docs/screenshots/roknord/roknord-768.png`
- `docs/screenshots/roknord/roknord-430.png`
- `docs/screenshots/roknord/roknord-390.png`

Viewport:

- `1440x1200`
- `1024x1200`
- `768x1200`
- `430x1200`
- `390x1200`

Ограничения:

- на первом заходе LRQA показал cookie overlay, но для финальных captures был применён OneTrust accept flow и сохранён storage state;
- фактический homepage подтверждён по initial root `https://www.lrqa.com/`, final locale URL `https://www.lrqa.com/de-de/`, title и visible H1;
- locale `/de-de/` принят как валидный homepage reference, потому что для анализа важны visual system, structure и components;
- некоторые footer / nested section backgrounds в computed styles выглядят прозрачными, потому что цветовая масса рисуется внутренними обёртками;
- по LRQA доступны computed styles для корневых токенов и ключевых hero / nav текстовых элементов, но не для всех внутренних карточек;
- Roknord снимался с локального `http://127.0.0.1:4321/`, production-код не трогался.

## 3. Executive Summary

Что у LRQA работает как система:

- двухуровневый header создаёт мгновенный корпоративный каркас;
- hero построен как тёмная масс-структура с крупным заголовком, большим визуальным полем и коротким lead;
- mint используется дозированно как action-accent, а не как декоративная заливка;
- секции чередуют dark и light surfaces, а карточки и framed blocks подчинены общему ритму;
- mobile не выглядит просто сжатым desktop: меню, поиск и контент переупакованы системно.

Почему текущий Рокнорд слабее:

- у Рокнорда уже есть правильный dark / mint / white direction, но система ещё не такая цельная, как у LRQA;
- header визуально легче и менее статусен;
- hero и карточки уже сильные, но система ещё не завершена по ритму, spacing и footer;
- mobile у Рокнорда уже рабочий, но местами всё ещё ощущается как адаптированная desktop-композиция;
- LRQA сильнее в масштабе, в типографической уверенности и в повторяемости компонентов.

Что даст максимальный эффект:

1. Укрупнить и усложнить header как двухуровневую систему.
2. Сделать hero ещё более editorial и менее «страничным».
3. Зафиксировать proof strip как самостоятельный компонент.
4. Стандартизировать card families.
5. Жёстко токенизировать spacing.
6. Усилить footer как структурный блок, а не завершение страницы.
7. Довести mobile drawer и search overlay до полноценного системного поведения.
8. Свести CTA к одной логике действия без агрессивного маркетинга.
9. Сохранить dark/light alternation как принцип.
10. Не распылять magenta только на editorial/report accents.

## 4. Общая композиция desktop

### LRQA

- 1440 и 1024 показывают крупную, широкую, структурную homepage-композицию;
- hero — тёмная full-width масса с визуальным storytelling;
- ниже hero идут promo, quick links, service blocks, industry chooser, news, newsletter strip и footer;
- white sections используются для информационного дыхания, но тёмные секции держат всё в одной линейке;
- карточки и списки выглядят как единая enterprise-система, а не как набор лендинговых блоков.

### Roknord

- у Рокнорда уже есть сильный dark hero, хорошие cards и понятный ритм секций;
- визуальный язык ближе к corporate assurance, чем к generic SaaS, и это плюс;
- при этом композиция всё ещё чуть менее «оркестрована»: некоторые блоки сильны сами по себе, но не до конца собраны в единый page rhythm;
- белые секции местами слишком ровные после сильных тёмных масс;
- footer и промежуточные white sections можно сделать более уверенными по weight и contrast.

### Вывод

- LRQA сильнее в общей page architecture и page weight;
- Roknord уже в правильной системе, но ещё нуждается в более строгом композиционном контроле.

## 5. Header и navigation

### LRQA

- utility row сверху отделена от main nav;
- слева в utility зоне locale;
- справа utility links и mint CTA `Kontaktieren Sie uns`;
- main nav row dark, logo слева, пункты по центру, search справа;
- desktop dropdown logic есть и работает как большая enterprise-navigation;
- search открывается как отдельное полноэкранное состояние;
- mobile menu открывается как полноэкранный drawer;
- header height на capture: `134px`.

### Roknord

- канон по IA уже правильный: `Услуги` и `Кому помогаем` в main nav, utility row отдельно;
- визуально header пока легче и менее доминирующий, чем у LRQA;
- он должен стать более массивным и статусным, особенно над dark hero;
- header должен выглядеть как system component, а не просто верхняя панель.

### Вывод

- у LRQA header — полноценная система навигации;
- у Рокнорда правильная структура уже есть, но требуется более строгий visual weight и яснее разделённые header rows.

## 6. Hero

### LRQA

- hero — тёмный full-width masthead;
- H1: `32px`, `Lato`, `900`, `line-height 35.84px`;
- lead: `16px`, `Source Sans 3`, `400`, `line-height 24px`;
- primary CTA mint, secondary CTA и supporting links рядом;
- hero использует large visual field с атмосферной фотографией и затемнением;
- mobile hero сохраняет large statement, но делает layout плотнее.

### Roknord

- hero у Рокнорда уже близок к нужной модели: тёмная масса, крупный H1, mint акцент, короткий lead;
- это правильное направление, но правая визуальная часть ещё должна выглядеть не как декоративная геометрия, а как evidence/risk logic;
- под hero нужен более чистый proof strip;
- mobile hero нужно держать коротким и читабельным, без лишнего шума above the fold.

### Вывод

- LRQA показывает hero как system band;
- Рокнорду нужно довести hero до уровня не просто «красиво», а «сразу понятно, что это за экспертная компания и как она работает».

## 7. Цветовая система

### LRQA

- base: `#0F1232` / `rgb(15, 18, 50)`;
- surface: белые и светлые секции;
- action accent: `#0FF2B2`;
- highlight accent: `#BF1F99`;
- neutral divider: `#F1F4F7`;
- text family: `#0F1232` / `#000000`.

### Roknord

- базовая direction уже соответствует канону: dark navy, mint, white, grey;
- magenta должен оставаться только editorial / report accent;
- зелёный нужен только как CTA / link / action accent;
- тёмный foundation нужен для header, hero, risk blocks, process blocks и footer;
- белые и светлые поверхности нужны для доказательных и аналитических секций.

### Вывод

- LRQA подтверждает, что строгая цветовая дисциплина работает лучше, чем разноцветный маркетинговый микс;
- Рокнорду важно не расползтись по случайным оттенкам и не смешать mint с magenta вне системных ролей.

## 8. Типографика

### LRQA

- H1 большой, жирный, короткий;
- section titles заметно меньше H1, но не теряются;
- body плотный, читабельный, не декоративный;
- nav сдержанный и enterprise-ориентированный;
- mobile typography остаётся читаемой без ощущения мелкого SaaS UI.

### Roknord

- H1 уже хороший и по масштабу, и по характеру;
- часть section titles и supporting text ещё можно сделать более уверенными;
- body в целом читабельный, но отдельные блоки выглядят чуть более шаблонно, чем нужно;
- мобильная типографика уже рабочая, но местами плотность текста создаёт ощущение сжатия.

### Вывод

- LRQA выигрывает в typographic confidence;
- у Рокнорда должна быть чуть более крупная иерархия между hero, section title и body, без выравнивания всего к одному весу.

## 9. Сетка, контейнеры и spacing

### LRQA

- visible gutter на desktop: около `40px`;
- spacing токены в CSS уже есть: `2.5rem`, `3.75rem`, `5rem`;
- header uses stable row height;
- hero content sits within a wide split layout;
- footer inherits the same rhythm and spacing discipline.

### Roknord

- контейнер и сетка уже ближе к нужному результату, чем к стартовой точке;
- некоторые секции и карточки можно ещё жёстче привязать к ограниченному набору spacing tokens;
- нужно формализовать `container-max`, `section-y`, `card-gap`, `card-padding`, `nav-height`, `utility-height`;
- mobile spacing должен стать отдельной системой, а не уменьшенной desktop-системой.

### Вывод

- LRQA подтверждает, что spacing должен быть ограниченным набором правил, а не набором локальных величин;
- Рокнорд уже близок, но ему ещё нужен формальный spacing system layer.

## 10. Карточки и framed blocks

### LRQA

- promo cards и news cards используют framing, dark overlays, labels и strong visual anchors;
- cards не выглядят случайными;
- pill-like quick links и article cards подчиняются одному уровню строгости;
- mobile переводит cards в вертикальную дисциплину.

### Roknord

- service / audience cards уже направлены правильно;
- magenta framed recommendation blocks соответствуют нужной editorial роли;
- process rows на dark background работают, но могут стать ещё более системными;
- materials cards можно усилить по hierarchy;
- risk / evidence blocks нужно закрепить как отдельный системный тип.

### Вывод

- LRQA показывает, что card discipline = repeatable system;
- Рокнорду нужно не плодить случайные карточки, а довести существующие семейства до одного каркаса.

## 11. CTA-система

### LRQA

- primary CTA mint;
- secondary CTA/links спокойные, не агрессивные;
- header CTA встроен в navigation;
- section CTA и newsletter CTA логичны и коротки;
- mobile CTA сохраняют крупный touch target.

### Roknord

- зелёный/mint должен стать основным action accent;
- CTA должен быть строго B2B: `Разобрать задачу`, `Аудит готовности`, `Карта рисков`, `План корректирующих действий`;
- не нужно обещать результат или строить инфобизнесный funnel;
- sticky может быть только в форме post-hero CTA strip, а не навязчивого плавающего баннера.

### Вывод

- LRQA подтверждает simple CTA logic;
- у Рокнорда CTA должен оставаться точным, спокойным и процедурным.

## 12. Mobile analysis

### LRQA

- 430 и 390 показывают полноценную mobile rewrite:
  - header уменьшается и даёт menu state;
  - search превращается в отдельный overlay;
  - mobile menu становится full-screen drawer;
  - hero и content stack идут в один столбец;
  - cards вытягиваются вертикально;
  - footer становится компактным stack.

### Roknord

- мобильная версия уже читабельна и не выглядит сломанной;
- структура секций сохраняется;
- card rhythm становится вертикальным;
- но page still feels a bit more compressed than LRQA;
- proof strip, CTA, and footer should be even more tuned for thumb-first behavior.

### Вывод

- LRQA сильнее в mobile system behavior;
- Roknord already works, but the mobile composition should feel more intentional and less like a compressed desktop page.

## 13. Что именно переносим из LRQA как систему

- двухуровневый header;
- dark hero/header mass;
- mint action accent;
- section rhythm;
- card discipline;
- footer structure;
- mobile menu and search overlay logic;
- CTA logic;
- container / spacing discipline.

## 14. Что не переносим

- тексты;
- изображения;
- логотип и бренд LRQA;
- точные уникальные UI-детали;
- чужой код;
- чужую навигационную терминологию;
- чужую trademarked айдентику.

## 15. Главные проблемы текущего Рокнорда

1. Header ещё не такой массивный и уверенный, как у LRQA.
2. Utility row и main row нужно ещё сильнее разделить.
3. Hero правый visual logic ещё не до конца оформлен как evidence/risk logic.
4. Proof strip нуждается в более жёсткой системе.
5. Some white sections выглядят чуть слишком ровно после dark hero.
6. Card families ещё не до конца стандартизированы.
7. Materials cards можно сделать более различимыми.
8. Footer still feels weaker than the hero and card blocks.
9. CTA system ещё не полностью unified.
10. Spacing требует более формального token layer.
11. Mobile hero and card stacks can be a bit more compact and deliberate.
12. Некоторые blocks ещё слишком close to generic corporate layout.
13. Нужно жёстче удерживать magenta как editorial accent only.
14. Нужно не допустить разрастания случайных cards.
15. Нужно сохранять B2B-строгость без outcome promises.

## 16. Рекомендации для следующего этапа

1. Какие tokens добавить:
   - `container-max`
   - `container-x-desktop`
   - `container-x-mobile`
   - `section-y-xl`
   - `section-y-lg`
   - `section-y-md`
   - `card-padding-lg`
   - `card-gap`
   - `nav-height`
   - `utility-height`
   - `hero-min-height`
   - dark / surface / divider / accent tokens

2. Какие компоненты стандартизировать:
   - utility topbar;
   - header desktop;
   - mobile drawer;
   - hero split;
   - proof strip;
   - service card;
   - audience card;
   - risk card;
   - process block;
   - CTA panel;
   - footer columns.

3. Какие секции главной пересобрать:
   - hero;
   - proof strip;
   - service cluster;
   - audience / industry block;
   - risk / evidence dashboard;
   - news / materials block;
   - final CTA;
   - footer.

4. Какие mobile rules зафиксировать:
   - mobile hero is a standalone composition;
   - no hidden critical sections;
   - vertical cards by default;
   - horizontal scroll only for strips that need it;
   - CTA must not overlap forms;
   - menu/search are first-class states.

5. Какие visual QA criteria добавить:
   - approved color canon only;
   - two-level header present;
   - dark hero mass present;
   - no random cards;
   - no local colors;
   - mobile is not just compressed desktop;
   - CTA stays strict B2B;
   - no forbidden promises.

## 17. Acceptance checklist для будущей реализации

- [ ] Desktop `1440` shows a cohesive LRQA-style editorial system.
- [ ] Tablet `768` preserves hierarchy and spacing discipline.
- [ ] Mobile `390` reads as a deliberate mobile composition.
- [ ] Header has a utility row and a main row.
- [ ] Main nav contains only the approved primary items.
- [ ] Hero contains a strong H1, short lead and clear CTA.
- [ ] Hero includes proof / evidence logic.
- [ ] Cards are standardized and repeatable.
- [ ] CTA uses mint as the action accent.
- [ ] Editorial accent uses magenta only where approved.
- [ ] Footer is a structured information zone.
- [ ] No local colors outside tokens.
- [ ] No random cards.
- [ ] No SaaS/Tilda generic look.
- [ ] No forbidden promises such as `гарантируем прохождение`, `решим вопрос с Росаккредитацией`, `официальное сопровождение`, `без замечаний`, `получите аккредитацию точно в срок`.
- [ ] Copy remains in the logic of independent preparation, audit of readiness, risk map, evidence base, accreditation scope, self-assessment, QMS documents, case sampling, corrective actions, and FGIS / PK preparation.
