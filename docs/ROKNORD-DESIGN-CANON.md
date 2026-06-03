# ROKNORD DESIGN CANON

## 1. Назначение файла

Этот файл фиксирует визуальный, композиционный и UX-канон сайта «Рокнорд».

Он нужен, чтобы все дальнейшие правки выполнялись не через импровизацию, а через единую систему: токены, сетки, карточки, секции, mobile rules и visual QA.

## 2. Reference status

Reference: LRQA homepage.

- Initial URL: `https://www.lrqa.com/`
- Final URL: `https://www.lrqa.com/de-de/`
- Locale `/de-de/` accepted as valid homepage reference
- OneTrust cookie flow applied
- Final captures are clean enough for design-system extraction
- Floating chat widget remains as a minor capture limitation
- Some values are inferred from computed styles and rendered geometry

Важно:

- не писать, что LRQA screenshots показывают cookie policy;
- считать валидным именно homepage reference, а не служебную страницу;
- locale `/de-de/` принимается, потому что для проекта важны визуальная система, структура и компоненты.

## 3. Позиционирование сайта

«Рокнорд» — комплексная подготовка к аккредитации и подтверждению компетентности.

Базовая связка:

> Рокнорд — комплексная подготовка к аккредитации и подтверждению компетентности.

Слоган:

> Сложные процедуры. Твёрдая подготовка.

Смысловая строка:

> Документы, процессы, доказательства и риски — в логике проверки.

Рокнорд строится как:

- строгий evidence-driven B2B-сайт;
- corporate / assurance / certification стиль;
- dark header / hero / footer foundation;
- светлые аналитические секции;
- крупноблочная editorial system;
- жёсткая контейнерная сетка;
- строгие framed blocks;
- зелёный / mint как CTA / action / link accent;
- magenta только как editorial / report / frame accent;
- mobile как отдельная композиция, а не compressed desktop.

Запрещено воспринимать сайт как:

- Tilda-like;
- generic SaaS;
- инфобизнес;
- декоративные блоки без функции;
- случайные цвета;
- случайные карточки;
- локальные hex / rgb / hsl вне tokens.css.

## 4. LRQA reference tokens

Из LRQA homepage extraction берём не копирование 1:1, а базовую систему координат для будущих токенов Рокнорда.

### Colors

- dark foundation: `#0F1232` / `rgb(15, 18, 50)`
- mint action: `#0FF2B2`
- magenta highlight: `#BF1F99`
- light divider: `#F1F4F7`
- white: `#FFFFFF`
- body text: `#000000`

### Typography

- heading font: `Lato, sans-serif`
- body font: `Source Sans 3, sans-serif`
- H1 desktop: `32px / 35.84px / 900`
- section title: `22px / 23.98px / 900`
- body / lead: `16px / 24px / 400`

### Spacing / layout

- desktop gutter: `40px / 2.5rem`
- spacing-small: `2.5rem`
- spacing-default: `3.75rem`
- spacing-large: `5rem`
- header height: `134px`
- hero content block height: `586px`
- footer block height: `506px`
- CTA padding vertical: `0.875rem`
- CTA padding horizontal: `1.875rem`
- inferred container max on 1440: about `1360px`

Эти значения не обязаны копироваться механически 1:1, но должны стать базой для токенов Рокнорда.

## 5. Color canon

Роли цветов для Рокнорда:

- dark foundation: header, hero, risk / evidence blocks, process blocks, footer;
- page background: общий фон;
- light section surface: аналитические и доказательные секции;
- card surface: белые карточки;
- dark card surface: сервисные / audience / risk cards;
- text primary: основные заголовки и тело;
- text inverse: текст на тёмном фоне;
- text muted: вторичный текст;
- border subtle: мягкие разделители;
- border strong: framed blocks;
- CTA green / mint: primary actions;
- CTA hover: отдельный токен;
- link / action green: ссылки и активные состояния;
- editorial magenta: `#BF1F99` или утверждённый близкий magenta для report / editorial accents;
- status / risk colors: только в risk / evidence dashboard.

Правила:

- green / mint только для CTA / action / link;
- magenta только для editorial / report / frame accents;
- mint и magenta не должны конкурировать в одном visual node;
- не использовать случайные оттенки рамок, фонов и акцентов;
- точные значения реализуются позже в tokens.css.

## 6. Header canon

Header должен быть двухуровневым:

1. utility row сверху;
2. main nav row ниже.

Требования:

