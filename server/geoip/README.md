# Определение страны для языка главной

`public/language-country.php` сопоставляет IP посетителя с локальным списком российских диапазонов и возвращает
только `RU` или `OTHER`. IP не передаётся внешнему сервису и не сохраняется этим обработчиком.

Источник диапазонов — [DB-IP Country Lite](https://db-ip.com/db/lite.php), лицензия CC BY 4.0. Требуемая атрибуция
выведена в общем footer сайта.

Обновление базы (подставить актуальные год и месяц):

```sh
curl -fL https://download.db-ip.com/free/dbip-country-lite-YYYY-MM.csv.gz -o /tmp/dbip-country-lite.csv.gz
node scripts/build-ru-geo-ranges.mjs /tmp/dbip-country-lite.csv.gz server/geoip/ru-ranges.json YYYY-MM
```

Базу следует обновлять ежемесячно перед плановой публикацией.
