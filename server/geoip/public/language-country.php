<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: private, max-age=86400');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    http_response_code(405);
    header('Allow: GET');
    echo json_encode(['country' => null, 'error' => 'method_not_allowed']);
    exit;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$packed = filter_var($ip, FILTER_VALIDATE_IP) ? inet_pton($ip) : false;
if ($packed === false) {
    http_response_code(503);
    echo json_encode(['country' => null, 'error' => 'address_unavailable']);
    exit;
}

$databasePath = getenv('ROKNORD_GEOIP_DATABASE') ?: dirname(__DIR__) . '/geoip/ru-ranges.json';
$raw = @file_get_contents($databasePath);
$database = is_string($raw) ? json_decode($raw, true) : null;
if (!is_array($database)) {
    http_response_code(503);
    echo json_encode(['country' => null, 'error' => 'database_unavailable']);
    exit;
}

$hex = bin2hex($packed);
$ranges = strlen($packed) === 4 ? ($database['ipv4'] ?? []) : ($database['ipv6'] ?? []);
$low = 0;
$high = count($ranges) - 1;
$candidate = null;

while ($low <= $high) {
    $middle = intdiv($low + $high, 2);
    $range = $ranges[$middle] ?? null;
    if (!is_array($range) || count($range) !== 2) break;
    if (strcmp($range[0], $hex) <= 0) {
        $candidate = $range;
        $low = $middle + 1;
    } else {
        $high = $middle - 1;
    }
}

$isRussia = is_array($candidate) && strcmp($hex, $candidate[1]) <= 0;
echo json_encode([
    'country' => $isRussia ? 'RU' : 'OTHER',
    'databaseRelease' => $database['release'] ?? null,
], JSON_UNESCAPED_SLASHES);
