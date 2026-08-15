# Деплой на Timeweb с локального Mac

GitHub используется только как хранилище коммитов. Push в `main` не запускает
публикацию. Production-сборка создаётся на локальном Mac и напрямую передаётся
на Timeweb командой:

```bash
npm run deploy:timeweb
```

## SSH — рекомендуемый способ

Публичный ключ этого Mac уже добавлен в Timeweb. Для публикации достаточно:

```bash
npm run deploy:timeweb
```

Значения по умолчанию:

- хост: `vh348.timeweb.ru`;
- порт: `22`;
- пользователь: `slimmboy`;
- каталог сайта: `roknord/public_html`.

Их можно переопределить переменными `TIMEWEB_SSH_HOST`, `TIMEWEB_SSH_PORT`,
`TIMEWEB_SSH_USER` и `TIMEWEB_SITE_PATH`. Для отдельного ключа укажи абсолютный
путь в `TIMEWEB_SSH_KEY`.

## FTP — резервный способ

Установи `lftp` (`brew install lftp`), задай `TIMEWEB_DEPLOY_TRANSPORT=ftp`,
`TIMEWEB_FTP_USER` и `TIMEWEB_FTP_PASSWORD`. При необходимости доступны
`TIMEWEB_FTP_HOST` и `TIMEWEB_FTP_PATH`.

Скрипт выполняет `npm run build`, затем загружает только `dist/` поверх текущей
версии. Он не удаляет посторонние файлы на сервере. Видео `.mp4` и `.webm` не
передаются. Секреты не должны храниться в репозитории или попадать в коммиты.
