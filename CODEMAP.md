# Карта проекта

Обновлено: 12 сентября 2026. Карту проверяйте по исходникам перед изменениями.

## Публичный сайт

- `src/pages/index.astro`: Hero → Scenarios → PricingSection → InspectionLogic → ProcessSection → AudienceSection → ExpertiseTeamSection → MissionTeaser → ExpertMaterial → FaqSection → ContactForm.
- `src/layouts/BaseLayout.astro`: общая шапка, footer, метаданные, согласие на аналитику; `privatePage` исключает аналитику и cookie-панель из кабинета.
- `src/components/Header.astro`, `MobileMenu.astro`: служебные ссылки, включая «Новости» и «РАЛ-Атлас», и раскрывающиеся меню «Услуги»/«Кому помогаем». Мобильная панель: быстрые ссылки, один уровень раскрытия, закреплённые контакты, управление фокусом и блокировка фоновой прокрутки. Данные: `src/data/siteNavigation.ts`, `audiences.ts`. Проверки: `tests/navigation.test.mjs`.
- `src/data/services.ts`: содержание 14 страниц услуг и аудиторий. `ServicePage.astro` — общий шаблон; `src/pages/[service].astro` создаёт новые маршруты. Существующие каталоги страниц остаются тонкими обёртками.
- `src/pages/materials/`: каталог, учебный пример аудита, материал для ОС СМК и его страница получения.
- `src/pages/ral-atlas/`: описание порядка использования сведений и ссылка на отдельный сервис.
- `src/pages/news/index.astro`: каталог статей. Markdown-страницы лежат в `src/pages/`; общий `ArticleLayout.astro` получает toc, FAQ и метаданные через frontmatter.
- `src/components/ContactForm.astro`: PHP/SMTP-форма, контекст обращения, валидация и юридические диалоги. Обработчик: `server/timeweb-contact-api/`.
- `src/styles/tokens.css`: палитра, Manrope, размеры и семантические токены. Общие CSS глобальные, локальные Astro-стили по умолчанию scoped. Перед изменением проверяйте responsive overrides.
- `src/styles/service.css`, `account.css`, `article.css`: общие стили соответствующих разделов.
- `public/images/news/`: исходные PNG, полные WebP и варианты 800 px. `scripts/optimize-news.mjs` создаёт оптимизированные версии.
- `public/sitemap.xml`: индексируемые маршруты, без кабинета и технических страниц.

## Кабинет

- `src/pages/account/index.astro`: статическая оболочка входа и проекта.
- `src/scripts/account.ts`: запросы к same-origin API, документы, задачи, переписка, загрузка PDF и пароль; пользовательские строки выводятся через textContent.
- `server/client-portal/public/portal.php`: HTTP API, сессии, CSRF/origin, проверка владельца файлов, ограничения запросов.
- `server/client-portal/bootstrap.php`: SQLite и общие функции.
- `server/client-portal/manage.php`: CLI координатора, создание аккаунтов, материалы, задачи и ответы.
- `server/client-portal/timeweb-entry.php`: образец публичной точки входа для Timeweb.
- `docker-compose.portal.yml`: локальный PHP-просмотр на 127.0.0.1:4387, отдельный volume для вымышленных данных.
- `tests/portal.test.mjs`, `tests/browser-review.mjs`: интеграционные и браузерные проверки.

## Границы

`public/` содержит только общедоступные материалы. Клиентские документы и база остаются вне document root. `dist/` — результат сборки; `docs/` и архивы не редактируются как исходники. Публикация статического сайта и установка PHP-кабинета — разные операции, каждая требует явного запроса пользователя.
