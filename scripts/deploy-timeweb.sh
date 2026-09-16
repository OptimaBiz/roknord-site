#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

TIMEWEB_SSH_HOST="${TIMEWEB_SSH_HOST:-vh348.timeweb.ru}"
TIMEWEB_SSH_PORT="${TIMEWEB_SSH_PORT:-22}"
TIMEWEB_SSH_USER="${TIMEWEB_SSH_USER:-slimmboy}"
TIMEWEB_SITE_PATH="${TIMEWEB_SITE_PATH:-roknord/public_html}"
TIMEWEB_PHP_BIN="${TIMEWEB_PHP_BIN:-/opt/php83/bin/php}"
TIMEWEB_PUBLIC_ORIGIN="${TIMEWEB_PUBLIC_ORIGIN:-https://roknord.ru}"

safe_value() {
  [[ "$2" =~ ^[A-Za-z0-9._/@:-]+$ && "$2" != -* ]] || { echo "Некорректное значение $1." >&2; exit 1; }
}
safe_value TIMEWEB_SSH_HOST "$TIMEWEB_SSH_HOST"
safe_value TIMEWEB_SSH_USER "$TIMEWEB_SSH_USER"
safe_value TIMEWEB_PHP_BIN "$TIMEWEB_PHP_BIN"
safe_value TIMEWEB_SITE_PATH "$TIMEWEB_SITE_PATH"
[[ "$TIMEWEB_SSH_PORT" =~ ^[0-9]+$ ]] || { echo "Некорректный SSH-порт." >&2; exit 1; }
[[ "$TIMEWEB_SITE_PATH" == */public_html && "$TIMEWEB_SITE_PATH" != *..* && "$TIMEWEB_SITE_PATH" != /public_html ]] || {
  echo "TIMEWEB_SITE_PATH должен указывать на каталог вида roknord/public_html без '..'." >&2; exit 1;
}
if [[ "${TIMEWEB_DEPLOY_TRANSPORT:-ssh}" != ssh ]]; then
  echo "Полная публикация кабинета требует SSH: FTP не может проверить PHP и инициализировать приватную базу. Используйте TIMEWEB_DEPLOY_TRANSPORT=ssh." >&2
  exit 1
fi
command -v rsync >/dev/null || { echo "Для публикации требуется rsync." >&2; exit 1; }
SITE_ROOT="${TIMEWEB_SITE_PATH%/public_html}"
TARGET="$TIMEWEB_SSH_USER@$TIMEWEB_SSH_HOST"
SSH_ARGS=(-4 -p "$TIMEWEB_SSH_PORT" -o BatchMode=yes -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15)
if [[ -n "${TIMEWEB_SSH_KEY:-}" ]]; then
  [[ -f "$TIMEWEB_SSH_KEY" ]] || { echo "SSH-ключ не найден." >&2; exit 1; }
  SSH_ARGS+=(-o IdentitiesOnly=yes -i "$TIMEWEB_SSH_KEY")
fi
# rsync uses its own argument parser, not shell backslash escaping.
SSH_COMMAND=ssh
for argument in "${SSH_ARGS[@]}"; do
  argument="${argument//\"/\"\"}"
  SSH_COMMAND+=" \"$argument\""
done

echo "Проверяю SSH, PHP и каталоги Timeweb до изменения сайта..."
ssh "${SSH_ARGS[@]}" "$TARGET" bash -s -- "$TIMEWEB_SITE_PATH" "$TIMEWEB_PHP_BIN" <<'REMOTE'
set -euo pipefail
site_path="$1"
php_bin="$2"
site_root="${site_path%/public_html}"
[[ -d "$site_path" && -w "$site_path" && -w "$site_root" ]] || { echo "Каталог сайта отсутствует или недоступен для записи." >&2; exit 1; }
for destination in "$site_path" "$site_root/client-portal" "$site_root/client-portal/public" "$site_root/client-portal-private" "$site_path/portal-api"; do
  [[ ! -L "$destination" ]] || { echo "Каталог публикации не должен быть символической ссылкой." >&2; exit 1; }
done
"$php_bin" -r 'if (PHP_VERSION_ID < 80300) { fwrite(STDERR, "Required: PHP 8.3+; select TIMEWEB_PHP_BIN and website PHP version.\n"); exit(1); } foreach (["pdo_sqlite", "mbstring", "fileinfo", "session"] as $ext) { if (!extension_loaded($ext)) { fwrite(STDERR, "Missing PHP extension: ".$ext."\n"); exit(1); } }'
REMOTE

npm run build

echo "Устанавливаю PHP-кабинет вне public_html; клиентские данные не копируются..."
ssh "${SSH_ARGS[@]}" "$TARGET" "umask 077; mkdir -p '$SITE_ROOT/client-portal/public'"
rsync -az --timeout=30 --delay-updates --chmod=Fu=rw,Fgo= \
  -e "$SSH_COMMAND" \
  server/client-portal/bootstrap.php server/client-portal/manage.php server/client-portal/install.php \
  "$TARGET:$SITE_ROOT/client-portal/"
rsync -az --timeout=30 --delay-updates --chmod=Fu=rw,Fgo= \
  -e "$SSH_COMMAND" server/client-portal/public/portal.php "$TARGET:$SITE_ROOT/client-portal/public/"
ssh "${SSH_ARGS[@]}" "$TARGET" "'$TIMEWEB_PHP_BIN' '$SITE_ROOT/client-portal/install.php' '$TIMEWEB_SITE_PATH'"

echo "Публикую точку входа API..."
ssh "${SSH_ARGS[@]}" "$TARGET" "mkdir -p '$TIMEWEB_SITE_PATH/portal-api'"
rsync -az --timeout=30 --delay-updates --chmod=Fu=rw,Fgo=r -e "$SSH_COMMAND" \
  server/client-portal/public/.htaccess server/client-portal/public/.user.ini "$TARGET:$TIMEWEB_SITE_PATH/portal-api/"
rsync -az --timeout=30 --delay-updates --chmod=Fu=rw,Fgo=r -e "$SSH_COMMAND" \
  server/client-portal/timeweb-entry.php "$TARGET:$TIMEWEB_SITE_PATH/portal-api/portal.php"

# A PHP CLI check cannot detect a different PHP version or HTTPS setup in the web server.
node scripts/check-portal.mjs "$TIMEWEB_PUBLIC_ORIGIN"

echo "Загружаю dist/ на Timeweb..."
rsync -az --timeout=30 --delay-updates \
  --exclude='*.mp4' --exclude='*.webm' --exclude='/portal-api/' \
  -e "$SSH_COMMAND" ./dist/ "$TARGET:$TIMEWEB_SITE_PATH/"
node scripts/check-portal.mjs "$TIMEWEB_PUBLIC_ORIGIN"
echo "Деплой сайта и PHP-кабинета завершён. Индивидуальные аккаунты создаются отдельно; демо-вход не включён."
