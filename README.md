# Рокнорд

Русскоязычный B2B-сайт независимой подготовки к аккредитации и подтверждению компетентности. Статический Astro 7, Manrope, CSS и обычный JavaScript. Node.js >=22.12.0, npm и зафиксированный package-lock.json.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Сборка: `dist/`. Исходники: `src/`, публичные материалы: `public/`. Источник токенов: `src/styles/tokens.css`. Каталог услуг: `src/data/services.ts`, общий шаблон: `src/components/ServicePage.astro`. Статьи используют `ArticleLayout.astro` и `article.css`.

## Кабинет клиента

Интерфейс `/account/` работает с отдельным PHP API. Для локальной проверки после сборки:

```sh
docker compose -f docker-compose.portal.yml run --rm seed
docker compose -f docker-compose.portal.yml up -d portal
```

Адрес: `http://127.0.0.1:4387/account/`. Демо: `demo@roknord.example` / `Roknord-Demo-2026!`. Данные вымышлены; повторный seed не перезаписывает проект. В production демонстрационный вход запрещён.

Инструкции по индивидуальным аккаунтам, документам, переписке, тестам и установке PHP-части: [server/client-portal/README.md](server/client-portal/README.md).

## Проверки и публикация

- `npm run build` — все публичные страницы и статическая оболочка кабинета.
- `npm audit` — известные уязвимости зависимостей.
- `node tests/portal.test.mjs` — интеграционные проверки локального PHP-кабинета.
- `node tests/browser-review.mjs` — браузерная проверка, нужен Chromium и работающий локальный кабинет.
- `node scripts/optimize-news.mjs` — WebP-версии исходных PNG-обложек.

Контактная форма использует существующий PHP/SMTP-обработчик; реальные тестовые отправки требуют разрешения. В кабинете аналитика отключена. Приватные файлы хранятся вне document root.

`npm run deploy:timeweb` публикует статический сайт на Timeweb только по явному запросу. PHP-кабинет устанавливается отдельно по инструкции. Push в main сам по себе сайт не публикует. `docs/` и ZIP-архив — старые публикационные артефакты, не исходники.
