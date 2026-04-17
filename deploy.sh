#!/bin/bash
# ============================================
# Скрипт развёртывания Delegator на VPS
# Ubuntu 22.04/24.04
# ============================================

set -e  # Остановка при ошибке

echo "🚀 Начинаем развёртывание Delegator..."

# ============================================
# 1. Обновление системы
# ============================================
echo ""
echo "📦 Обновление системы..."
sudo apt update && sudo apt upgrade -y

# ============================================
# 2. Установка Node.js 20
# ============================================
echo ""
echo "📦 Установка Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "✅ Node.js $(node -v) установлен"
echo "✅ npm $(npm -v) установлен"

# ============================================
# 3. Установка PostgreSQL
# ============================================
echo ""
echo "📦 Установка PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql

echo "✅ PostgreSQL установлен"

# ============================================
# 4. Настройка базы данных
# ============================================
echo ""
echo "🗄️ Настройка базы данных..."

# Генерация пароля для базы данных
DB_PASSWORD=$(openssl rand -base64 16)
DB_NAME="delegator"
DB_USER="delegator_user"

# Создание пользователя и базы данных
sudo -u postgres psql <<EOF
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
EOF

echo "✅ База данных '${DB_NAME}' создана"
echo "⚠️  ЗАПИШИТЕ ДАННЫЕ ДЛЯ ПОДКЛЮЧЕНИЯ:"
echo "   Пользователь: ${DB_USER}"
echo "   Пароль: ${DB_PASSWORD}"
echo "   База: ${DB_NAME}"

# ============================================
# 5. Установка PM2
# ============================================
echo ""
echo "📦 Установка PM2..."
sudo npm install -g pm2

echo "✅ PM2 установлен"

# ============================================
# 6. Установка Nginx
# ============================================
echo ""
echo "📦 Установка Nginx..."
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

echo "✅ Nginx установлен"

# ============================================
# 7. Настройка приложения
# ============================================
echo ""
echo "📁 Настройка приложения..."

APP_DIR="/var/www/delegator"

# Создание директории
sudo mkdir -p ${APP_DIR}
sudo chown -R $USER:$USER ${APP_DIR}

# Копирование файлов проекта (если ещё не скопированы)
if [ ! -d "${APP_DIR}/src" ]; then
    echo "⚠️  Скопируйте файлы проекта в ${APP_DIR}"
    echo "   Команда для копирования с локальной машины:"
    echo "   scp -r I:/site/delegator/delegator/* user@144.31.14.195:${APP_DIR}/"
    echo ""
    echo "   Или используйте git clone, если проект в репозитории"
    exit 1
fi

cd ${APP_DIR}

# Установка зависимостей
echo "📦 Установка зависимостей npm..."
npm install --production

# ============================================
# 8. Настройка .env
# ============================================
echo ""
echo "🔧 Настройка .env..."

# Генерация секретного ключа
JWT_SECRET=$(openssl rand -base64 32)

cat > ${APP_DIR}/.env <<EOF
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public"
NEXTAUTH_SECRET="${JWT_SECRET}"
NEXTAUTH_URL=http://144.31.14.195
NODE_ENV=production
EOF

echo "✅ .env файл создан"

# ============================================
# 9. Применение миграций Prisma
# ============================================
echo ""
echo "🗄️ Применение миграций базы данных..."

cd ${APP_DIR}
npx prisma migrate deploy

echo "✅ Миграции применены"

# ============================================
# 10. Сборка приложения
# ============================================
echo ""
echo "🔨 Сборка Next.js приложения..."

cd ${APP_DIR}
npm run build

echo "✅ Приложение собрано"

# ============================================
# 11. Настройка PM2
# ============================================
echo ""
echo "⚙️ Настройка PM2..."

cd ${APP_DIR}

# Создание экосистемного файла
cat > ${APP_DIR}/ecosystem.config.js <<EOF
module.exports = {
  apps: [{
    name: 'delegator',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/pm2/delegator-error.log',
    out_file: '/var/log/pm2/delegator-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
EOF

# Создание директории для логов
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Запуск приложения
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ PM2 настроен и приложение запущено"

# ============================================
# 12. Настройка Nginx (reverse proxy)
# ============================================
echo ""
echo "⚙️ Настройка Nginx..."

sudo cat > /etc/nginx/sites-available/delegator <<EOF
server {
    listen 80;
    server_name 144.31.14.195;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Активация конфигурации
sudo ln -sf /etc/nginx/sites-available/delegator /etc/nginx/sites-enabled/delegator
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Nginx настроен"

# ============================================
# 13. Настройка firewall
# ============================================
echo ""
echo "🔒 Настройка firewall..."

sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "✅ Firewall настроен"

# ============================================
# 14. Создание администратора (опционально)
# ============================================
echo ""
echo "👤 Хотите создать пользователя-администратора?"
echo "   Запустите: cd ${APP_DIR} && npx tsx scripts/create-admin.ts"

# ============================================
# ИТОГИ
# ============================================
echo ""
echo "============================================"
echo "✅ РАЗВЁРТЫВАНИЕ ЗАВЕРШЕНО!"
echo "============================================"
echo ""
echo "🌐 Сайт доступен по адресу: http://144.31.14.195"
echo ""
echo "📊 Управление приложением:"
echo "   pm2 status              - статус приложения"
echo "   pm2 logs delegator      - логи приложения"
echo "   pm2 restart delegator   - перезапуск приложения"
echo "   pm2 stop delegator      - остановка приложения"
echo ""
echo "📁 Директория приложения: ${APP_DIR}"
echo ""
echo "🗄️ База данных:"
echo "   Имя: ${DB_NAME}"
echo "   Пользователь: ${DB_USER}"
echo "   Пароль: ${DB_PASSWORD}"
echo ""
echo "⚠️  ВАЖНО: Сохраните данные базы данных!"
echo "============================================"