- header должен иметь заметный visual weight, близкий к enterprise navigation;
- main nav содержит только `Услуги` и `Кому помогаем`;
- utility links: `О компании`, `Личный кабинет`, `Карьера`, `Сотрудничество`, `Контакты`;
- CTA: `Разобрать задачу`;
- CTA должен быть встроен в header system, а не выглядеть случайной кнопкой;
- desktop dropdown должен быть крупным enterprise-style panel;
- только один dropdown может быть открыт одновременно;
- search, если будет добавлен позже, должен быть отдельным overlay state;
- mobile drawer должен быть full-screen или near-full-screen UX-состоянием, а не скрытым desktop menu;
- header не должен выглядеть как тонкая лендинговая панель.

## 7. Hero canon

Hero — dark full-width masthead / dark hero mass.

Требования:

- H1 крупный, короткий, строгий;
- lead короткий и предметный;
- primary CTA: `Разобрать задачу`;
- secondary CTA: максимум одна вторичная action;
- secondary links above the fold минимизировать;
- правая часть должна быть evidence / risk dashboard, а не декоративная геометрия;
- декоративная геометрия допустима только как часть evidence / risk visual logic;
- под hero должен стоять сильный proof strip;
- hero не должен быть generic consulting banner.

Смысловая hero-логика:

- H1: `Комплексная подготовка к аккредитации и подтверждению компетентности`
- Lead: `Документы, процессы, доказательства и риски — в логике проверки Росаккредитации.`
- Proof strip: `Область аккредитации · СМК · Анкета самообследования · Выборка дел · ФГИС · Корректирующие действия`

## 8. Proof strip canon

Proof strip — самостоятельный системный компонент.

Требования:

- стоит сразу под hero;
- показывает объекты проверки и доказательной базы;
- связывает hero с последующими секциями;
- на mobile может быть horizontal scroll;
- не должен превращаться в случайные бейджи;
- не должен распадаться на декоративные chips без функции.

Возможные элементы:

- Область аккредитации;
- СМК;
- Анкета самообследования;
- Выборка дел;
- ФГИС;
- Корректирующие действия;
- Карта рисков;
- Доказательства компетентности.

## 9. Section rhythm canon

Порядок главной:

1. Header
2. Hero
3. Proof strip
4. Основные сценарии помощи
5. Кому помогаем
6. Ключевые услуги
7. Evidence / risk dashboard
8. Как работаем
9. Экспертные материалы / направления
10. CTA-блок
11. FAQ
12. Footer

Для каждой секции важны:

- функция;
- тип компонента;
- роль в B2B-доверии.

Общие правила ритма:

- секции не должны идти одинаковым ритмом;
- нужно чередование dark mass / white analytical mass / dark mass;
- белые секции не должны выглядеть плоско;
- переходы между секциями должны быть частью системы;
- page rhythm должен быть ближе к enterprise editorial homepage, а не к набору лендинговых блоков.

## 10. Spacing canon

Pending spacing tokens:

- `container-max`
- `container-x-desktop`
- `container-x-mobile`
- `section-y-xl`
- `section-y-lg`
- `section-y-md`
- `card-padding-xl`
- `card-padding-lg`
- `card-gap-lg`
- `proof-strip-x`
- `nav-height`
- `utility-height`
- `hero-min-height`
- `footer-padding-block`

Правила:

- spacing не задавать локально в компонентах;
- не создавать новые отступы под каждую секцию;
- mobile spacing должен иметь отдельные правила;
- card gaps и section gaps должны быть tokenized;
- ориентир LRQA: `40px` gutter, `2.5rem / 3.75rem / 5rem` spacing rhythm.

## 11. Component canon

Обязательные компоненты и назначение:

- Section shell
- Utility topbar
- Header desktop
- Header mobile
- Mobile drawer
- Search overlay, optional future component
- Hero split
- Evidence / risk dashboard
- Proof strip
- Service card
- Audience card
- Risk card
- Process card / process row
- Expert material card
- Compact link card
- CTA panel
- FAQ item
- Footer column

## 12. Card canon

Карточки нельзя делать случайными.

Каждый тип карточки должен иметь единый:

- padding;
- border;
- title style;
- text style;
- hover / focus;
- mobile behavior.

Framed cards не должны иметь double border.

Семейства карточек:

- service card;
- audience card;
- risk card;
- process card;
- expert material card;
- compact link card;
- CTA card;
- article / material card;
- framed editorial block.

Правила по семействам:

- service card и audience card должны быть строгими;
- expert material card использует magenta frame / tab accent;
- CTA card использует mint / green action accent;
- risk card использует status / risk markers без тревожного визуального шума;
- materials cards не должны быть слишком однотипными;
- тёмные cards не должны быть перегружены текстом одинакового веса.

## 13. Evidence / risk dashboard canon

Evidence / risk dashboard — ключевой визуальный язык Рокнорда.

Он должен показывать не SaaS-виджет, а экспертную карту проверки.

Допустимые сущности:

