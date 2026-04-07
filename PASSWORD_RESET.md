# 🔑 Сброс пароля PostgreSQL

## Способ 1: Через pgAdmin (если помните старый пароль)

1. Откройте pgAdmin 4
2. Нажмите правой кнопкой на **Login/Group Roles** → **postgres**
3. Выберите **Properties**
4. Перейдите на вкладку **Definition**
5. Введите новый пароль в поле **Password**
6. Нажмите **Save**
7. Обновите `.env` файл с новым паролем

## Способ 2: Сброс через конфигурационный файл (если забыли пароль)

### Шаг 1: Найдите pg_hba.conf

Обычно находится в:
```
C:\Program Files\PostgreSQL\16\data\pg_hba.conf
```
(цифра 16 может отличаться в зависимости от версии)

### Шаг 2: Измените метод аутентификации

1. Откройте `pg_hba.conf` в блокноте (от имени администратора!)
2. Найдите строки:
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            scram-sha-256
   ```
3. Замените `scram-sha-256` на `trust`:
   ```
   host    all             all             127.0.0.1/32            trust
   ```
4. Сохраните файл

### Шаг 3: Перезапустите PostgreSQL

1. Откройте **Службы** (Win + R → `services.msc`)
2. Найдите службу **postgresql-x64-16** (или другая версия)
3. Нажмите правой кнопкой → **Перезапустить**

### Шаг 4: Подключитесь без пароля и смените пароль

Откройте командную строку и выполните:

```cmd
cd "C:\Program Files\PostgreSQL\16\bin"
psql -U postgres
```

Должно подключиться без запроса пароля.

Теперь смените пароль в SQL:

```sql
ALTER USER postgres WITH PASSWORD 'новый_пароль';
\q
```

### Шаг 5: Верните pg_hba.conf обратно

1. Снова откройте `pg_hba.conf`
2. Верните `scram-sha-256` вместо `trust`
3. Сохраните
4. Перезапустите службу PostgreSQL

### Шаг 6: Обновите .env

В файле `.env` укажите новый пароль:

```env
DATABASE_URL="postgresql://postgres:новый_пароль@localhost:5432/delegator?schema=public"
```

---

## ✅ Проверка подключения

После смены пароля выполните:

```bash
cd I:\site\delegator\delegator
npx prisma db push
```

Если успешно — увидите:
```
Your database is now in sync with your schema.
```
