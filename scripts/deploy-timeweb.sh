#!/usr/bin/env bash

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

TIMEWEB_SSH_HOST="${TIMEWEB_SSH_HOST:-vh348.timeweb.ru}"
TIMEWEB_SSH_PORT="${TIMEWEB_SSH_PORT:-22}"
TIMEWEB_SSH_USER="${TIMEWEB_SSH_USER:-slimmboy}"
TIMEWEB_SITE_PATH="${TIMEWEB_SITE_PATH:-roknord/public_html}"
TIMEWEB_DEPLOY_TRANSPORT="${TIMEWEB_DEPLOY_TRANSPORT:-ssh}"

validate_safe_value() {
  local name="$1"
  local value="$2"

  if [[ ! "$value" =~ ^[A-Za-z0-9._/@:-]+$ ]]; then
    echo "Некорректное значение $name." >&2
    exit 1
  fi
}

validate_safe_value "TIMEWEB_SSH_HOST" "$TIMEWEB_SSH_HOST"
validate_safe_value "TIMEWEB_SSH_PORT" "$TIMEWEB_SSH_PORT"
validate_safe_value "TIMEWEB_SITE_PATH" "$TIMEWEB_SITE_PATH"

if [[ "$TIMEWEB_DEPLOY_TRANSPORT" != "ssh" && "$TIMEWEB_DEPLOY_TRANSPORT" != "ftp" ]]; then
  echo "TIMEWEB_DEPLOY_TRANSPORT должен быть ssh или ftp." >&2
  exit 1
fi

echo "Собираю production-версию сайта..."
npm run build

if [[ "$TIMEWEB_DEPLOY_TRANSPORT" == "ssh" ]]; then
  validate_safe_value "TIMEWEB_SSH_USER" "$TIMEWEB_SSH_USER"

  if ! command -v rsync >/dev/null 2>&1; then
    echo "Для SSH-деплоя требуется rsync." >&2
    exit 1
  fi

  SSH_COMMAND="ssh -4 -p $TIMEWEB_SSH_PORT -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15"
  if [[ -n "${TIMEWEB_SSH_KEY:-}" ]]; then
    SSH_COMMAND="$SSH_COMMAND -i $TIMEWEB_SSH_KEY"
  fi

  echo "Загружаю dist/ на Timeweb по SSH..."
  rsync -az --timeout=30 --delay-updates \
    --exclude='*.mp4' \
    --exclude='*.webm' \
    -e "$SSH_COMMAND" \
    ./dist/ "$TIMEWEB_SSH_USER@$TIMEWEB_SSH_HOST:$TIMEWEB_SITE_PATH/"

  echo "Деплой на Timeweb завершён."
  exit 0
fi

if [[ -n "${TIMEWEB_FTP_USER:-}" && -n "${TIMEWEB_FTP_PASSWORD:-}" ]]; then
  if ! command -v lftp >/dev/null 2>&1; then
    echo "Для FTP-деплоя установи lftp: brew install lftp" >&2
    exit 1
  fi

  TIMEWEB_FTP_HOST="${TIMEWEB_FTP_HOST:-$TIMEWEB_SSH_HOST}"
  TIMEWEB_FTP_PATH="${TIMEWEB_FTP_PATH:-public_html}"
  validate_safe_value "TIMEWEB_FTP_HOST" "$TIMEWEB_FTP_HOST"
  validate_safe_value "TIMEWEB_FTP_PATH" "$TIMEWEB_FTP_PATH"

  echo "Загружаю dist/ на Timeweb по FTP..."
  lftp -u "$TIMEWEB_FTP_USER","$TIMEWEB_FTP_PASSWORD" "$TIMEWEB_FTP_HOST" -e "
    set ftp:ssl-allow false;
    set net:timeout 20;
    set net:max-retries 3;
    mirror --reverse --parallel=1 --exclude-glob '*.mp4' --exclude-glob '*.webm' ./dist/ ./$TIMEWEB_FTP_PATH/;
    bye
  "

  echo "Деплой на Timeweb завершён."
  exit 0
fi

cat >&2 <<'MESSAGE'
Не настроен доступ к Timeweb.

Для SSH-деплоя добавь SSH-ключ в Timeweb.
При необходимости задай TIMEWEB_SSH_USER, TIMEWEB_SSH_KEY, TIMEWEB_SSH_HOST,
TIMEWEB_SSH_PORT и TIMEWEB_SITE_PATH.

Для FTP-деплоя задай TIMEWEB_DEPLOY_TRANSPORT=ftp,
TIMEWEB_FTP_USER и TIMEWEB_FTP_PASSWORD.
MESSAGE
exit 1
