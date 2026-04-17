#!/bin/bash
echo "🔒 Создание самоподписанного SSL сертификата..."

# Создание сертификата
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/delegator.key \
  -out /etc/ssl/certs/delegator.crt \
  -subj "/C=US/ST=State/L=City/O=Delegator/CN=144.31.14.195" \
  -addext "subjectAltName=IP:144.31.14.195"

chmod 600 /etc/ssl/private/delegator.key
chmod 644 /etc/ssl/certs/delegator.crt

echo "✅ Сертификат создан"

# Обновление Nginx конфига
cat > /etc/nginx/sites-available/delegator << 'NGINXEOF'
# HTTP - редирект на HTTPS
server {
    listen 80;
    server_name 144.31.14.195;
    return 301 https://$host$request_uri;
}

# HTTPS
server {
    listen 443 ssl;
    server_name 144.31.14.195;

    ssl_certificate /etc/ssl/certs/delegator.crt;
    ssl_certificate_key /etc/ssl/private/delegator.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF

echo "✅ Nginx конфиг обновлён"

# Проверка и перезапуск Nginx
nginx -t && systemctl reload nginx
echo "✅ Nginx перезапущен"

# Открыть порт 443 в firewall
ufw allow 'Nginx Full'
echo "✅ Порт 443 открыт"

echo ""
echo "🎉 HTTPS настроен!"
echo "🌐 Сайт доступен по: https://144.31.14.195"
echo "⚠️  Браузер покажет предупреждение о самоподписанном сертификате - это нормально"
