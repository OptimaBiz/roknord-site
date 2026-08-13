<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

const CONSENT_VERSION = '1.1-2026-08-13';

$baseDir = is_file(__DIR__ . '/config.php') ? __DIR__ : dirname(__DIR__);
$composerAutoload = $baseDir . '/vendor/autoload.php';
if (is_file($composerAutoload)) {
    require $composerAutoload;
} else {
    require $baseDir . '/Exception.php';
    require $baseDir . '/PHPMailer.php';
    require $baseDir . '/SMTP.php';
}

$configPath = $baseDir . '/config.php';
if (!is_file($configPath)) {
    respond(503, ['ok' => false, 'message' => 'Сервис отправки временно недоступен.']);
}

/** @var array<string, mixed> $config */
$config = require $configPath;
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = $config['allowed_origins'] ?? [];

if (!is_string($origin) || !in_array($origin, $allowedOrigins, true)) {
    respond(403, ['ok' => false, 'message' => 'Источник запроса не разрешён.']);
}

header('Access-Control-Allow-Origin: ' . $origin);
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Accept, Content-Type');
header('Access-Control-Max-Age: 600');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST, OPTIONS');
    respond(405, ['ok' => false, 'message' => 'Метод не поддерживается.']);
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 65536) {
    respond(413, ['ok' => false, 'message' => 'Размер обращения превышает допустимый.']);
}

if (trim((string) ($_POST['_gotcha'] ?? '')) !== '') {
    respond(200, ['ok' => true]);
}

enforceRateLimit(
    (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'),
    (int) ($config['rate_limit']['max_requests'] ?? 5),
    (int) ($config['rate_limit']['window_seconds'] ?? 600),
);

$formName = cleanText($_POST['form_name'] ?? '', 80);
$subjects = [
    'Контактная форма' => 'Заявка с сайта Рокнорд',
    'Получить PDF' => 'Запрос PDF: карта рисков перед ПК ОС СМ',
];

if (!isset($subjects[$formName])) {
    respond(422, ['ok' => false, 'message' => 'Неизвестный тип формы.']);
}

if (($_POST['personal_data_consent'] ?? '') !== 'accepted') {
    respond(422, ['ok' => false, 'message' => 'Необходимо выразить согласие на обработку персональных данных.']);
}

$consentVersion = cleanText($_POST['consent_version'] ?? '', 40);
if ($consentVersion !== CONSENT_VERSION) {
    respond(422, ['ok' => false, 'message' => 'Обновите страницу и подтвердите актуальную редакцию согласия.']);
}

$consentTimestamp = cleanText($_POST['consent_timestamp'] ?? '', 40);
$consentPage = trim((string) ($_POST['consent_page'] ?? ''));
$consentPageParts = filter_var($consentPage, FILTER_VALIDATE_URL) !== false ? parse_url($consentPage) : false;
$consentPageHost = is_array($consentPageParts) ? strtolower((string) ($consentPageParts['host'] ?? '')) : '';
if (!in_array($consentPageHost, ['roknord.ru', 'www.roknord.ru'], true)) {
    respond(422, ['ok' => false, 'message' => 'Не удалось подтвердить страницу отправки формы.']);
}
$consentPage = mb_substr($consentPage, 0, 2048);

$receivedAt = gmdate(DATE_ATOM);
$clientAddress = cleanText($_SERVER['REMOTE_ADDR'] ?? 'unknown', 64);
$userAgent = cleanText($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 500);
$requestId = bin2hex(random_bytes(8));

$name = cleanText($_POST['name'] ?? '', 80);
$email = trim((string) ($_POST['email'] ?? ''));
$phone = cleanText($_POST['phone'] ?? '', 24);
$message = cleanMultiline($_POST['message'] ?? '', 1200);

if (mb_strlen($name) < 2) {
    respond(422, ['ok' => false, 'message' => 'Укажите имя.']);
}

if (mb_strlen($email) > 254 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    respond(422, ['ok' => false, 'message' => 'Укажите корректный адрес электронной почты.']);
}

if ($formName === 'Контактная форма') {
    if (!preg_match('/^[+0-9()\s-]{6,24}$/u', $phone)) {
        respond(422, ['ok' => false, 'message' => 'Укажите корректный номер телефона.']);
    }
    if (mb_strlen($message) < 10) {
        respond(422, ['ok' => false, 'message' => 'Опишите задачу подробнее.']);
    }
}

$mailConfig = $config['mail'] ?? [];
$smtpConfig = $config['smtp'] ?? [];
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = (string) ($smtpConfig['host'] ?? 'smtp.timeweb.ru');
    $mail->SMTPAuth = true;
    $mail->Username = (string) ($smtpConfig['username'] ?? '');
    $mail->Password = (string) ($smtpConfig['password'] ?? '');
    $mail->Port = (int) ($smtpConfig['port'] ?? 465);
    $mail->SMTPSecure = ($smtpConfig['encryption'] ?? 'smtps') === 'tls'
        ? PHPMailer::ENCRYPTION_STARTTLS
        : PHPMailer::ENCRYPTION_SMTPS;
    $mail->SMTPDebug = SMTP::DEBUG_OFF;
    $mail->Timeout = 12;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;

    $mail->setFrom((string) $mailConfig['from_address'], (string) $mailConfig['from_name']);
    $mail->addAddress((string) $mailConfig['to_address'], (string) $mailConfig['to_name']);
    $mail->addReplyTo($email, $name);
    $mail->Subject = $subjects[$formName];
    $mail->isHTML(true);
    $mail->Body = buildHtmlBody(
        $formName,
        $name,
        $email,
        $phone,
        $message,
        $consentVersion,
        $consentTimestamp,
        $consentPage,
        $receivedAt,
        $clientAddress,
        $userAgent,
        $requestId,
    );
    $mail->AltBody = buildTextBody(
        $formName,
        $name,
        $email,
        $phone,
        $message,
        $consentVersion,
        $consentTimestamp,
        $consentPage,
        $receivedAt,
        $clientAddress,
        $userAgent,
        $requestId,
    );
    $mail->send();
} catch (Throwable $exception) {
    error_log('Roknord contact mail delivery failed');
    respond(502, ['ok' => false, 'message' => 'Не удалось отправить обращение. Попробуйте ещё раз позже.']);
}

