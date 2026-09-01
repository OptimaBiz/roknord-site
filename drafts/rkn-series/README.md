# Серия публикаций по разъяснениям Роскомнадзора

Черновики находятся вне `src/pages`, а обложки — вне `public`, поэтому до публикации Astro не создаёт маршруты и публичные URL материалов.

| Дата | Черновик | Изображение | Публичный slug |
| --- | --- | --- | --- |
| 2026-09-03 | `processy-obrabotki-personalnyh-dannyh-2026.md` | `assets/processy-obrabotki-personalnyh-dannyh-2026.png` | `/processy-obrabotki-personalnyh-dannyh-2026/` |
| 2026-09-05 | `uvedomlenie-roskomnadzora-personalnye-dannye-2026.md` | `assets/uvedomlenie-roskomnadzora-personalnye-dannye-2026.png` | `/uvedomlenie-roskomnadzora-personalnye-dannye-2026/` |
| 2026-09-07 | `politika-soglasie-pravovoe-osnovanie-personalnye-dannye-2026.md` | `assets/politika-soglasie-pravovoe-osnovanie-personalnye-dannye-2026.png` | `/politika-soglasie-pravovoe-osnovanie-personalnye-dannye-2026/` |
| 2026-09-09 | `minimizaciya-hranenie-obezlichivanie-personalnyh-dannyh-2026.md` | `assets/minimizaciya-hranenie-obezlichivanie-personalnyh-dannyh-2026.png` | `/minimizaciya-hranenie-obezlichivanie-personalnyh-dannyh-2026/` |

Перед публикацией каждого материала:

1. Проверить официальные источники и отсутствие более свежих разъяснений.
2. При необходимости скорректировать текст, даты и FAQ без изменения канонической композиции.
3. Переместить Markdown в `src/pages/`, исправив `layout` на `../layouts/ArticleLayout.astro`.
4. Переместить обложку в `public/images/news/`.
5. Добавить карточку первой в `src/pages/news/index.astro`.
6. Проверить FAQ, TOC, canonical, OG и JSON-LD.
7. Запустить `npm run build` и визуальную проверку desktop/mobile.
8. Создать отдельный коммит, выполнить push в `main`, затем `npm run deploy:timeweb`.
9. Проверить `200` для статьи, изображения и `/news/`, а также production canonical и OG image.
