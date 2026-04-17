#!/bin/bash
# ============================================
# Автоматический ежедневный бэкап Delegon
# Запускать через cron: 0 3 * * * /var/www/delegator/scripts/daily-backup.sh
# ============================================

set -e

APP_DIR="/var/www/delegator"
BACKUP_DIR="/var/backups/delegator"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H-%M-%S")
FILENAME="delegator_backup_${TIMESTAMP}.sql"
FILEPATH="${BACKUP_DIR}/${FILENAME}"
LOG_FILE="/var/log/delegator-backup.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log "=== Начало бэкапа ==="

# Создание директории
mkdir -p "$BACKUP_DIR"

# Загрузка переменных БД из .env
cd "$APP_DIR"
source <(grep -E '^DATABASE_URL=' .env | sed 's/^/export /' | sed 's/"//g')

# Парсинг DATABASE_URL
DB_USER=$(echo $DATABASE_URL | sed -n 's|postgresql://\([^:]*\):.*|\1|p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's|postgresql://[^:]*:\([^@]*\)@.*|\1|p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's|.*@\([^:]*\):.*|\1|p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's|.*:\([0-9]*\)/.*|\1|p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's|.*/\([^?]*\).*|\1|p')

log "DB: $DB_NAME, Host: $DB_HOST, Port: $DB_PORT"

# Выполнение бэкапа
if PGPASSWORD="$DB_PASS" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -F p -f "$FILEPATH" 2>>"$LOG_FILE"; then
  FILESIZE=$(stat -c%s "$FILEPATH")
  log "Бэкап создан: $FILENAME ($FILESIZE байт)"

  # Добавляем запись в БД через Prisma
  cd "$APP_DIR"
  npx tsx scripts/register-backup.ts "$FILENAME" "$FILESIZE" 2>>"$LOG_FILE"

  # Удаление старых бэкапов (оставляем последние 7)
  BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/delegator_backup_*.sql 2>/dev/null | wc -l)
  if [ "$BACKUP_COUNT" -gt 7 ]; then
    DELETE_COUNT=$((BACKUP_COUNT - 7))
    log "Удаление $DELETE_COUNT старых бэкапов..."
    ls -1t "$BACKUP_DIR"/delegator_backup_*.sql | tail -n "$DELETE_COUNT" | xargs rm -f
    log "Старые бэкапы удалены"
  fi

  log "=== Бэкап завершён успешно ==="
else
  log "=== ОШИБКА при создании бэкапа ==="
  exit 1
fi
