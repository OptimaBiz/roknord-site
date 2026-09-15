<?php
declare(strict_types=1);
// Run in a disposable PHP container; the repository is mounted read-only.
$site = sys_get_temp_dir() . '/roknord-install-' . bin2hex(random_bytes(8));
mkdir($site . '/public_html', 0700, true);
mkdir($site . '/client-portal', 0700);
foreach (['bootstrap.php', 'install.php'] as $file) copy(__DIR__ . '/../server/client-portal/' . $file, $site . '/client-portal/' . $file);
function install(string $site): int {
    passthru(escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg($site . '/client-portal/install.php') . ' ' . escapeshellarg($site . '/public_html'), $status);
    return $status;
}
function check(bool $condition, string $message): void {
    if (!$condition) throw new RuntimeException($message);
}
check(install($site) === 0, 'First install failed');
mkdir($site . '/client-portal/public', 0700);
mkdir($site . '/public_html/portal-api', 0755);
copy(__DIR__ . '/../server/client-portal/public/portal.php', $site . '/client-portal/public/portal.php');
copy(__DIR__ . '/../server/client-portal/timeweb-entry.php', $site . '/public_html/portal-api/portal.php');
$request = '$_SERVER["HTTPS"]="off"; $_SERVER["HTTP_X_FORWARDED_PROTO"]="https"; $_SERVER["REQUEST_METHOD"]="GET"; $_SERVER["DOCUMENT_ROOT"]=$argv[1]; $_GET["action"]="session"; require $argv[1]."/portal-api/portal.php";';
$session = shell_exec(escapeshellarg(PHP_BINARY) . ' -r ' . escapeshellarg($request) . ' ' . escapeshellarg($site . '/public_html'));
$payload = json_decode($session ?? '', true, 512, JSON_THROW_ON_ERROR);
check($payload['user'] === null && preg_match('/^[a-f0-9]{64}$/', $payload['csrf']) === 1, 'Published entrypoint must load private API and schema');
$db = new PDO('sqlite:' . $site . '/client-portal-private/portal.sqlite');
check((int)$db->query('SELECT COUNT(*) FROM users')->fetchColumn() === 0, 'Installation must not seed accounts');
$db->exec("INSERT INTO users(id,email,name,company,password) VALUES('fixture','fixture@example.test','Fixture','Fixture','not-a-real-password-hash')");
file_put_contents($site . '/client-portal-private/files/preserve.txt', 'Private fixture');
check(install($site) === 0, 'Repeated install failed');
check((int)$db->query('SELECT COUNT(*) FROM users')->fetchColumn() === 1, 'Existing user lost');
check(file_get_contents($site . '/client-portal-private/files/preserve.txt') === 'Private fixture', 'Existing document changed');
check((fileperms($site . '/client-portal-private/portal.sqlite') & 0777) === 0600, 'Database permissions');
check((fileperms($site . '/client-portal-private') & 0777) === 0700, 'Directory permissions');
putenv('ROKNORD_PORTAL_DATA=' . $site . '/public_html/leak');
check(install($site) !== 0, 'Public storage must be rejected');
check(!file_exists($site . '/public_html/leak'), 'Public storage created');
putenv('ROKNORD_PORTAL_DATA');
symlink($site . '/public_html', $site . '/linked-data');
putenv('ROKNORD_PORTAL_DATA=' . $site . '/linked-data');
check(install($site) !== 0, 'Symlinked storage must be rejected');
echo "PASS installer: empty schema, repeatability, data preservation, permissions, public/symlink rejection\n";
