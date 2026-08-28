<?php

declare(strict_types=1);

return [
    'allowed_origins' => [
        'https://roknord.ru',
        'https://www.roknord.ru',
        'https://atlas.roknord.ru',
    ],
    'smtp' => [
        'host' => 'smtp.timeweb.ru',
        'port' => 465,
        'encryption' => 'smtps',
        'username' => 'forms@roknord.ru',
        'password' => 'REPLACE_WITH_SMTP_PASSWORD',
    ],
    'mail' => [
        'from_address' => 'forms@roknord.ru',
        'from_name' => 'Сайт Рокнорд',
        'to_address' => 'hello@roknord.ru',
        'to_name' => 'Рокнорд',
    ],
    'rate_limit' => [
        'max_requests' => 5,
        'window_seconds' => 600,
    ],
];
