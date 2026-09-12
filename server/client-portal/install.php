<?php
declare(strict_types=1);

// CLI only. No accounts, passwords or sample documents are created by deployment.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
umask(0077);
try {
    if (PHP_VERSION_ID < 80300) throw new RuntimeException('PHP 8.3 or newer is required');
    foreach (['pdo_sqlite', 'mbstring', 'fileinfo', 'session'] as $extension) {
        if (!extension_loaded($extension)) throw new RuntimeException('Missing PHP extension: ' . $extension);
    }
    $site = realpath(dirname(__DIR__));
    $public = realpath($argv[1] ?? '');
    if (!$site || !$public || $public !== $site . '/public_html') {
        throw new RuntimeException('Expected sibling client-portal and public_html directories');
    }
    $data = getenv('ROKNORD_PORTAL_DATA') ?: $site . '/client-portal-private';
    if (!str_starts_with($data, '/') || preg_match('~(?:^|/)\.\.(?:/|$)~', $data)) {
        throw new RuntimeException('Private data must use an absolute path without traversal');
    }
    // Reject symlinked installation targets; never redirect private data into public_html.
    foreach ([__DIR__, $public . '/portal-api', $data, $data . '/files', $data . '/sessions', $data . '/portal.sqlite'] as $path) {
        if (is_link($path)) throw new RuntimeException('Symlinked installation target is not supported');
    }
    $resolvedData = realpath($data);
    $resolvedParent = realpath(dirname($data));
    if (!$resolvedParent) throw new RuntimeException('Private data parent directory does not exist');
    $resolvedData = $resolvedData ?: $resolvedParent . '/' . basename($data);
    if ($resolvedData === $public || str_starts_with($resolvedData, $public . '/')) {
        throw new RuntimeException('Private data must stay outside public_html');
    }
    require __DIR__ . '/bootstrap.php';
    $db = portal_db();
    portal_schema($db);
    foreach ([$data, $data . '/files', $data . '/sessions'] as $directory) {
        if (!is_dir($directory) && !mkdir($directory, 0700)) throw new RuntimeException('Cannot create private directory');
        if (!is_writable($directory) || !chmod($directory, 0700)) throw new RuntimeException('Private directory is not writable');
    }
    if (!chmod($data . '/portal.sqlite', 0600)) throw new RuntimeException('Cannot protect database permissions');
    echo "Portal schema ready; existing accounts and documents preserved.\n";
} catch (Throwable $error) {
    fwrite(STDERR, 'Portal installation failed: ' . $error->getMessage() . "\n");
    exit(1);
}
