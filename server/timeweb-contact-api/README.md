# Roknord contact API for Timeweb

Небольшой PHP-обработчик формы сайта. Он отправляет обращения через SMTP Timeweb и не хранит содержимое заявок в базе данных.

## Требования

- PHP 8.1 или новее с расширениями `mbstring`, `openssl` и `json`;
- Composer;
- почтовый ящик `forms@roknord.ru` в Timeweb;
- HTTPS-поддомен `api.roknord.ru`.

## Подготовка

1. В каталоге обработчика выполните `composer install --no-dev --optimize-autoloader`.
2. Скопируйте `config.example.php` в `config.php`.
3. Укажите SMTP-пароль ящика `forms@roknord.ru` только в `config.php` на сервере.
4. Если корневой каталог поддомена можно изменить, назначьте папку `public` корнем сайта.
5. На обычном виртуальном хостинге Timeweb можно разместить `contact.php`, `.htaccess`, `composer.json`, `config.php` и каталог `vendor` непосредственно в каталоге сайта. Встроенный `.htaccess` закроет конфигурацию и зависимости от HTTP-доступа.

Обработчик поддерживает обе структуры: с отдельной публичной директорией и с плоским каталогом виртуального хостинга.

## Проверка

После выпуска SSL-сертификата проверьте preflight-запрос:

```sh
curl -i -X OPTIONS https://api.roknord.ru/contact.php \
  -H 'Origin: https://roknord.ru' \
  -H 'Access-Control-Request-Method: POST'
```

Затем отправьте одну тестовую заявку с сайта. Не проверяйте обработчик реальными персональными данными.

Для локальной проверки фронтенда можно задать `PUBLIC_CONTACT_ENDPOINT` в незакоммиченном `.env`.