- область аккредитации;
- СМК;
- анкета самообследования;
- выборка дел;
- ФГИС;
- корректирующие действия;
- статус доказательств;
- уровень риска;
- сроки процедуры;
- документы и записи;
- компетентность персонала.

Запрещено:

- декоративные графики без смысла;
- псевдоофициальные печати;
- имитация интерфейса Росаккредитации;
- обещания результата.

## 14. CTA canon

mint / green используется для CTA / action / link accent.

Требования:

- CTA не должен быть агрессивным инфобизнесным оффером;
- sticky допускается только как post-hero CTA strip;
- CTA не должен перекрывать форму на mobile;
- hero CTA, section CTA и final CTA должны быть визуально связаны одним правилом;
- final contact block должен выглядеть как enterprise panel.

Разрешённые CTA:

- Разобрать задачу
- Запросить первичный разбор
- Проверить готовность
- Обсудить ситуацию
- Получить карту рисков
- Проверить область аккредитации
- Подготовить план действий

Запрещённые CTA:

- Гарантируем прохождение
- Пройдёте без замечаний
- Решим вопрос с Росаккредитацией
- Получите аккредитацию точно в срок
- Официальное сопровождение

## 15. Mobile canon

Mobile не должен быть compressed desktop.

Требования:

- mobile 390 — обязательный QA viewport;
- hero в один столбец;
- минимум secondary noise above the fold;
- CTA виден на первом экране;
- mobile drawer удобен для большого пальца;
- mobile drawer должен быть полноценным состоянием;
- proof strip допускается horizontal scroll;
- карточки идут вертикально;
- touch targets крупные;
- важные блоки нельзя скрывать;
- длинные mobile stacks нужно разбивать ритмом;
- sticky CTA не перекрывает форму;
- process и final CTA должны сохранять читаемость.

## 16. Footer canon

Footer — полноценная структурная навигационная зона, а не технический хвост.

Требования:

- footer должен возвращать dark foundation;
- footer должен быть композиционно не слабее header / hero;
- в footer должны быть группы ссылок по услугам, аудиториям, компании и контактам;
- footer должен поддерживать B2B-доверие;
- footer не должен выглядеть как шаблонный блок;
- ориентир LRQA: dark multi-column footer, structured links, legal links, social / contact utility.

## 17. Copy safety canon

Разрешённая логика:

- независимая подготовка;
- аудит готовности;
- карта рисков;
- доказательная база;
- область аккредитации;
- анкета самообследования;
- документы СМК;
- выборка дел;
- корректирующие действия;
- ФГИС;
- подготовка к ПК.

Запрещённые формулировки:

- «гарантируем прохождение»;
- «решим вопрос с Росаккредитацией»;
- «официальное сопровождение»;
- «без замечаний»;
- «получите аккредитацию точно в срок»;
- «представляем интересы в Росаккредитации», если нет отдельной юридически проверенной модели.

## 18. Current visual diagnosis

Диагноз текущего Рокнорда по visual gap report:

- направление по dark / mint / white уже правильное;
- header визуально легче и менее статусен, чем у LRQA;
- utility row и main row нужно сильнее разделить;
- hero уже близок к нужной модели;
- правая hero-часть должна стать evidence / risk logic;
- proof strip требует более жёсткой системы;
- card families ещё не до конца стандартизированы;
- materials cards можно сделать более различимыми;
- footer слабее hero и card blocks;
- CTA system ещё не fully unified;
- spacing требует формального token layer;
- mobile рабочий, но местами всё ещё похож на compressed desktop.

## 19. Visual QA canon

Checklist:

- desktop 1440 shows cohesive LRQA-style editorial system;
- tablet 768 preserves hierarchy and spacing discipline;
- mobile 390 reads as deliberate mobile composition;
- header has utility row and main row;
- main nav contains only approved primary items;
- utility topbar contains approved links and CTA;
- one dropdown open at a time;
- dark hero mass present;
- strong H1;
- evidence / risk dashboard present;
- proof strip present and readable;
- cards standardized and repeatable;
- CTA uses mint / green as action accent;
- editorial / report accents use magenta only;
- footer is structured information zone;
- no local colors outside tokens;
- no random cards;
- no SaaS / Tilda generic look;
- no forbidden promises;
- live preview available;
- screenshots can be captured without cookie / policy / error-state issues.

## 20. Следующий этап

Следующий этап после этого файла:

1. создать implementation brief для пересборки design system;
2. обновить tokens.css;
3. обновить global.css / sections.css;
4. пересобрать header;
5. пересобрать hero + proof strip;
6. стандартизировать cards;
7. усилить footer;
8. отдельно проверить mobile 390 / 430;
9. сделать visual QA screenshots.

