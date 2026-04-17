#!/bin/bash
cat > /var/www/delegator/.env << 'ENVEOF'
DATABASE_URL="postgresql://delegator_user:delegator_secure_pwd_2026@localhost:5432/delegator?schema=public"
NEXTAUTH_SECRET="delegator-super-secret-jwt-key-2026-production"
NEXTAUTH_URL=http://144.31.14.195
NODE_ENV=production
ENVEOF
echo ".env файл создан:"
cat /var/www/delegator/.env
