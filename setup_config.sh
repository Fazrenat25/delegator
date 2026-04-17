#!/bin/bash
cat > /var/www/delegator/prisma.config.ts << 'CONFIGEOF'
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
  'datasource.url': process.env.DATABASE_URL,
});
CONFIGEOF
echo "prisma.config.ts создан"
cat /var/www/delegator/prisma.config.ts
