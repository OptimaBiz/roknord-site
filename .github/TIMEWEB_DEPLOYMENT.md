# Автодеплой на Timeweb

Workflow `.github/workflows/deploy-timeweb.yml` собирает Astro-сайт и PHP-обработчик формы,
затем по SSH синхронизирует их с Timeweb при каждом push в `main`.

В GitHub Environment `production` должны быть заданы secrets:

- `TIMEWEB_SSH_HOST` — SSH-хост или IP Timeweb;
- `TIMEWEB_SSH_USER` — отдельный пользователь деплоя;
- `TIMEWEB_SSH_PRIVATE_KEY` — приватный SSH-ключ без passphrase;
- `TIMEWEB_SSH_KNOWN_HOSTS` — проверенная строка `known_hosts` сервера;
- `TIMEWEB_SITE_PATH` — абсолютный путь к корню сайта `roknord.ru`;
- `TIMEWEB_API_PATH` — абсолютный путь к корню сайта `api.roknord.ru`.

Если SSH использует не порт 22, в Environment variable `TIMEWEB_SSH_PORT` нужно указать порт.
Публичная часть ключа должна быть добавлена пользователю на Timeweb с правом записи только в эти два каталога.

Файл `config.php` обработчика формы workflow не передаёт и не удаляет: SMTP-пароль остаётся только на Timeweb.
До переключения DNS сначала следует выполнить ручной запуск workflow и проверить сайт по техническому адресу.
