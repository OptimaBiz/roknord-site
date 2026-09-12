<?php
declare(strict_types=1);

function portal_db(): PDO {
    $dir = getenv('ROKNORD_PORTAL_DATA') ?: dirname(__DIR__) . '/client-portal-private';
    if (!str_starts_with($dir, '/')) throw new RuntimeException('ROKNORD_PORTAL_DATA must be absolute');
    $public = realpath($_SERVER['DOCUMENT_ROOT'] ?? '') ?: null;
    if (PHP_SAPI !== 'cli' && $public && str_starts_with($dir . '/', $public . '/')) {
        throw new RuntimeException('Private data must be outside document root');
    }
    if (!is_dir($dir)) mkdir($dir, 0700, true);
    if (!is_dir($dir . '/files')) mkdir($dir . '/files', 0700);
    $db = new PDO('sqlite:' . $dir . '/portal.sqlite', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
    $db->exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
    return $db;
}

function portal_schema(PDO $db): void {
    $db->exec('CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, company TEXT NOT NULL, password TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, demo INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS projects (user_id TEXT PRIMARY KEY REFERENCES users(id), title TEXT NOT NULL, stage TEXT NOT NULL, next_step TEXT NOT NULL, manager TEXT NOT NULL, due TEXT NOT NULL DEFAULT "");
    CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), title TEXT NOT NULL, category TEXT NOT NULL, filename TEXT NOT NULL, storage TEXT NOT NULL UNIQUE, mime TEXT NOT NULL, size INTEGER NOT NULL, created TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), title TEXT NOT NULL, due TEXT NOT NULL DEFAULT "", done INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL REFERENCES users(id), author TEXT NOT NULL, body TEXT NOT NULL, created TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS limits (key TEXT PRIMARY KEY, started INTEGER NOT NULL, attempts INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, action TEXT NOT NULL, created TEXT NOT NULL);');
}

function query(PDO $db, string $sql, array $args = []): PDOStatement {
    $q = $db->prepare($sql); $q->execute($args); return $q;
}

function portal_event(PDO $db, string $user, string $action): void {
    query($db, 'INSERT INTO events(user_id,action,created) VALUES(?,?,?)', [$user, $action, gmdate('c')]);
}

function portal_rate(PDO $db, string $key, int $max, int $seconds = 900): bool {
    $db->exec('BEGIN IMMEDIATE');
    try {
        query($db, 'DELETE FROM limits WHERE started < ?', [time() - $seconds]);
        query($db, 'INSERT INTO limits(key,started,attempts) VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET attempts=attempts+1', [$key, time()]);
        $n = query($db, 'SELECT attempts FROM limits WHERE key=?', [$key])->fetchColumn();
        $db->exec('COMMIT');
        return (int)$n <= $max;
    } catch (Throwable $e) { $db->exec('ROLLBACK'); throw $e; }
}

function portal_file_dir(): string {
    return (getenv('ROKNORD_PORTAL_DATA') ?: dirname(__DIR__) . '/client-portal-private') . '/files/';
}
