<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/bootstrap.php';
$db = portal_db(); portal_schema($db);
$command = $argv[1] ?? 'help';
$email = strtolower($argv[2] ?? '');
function account(PDO $db, string $email): array {
    $u = query($db, 'SELECT * FROM users WHERE email=?', [$email])->fetch();
    if (!$u) throw new RuntimeException('Account not found'); return $u;
}
function add_document(PDO $db, string $uid, string $file, string $title, string $category): void {
    if (!is_file($file) || filesize($file) > 10*1024*1024) throw new RuntimeException('File missing or too large');
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file);
    if (!in_array($mime,['application/pdf','text/plain'],true)) throw new RuntimeException('Use PDF or TXT');
    $id = bin2hex(random_bytes(16)); $storage = $id . '.bin';
    copy($file,portal_file_dir().$storage); chmod(portal_file_dir().$storage,0600);
    query($db,'INSERT INTO documents VALUES(?,?,?,?,?,?,?,?,?)',[$id,$uid,$title,$category,basename($file),$storage,$mime,filesize($file),gmdate('c')]);
}
try {
    if ($command === 'demo') {
        if (getenv('ROKNORD_PORTAL_ENV') !== 'development') throw new RuntimeException('Demo is local development only');
        $email = 'demo@roknord.example';
        if (query($db,'SELECT id FROM users WHERE email=?',[$email])->fetch()) throw new RuntimeException('Demo already exists; existing data preserved');
        $uid = bin2hex(random_bytes(16));
        query($db,'INSERT INTO users(id,email,name,company,password,demo) VALUES(?,?,?,?,?,1)',[$uid,$email,'Демо-клиент','Учебная лаборатория',password_hash('Roknord-Demo-2026!',PASSWORD_DEFAULT)]);
        query($db,'INSERT INTO projects VALUES(?,?,?,?,?,?)',[$uid,'Аудит готовности лаборатории','Сбор материалов','Передайте перечень методов и согласуйте выборку записей.','Координатор Рокнорд','Согласуем после получения материалов']);
        foreach (['Передать актуальную область аккредитации','Согласовать выборку протоколов','Проверить состав работ в проекте договора'] as $title) query($db,'INSERT INTO tasks(id,user_id,title) VALUES(?,?,?)',[bin2hex(random_bytes(16)),$uid,$title]);
        query($db,'INSERT INTO messages(user_id,author,body,created) VALUES(?,?,?,?)',[$uid,'team','Добро пожаловать в демонстрационный проект. Здесь можно скачать образцы, отметить задачи и проверить переписку. Данные вымышлены.',gmdate('c')]);
        foreach ([['demo-contract.txt','Образец структуры договора','Договор'],['demo-risk-map.txt','Учебная карта рисков','Результаты аудита'],['demo-checklist.txt','Перечень входных материалов','Рабочие документы']] as [$file,$title,$category]) add_document($db,$uid,__DIR__.'/samples/'.$file,$title,$category);
        echo "Demo created: demo@roknord.example / Roknord-Demo-2026!\n";
    } elseif ($command === 'create') {
        if (!filter_var($email,FILTER_VALIDATE_EMAIL)) throw new RuntimeException('Valid email required');
        $password = getenv('ROKNORD_INITIAL_PASSWORD') ?: '';
        if (mb_strlen($password)<12 || strlen($password)>72) throw new RuntimeException('Set ROKNORD_INITIAL_PASSWORD (12 characters, max 72 bytes)');
        query($db,'INSERT INTO users(id,email,name,company,password) VALUES(?,?,?,?,?)',[bin2hex(random_bytes(16)),$email,$argv[3]??'Клиент',$argv[4]??'',password_hash($password,PASSWORD_DEFAULT)]);
        echo "Account created. Deliver credentials privately.\n";
    } elseif ($command === 'project') {
        $u=account($db,$email); $data=json_decode(file_get_contents($argv[3]??''),true,512,JSON_THROW_ON_ERROR);
        foreach(['title','stage','next_step','manager','due'] as $key) if(!isset($data[$key])||!is_string($data[$key])) throw new RuntimeException('Missing project field: '.$key);
        query($db,'INSERT INTO projects VALUES(?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET title=excluded.title,stage=excluded.stage,next_step=excluded.next_step,manager=excluded.manager,due=excluded.due',[$u['id'],$data['title'],$data['stage'],$data['next_step'],$data['manager'],$data['due']]);
    } elseif ($command === 'document') {
        $u=account($db,$email); add_document($db,$u['id'],$argv[3]??'',$argv[4]??'Документ',$argv[5]??'Рабочие документы');
    } elseif ($command === 'task') {
        $u=account($db,$email); query($db,'INSERT INTO tasks(id,user_id,title,due) VALUES(?,?,?,?)',[bin2hex(random_bytes(16)),$u['id'],$argv[3]??'Задача',$argv[4]??'']);
    } elseif ($command === 'reply') {
        $u=account($db,$email); query($db,'INSERT INTO messages(user_id,author,body,created) VALUES(?,?,?,?)',[$u['id'],'team',$argv[3]??'',gmdate('c')]);
    } elseif ($command === 'messages') {
        $u=account($db,$email); echo json_encode(query($db,'SELECT author,body,created FROM messages WHERE user_id=? ORDER BY id',[$u['id']])->fetchAll(),JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE)."\n";
    } elseif ($command === 'documents') {
        $u=account($db,$email); echo json_encode(query($db,'SELECT id,title,category,filename,size,created FROM documents WHERE user_id=? ORDER BY created DESC',[$u['id']])->fetchAll(),JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE)."\n";
    } elseif ($command === 'export') {
        $u=account($db,$email);$document=query($db,'SELECT * FROM documents WHERE user_id=? AND id=?',[$u['id'],$argv[3]??''])->fetch();
        $destination=$argv[4]??'';
        if(!$document||!str_starts_with($destination,'/')||file_exists($destination))throw new RuntimeException('Provide document ID and a new absolute destination path');
        $output=fopen($destination,'x');
        if(!$output)throw new RuntimeException('Cannot create destination');
        chmod($destination,0600);$source=fopen(portal_file_dir().basename($document['storage']),'rb');
        if(!$source)throw new RuntimeException('Source file unavailable');
        stream_copy_to_stream($source,$output);fclose($source);fclose($output);
    } elseif ($command === 'reset-password') {
        $u=account($db,$email);$password=getenv('ROKNORD_INITIAL_PASSWORD')?:'';
        if(mb_strlen($password)<12||strlen($password)>72)throw new RuntimeException('Set a strong ROKNORD_INITIAL_PASSWORD');
        query($db,'UPDATE users SET password=?,version=version+1 WHERE id=?',[password_hash($password,PASSWORD_DEFAULT),$u['id']]);
    } else echo "Commands: demo | create EMAIL NAME COMPANY | project EMAIL JSON | document EMAIL FILE TITLE CATEGORY | task EMAIL TITLE DUE | messages EMAIL | reply EMAIL TEXT | reset-password EMAIL\n";
} catch(Throwable $e) { fwrite(STDERR,$e->getMessage()."\n"); exit(1); }