respond(200, ['ok' => true]);

/** @param array<string, mixed> $payload */
function respond(int $status, array $payload): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function cleanText(mixed $value, int $maxLength): string
{
    $text = preg_replace('/\s+/u', ' ', trim((string) $value)) ?? '';
    return mb_substr($text, 0, $maxLength);
}

function cleanMultiline(mixed $value, int $maxLength): string
{
    $text = str_replace(["\r\n", "\r"], "\n", trim((string) $value));
    $text = preg_replace('/[ \t]+/u', ' ', $text) ?? '';
    return mb_substr($text, 0, $maxLength);
}

function escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function buildHtmlBody(
    string $formName,
    string $name,
    string $email,
    string $phone,
    string $message,
    string $consentVersion,
    string $consentTimestamp,
    string $consentPage,
    string $receivedAt,
    string $clientAddress,
    string $userAgent,
    string $requestId,
): string
{
    $rows = [
        'Форма' => $formName,
        'Имя' => $name,
        'E-mail' => $email,
    ];
    if ($phone !== '') $rows['Телефон'] = $phone;
    if ($message !== '') $rows['Сообщение'] = nl2br(escape($message));
    $rows['Согласие'] = 'выражено';
    $rows['Версия согласия'] = $consentVersion;
    $rows['Время на устройстве пользователя'] = $consentTimestamp !== '' ? $consentTimestamp : 'не передано';
    $rows['Время получения сервером'] = $receivedAt;
    $rows['Страница отправки'] = $consentPage;
    $rows['IP-адрес'] = $clientAddress;
    $rows['User-Agent'] = $userAgent;
    $rows['Идентификатор обращения'] = $requestId;

    $html = '<h2>Новое обращение с сайта roknord.ru</h2><table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse">';
    foreach ($rows as $label => $value) {
        $safeValue = $label === 'Сообщение' ? $value : escape($value);
        $html .= '<tr><th align="left">' . escape($label) . '</th><td>' . $safeValue . '</td></tr>';
    }
    return $html . '</table>';
}

function buildTextBody(
    string $formName,
    string $name,
    string $email,
    string $phone,
    string $message,
    string $consentVersion,
    string $consentTimestamp,
    string $consentPage,
    string $receivedAt,
    string $clientAddress,
    string $userAgent,
    string $requestId,
): string
{
    $lines = ["Новое обращение с сайта roknord.ru", "Форма: $formName", "Имя: $name", "E-mail: $email"];
    if ($phone !== '') $lines[] = "Телефон: $phone";
    if ($message !== '') $lines[] = "Сообщение:\n$message";
    $lines[] = 'Согласие на обработку персональных данных: выражено.';
    $lines[] = "Версия согласия: $consentVersion";
    $lines[] = 'Время на устройстве пользователя: ' . ($consentTimestamp !== '' ? $consentTimestamp : 'не передано');
    $lines[] = "Время получения сервером: $receivedAt";
    $lines[] = "Страница отправки: $consentPage";
    $lines[] = "IP-адрес: $clientAddress";
    $lines[] = "User-Agent: $userAgent";
    $lines[] = "Идентификатор обращения: $requestId";
    return implode("\n\n", $lines);
}

function enforceRateLimit(string $clientAddress, int $maxRequests, int $windowSeconds): void
{
    $key = hash('sha256', $clientAddress);
    $path = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'roknord-contact-' . $key;
    $now = time();
    $timestamps = [];
    $handle = fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) fclose($handle);
        return;
    }

    $contents = stream_get_contents($handle);
    if (is_string($contents) && $contents !== '') {
        $decoded = json_decode($contents, true);
        if (is_array($decoded)) $timestamps = $decoded;
    }
    $timestamps = array_values(array_filter($timestamps, static fn ($timestamp): bool => is_int($timestamp) && $timestamp > $now - $windowSeconds));

    if (count($timestamps) >= $maxRequests) {
        flock($handle, LOCK_UN);
        fclose($handle);
        respond(429, ['ok' => false, 'message' => 'Слишком много запросов. Попробуйте позже.']);
    }

    $timestamps[] = $now;
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($timestamps));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}
