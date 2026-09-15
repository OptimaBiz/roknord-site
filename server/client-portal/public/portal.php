<?php
declare(strict_types=1);
require dirname(__DIR__) . '/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Robots-Tag: noindex, nofollow');
function respond(int $status, array $data): never { http_response_code($status); echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR); exit; }
function request_is_https(): bool {
    $https = strtolower(trim((string)($_SERVER['HTTPS'] ?? '')));
    if ($https !== '' && !in_array($https, ['off', '0'], true)) return true;
    if ((int)($_SERVER['SERVER_PORT'] ?? 0) === 443) return true;
    $forwarded = strtolower(trim(explode(',', (string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''))[0]));
    return $forwarded === 'https';
}

try {
    ini_set('display_errors', '0');
    $local = PHP_SAPI === 'cli-server' && getenv('ROKNORD_PORTAL_ENV') === 'development';
    if (!$local && !request_is_https()) respond(400, ['message'=>'Требуется защищённое соединение.']);
    $origin = getenv('ROKNORD_PORTAL_ORIGIN') ?: 'https://roknord.ru';
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method === 'POST' && ($_SERVER['HTTP_ORIGIN'] ?? '') !== $origin) respond(403, ['message'=>'Недопустимый источник запроса.']);
    if (!in_array($method, ['GET','POST'], true)) respond(405, ['message'=>'Метод не поддерживается.']);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    $db = portal_db();
    $sessionDir = dirname(portal_file_dir()) . '/sessions';
    if (!is_dir($sessionDir)) mkdir($sessionDir, 0700, true);
    session_save_path($sessionDir);
    session_name($local ? 'roknord_portal' : '__Host-roknord_portal');
    session_set_cookie_params(['lifetime'=>0, 'path'=>'/', 'secure'=>!$local, 'httponly'=>true, 'samesite'=>'Strict']);
    session_start();
    if (isset($_SESSION['seen']) && (time() - $_SESSION['seen'] > 1800 || time() - ($_SESSION['started'] ?? 0) > 28800)) {
        $_SESSION = []; session_regenerate_id(true);
    }
    $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
    $action = $_GET['action'] ?? 'session';
    $getActions = ['session','project','download'];
    if (($method === 'GET') !== in_array($action, $getActions, true)) respond(405, ['message'=>'Метод не поддерживается.']);
    if ($method === 'POST' && !hash_equals($_SESSION['csrf'], $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) respond(403, ['message'=>'Обновите страницу и повторите действие.']);
    $input = [];
    if ($method === 'POST' && $action !== 'upload') {
        if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) respond(413, ['message'=>'Слишком большой запрос.']);
        $input = json_decode(file_get_contents('php://input', false, null, 0, 16385), true);
        if (!is_array($input)) respond(400, ['message'=>'Некорректный запрос.']);
    }
    // Schema and accounts are created explicitly by the CLI, never through HTTP.
    $user = isset($_SESSION['uid']) ? query($db, 'SELECT * FROM users WHERE id=?', [$_SESSION['uid']])->fetch() : false;
    if ($user && (int)$user['version'] !== ($_SESSION['version'] ?? 0)) { $user = false; unset($_SESSION['uid']); }
    if ($user) $_SESSION['seen'] = time();
    if ($action === 'session') respond(200, ['csrf'=>$_SESSION['csrf'], 'user'=>$user ? ['name'=>$user['name'],'email'=>$user['email'],'company'=>$user['company'],'demo'=>(bool)$user['demo']] : null]);
    if ($action === 'login') {
        $email = strtolower(trim(is_string($input['email'] ?? null) ? $input['email'] : ''));
        $password = is_string($input['password'] ?? null) ? $input['password'] : '';
        $ip = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? '');
        $ipAllowed = portal_rate($db, 'login-ip:' . $ip, 30);
        $accountAllowed = portal_rate($db, 'login-user:' . hash('sha256', $email), 8);
        if (!$ipAllowed || !$accountAllowed) respond(429, ['message'=>'Слишком много попыток. Повторите через 15 минут.']);
        $record = strlen($email) <= 254 ? query($db, 'SELECT * FROM users WHERE email=?', [$email])->fetch() : false;
        $hash = $record['password'] ?? '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.';
        $valid = strlen($password) <= 72 && password_verify($password, $hash);
        if (!$record || !$valid || ($record['demo'] && !$local)) respond(401, ['message'=>'Проверьте адрес почты и пароль.']);
        query($db, 'DELETE FROM limits WHERE key=?', ['login-user:' . hash('sha256', $email)]);
        session_regenerate_id(true);
        $_SESSION = ['uid'=>$record['id'],'version'=>(int)$record['version'],'seen'=>time(),'started'=>time(),'csrf'=>bin2hex(random_bytes(32))];
        portal_event($db, $record['id'], 'login');
        respond(200, ['ok'=>true]);
    }
    if (!$user) respond(401, ['message'=>'Войдите в кабинет, чтобы продолжить.']);
    $uid = $user['id'];
    if ($action === 'logout') {
        portal_event($db, $uid, 'logout'); $_SESSION = []; session_destroy();
        setcookie(session_name(), '', ['expires'=>time()-3600,'path'=>'/','secure'=>!$local,'httponly'=>true,'samesite'=>'Strict']);
        respond(200, ['ok'=>true]);
    }
    if ($action === 'project') {
        respond(200, [
            'project'=>query($db, 'SELECT title,stage,next_step,manager,due FROM projects WHERE user_id=?', [$uid])->fetch() ?: null,
            'documents'=>query($db, 'SELECT id,title,category,filename,size,created FROM documents WHERE user_id=? ORDER BY created DESC', [$uid])->fetchAll(),
            'tasks'=>query($db, 'SELECT id,title,due,done FROM tasks WHERE user_id=? ORDER BY rowid', [$uid])->fetchAll(),
            'messages'=>array_reverse(query($db, 'SELECT author,body,created FROM messages WHERE user_id=? ORDER BY id DESC LIMIT 100', [$uid])->fetchAll())
        ]);
    }
    if ($action === 'download') {
        $id = is_string($_GET['id'] ?? null) ? $_GET['id'] : '';
        $doc = query($db, 'SELECT * FROM documents WHERE id=? AND user_id=?', [$id, $uid])->fetch();
        if (!$doc) respond(404, ['message'=>'Документ не найден.']);
        $file = portal_file_dir() . basename($doc['storage']);
        if (!is_file($file)) respond(404, ['message'=>'Файл недоступен. Обратитесь к координатору.']);
        portal_event($db, $uid, 'download:' . $id);
        header('Content-Type: ' . $doc['mime']);
        header("Content-Disposition: attachment; filename=\"document\"; filename*=UTF-8''" . rawurlencode($doc['filename']));
        header('Content-Length: ' . filesize($file));
        session_write_close(); readfile($file); exit;
    }
    if (!portal_rate($db, 'write:' . $uid, 60)) respond(429, ['message'=>'Слишком много действий. Повторите позже.']);
    if ($action === 'message') {
        $body = trim(is_string($input['body'] ?? null) ? $input['body'] : '');
        if ($body === '' || mb_strlen($body) > 4000) respond(422, ['message'=>'Введите сообщение длиной до 4000 символов.']);
        query($db, 'INSERT INTO messages(user_id,author,body,created) VALUES(?,?,?,?)', [$uid,'client',$body,gmdate('c')]);
        portal_event($db, $uid, 'message'); respond(200, ['ok'=>true]);
    }
    if ($action === 'task') {
        if (!is_string($input['id'] ?? null) || !is_bool($input['done'] ?? null)) respond(422, ['message'=>'Некорректная задача.']);
        $q = query($db, 'UPDATE tasks SET done=? WHERE id=? AND user_id=?', [(int)$input['done'], $input['id'], $uid]);
        if (!$q->rowCount()) respond(404, ['message'=>'Задача не найдена.']);
        portal_event($db, $uid, 'task:' . $input['id']); respond(200, ['ok'=>true]);
    }
    if ($action === 'password') {
        $current = is_string($input['current'] ?? null) ? $input['current'] : '';
        $next = is_string($input['password'] ?? null) ? $input['password'] : '';
        if (!portal_rate($db, 'password:' . $uid, 8) || strlen($current) > 72 || !password_verify($current, $user['password'])) respond(422, ['message'=>'Не удалось изменить пароль. Проверьте текущий пароль или повторите позже.']);
        if (mb_strlen($next) < 12 || strlen($next) > 72 || $next === $current) respond(422, ['message'=>'Новый пароль: от 12 символов, до 72 байт; должен отличаться от текущего.']);
        query($db, 'UPDATE users SET password=?,version=version+1 WHERE id=?', [password_hash($next,PASSWORD_DEFAULT),$uid]);
        session_regenerate_id(true); $_SESSION['version']++; $_SESSION['csrf'] = bin2hex(random_bytes(32));
        portal_event($db,$uid,'password'); respond(200,['ok'=>true,'csrf'=>$_SESSION['csrf']]);
    }
    if ($action === 'upload') {
        $file = $_FILES['file'] ?? null;
        if (!$file || $file['error'] !== UPLOAD_ERR_OK || $file['size'] > 10*1024*1024) respond(422,['message'=>'Выберите PDF до 10 МБ.']);
        if ((new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']) !== 'application/pdf') respond(422,['message'=>'Допускаются только PDF-документы.']);
        $db->exec('BEGIN IMMEDIATE');
        $total = (int)query($db,'SELECT COALESCE(SUM(size),0) FROM documents WHERE user_id=?',[$uid])->fetchColumn();
        if ($total + $file['size'] > 100*1024*1024) {
            $db->exec('ROLLBACK');
            respond(422,['message'=>'Достигнут лимит 100 МБ. Обратитесь к координатору.']);
        }
        $id = bin2hex(random_bytes(16)); $storage = $id . '.pdf';
        $name = mb_substr(preg_replace('/[\x00-\x1f\x7f]/u','',basename($file['name'])),0,120);
        try {
            if (!move_uploaded_file($file['tmp_name'],portal_file_dir().$storage)) throw new RuntimeException('Upload failed');
            chmod(portal_file_dir().$storage,0600);
            query($db,'INSERT INTO documents VALUES(?,?,?,?,?,?,?,?,?)',[$id,$uid,$name,'Материалы клиента',$name,$storage,'application/pdf',$file['size'],gmdate('c')]);
            portal_event($db,$uid,'upload:'.$id);
            $db->exec('COMMIT');
        } catch (Throwable $e) {
            $db->exec('ROLLBACK');
            if (is_file(portal_file_dir().$storage)) unlink(portal_file_dir().$storage);
            throw $e;
        }
        respond(200,['ok'=>true]);
    }
    respond(404,['message'=>'Действие не найдено.']);
} catch (Throwable $e) {
    error_log('Portal failure: ' . get_class($e));
    respond(503,['message'=>'Кабинет временно недоступен. Повторите позже или напишите на hello@roknord.ru.']);
}
