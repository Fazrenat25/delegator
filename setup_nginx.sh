#!/bin/bash
cat > /etc/nginx/sites-available/delegator << 'NGINXEOF'
server {
    listen 80;
    server_name 144.31.14.195;

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

echo "Nginx конфиг создан:"
cat /etc/nginx/sites-available/delegator

echo ""
echo "Активация конфига..."
ln -sf /etc/nginx/sites-available/delegator /etc/nginx/sites-enabled/delegator
nginx -t && systemctl reload nginx
echo "✅ Nginx настроен и перезапущен"
