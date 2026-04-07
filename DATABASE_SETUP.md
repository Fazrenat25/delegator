# 🗄️ Настройка базы данных PostgreSQL

## Способ 1: Через pgAdmin (рекомендуется)

1. **Откройте pgAdmin 4**
   - Нажмите `Win + R`
   - Введите `pgAdmin 4` и нажмите Enter
   - Или найдите в меню Пуск → PostgreSQL → pgAdmin 4

2. **Подключитесь к серверу**
   - Введите пароль, который вы задали при установке PostgreSQL
   - Обычно это пароль для пользователя `postgres`

3. **Создайте базу данных**
   - В дереве слева разверните: Servers → PostgreSQL → Databases
   - Нажмите правой кнопкой на **Databases**
   - Выберите **Create** → **Database**
   - В поле **Database** введите: `delegator`
   - Нажмите **Save**

## Способ 2: Через командную строку Windows

1. **Откройте командную строку от имени администратора**

2. **Перейдите в папку с PostgreSQL** (путь может отличаться):
   ```cmd
   cd "C:\Program Files\PostgreSQL\16\bin"
   ```

3. **Создайте базу данных**:
   ```cmd
   createdb -U postgres delegator
   ```
   - Введите пароль при запросе (пароль пользователя postgres)

## Способ 3: Через SQL запрос в pgAdmin

1. Откройте pgAdmin 4
2. Нажмите **Tools** → **Query Tool**
3. Введите SQL:
   ```sql
   CREATE DATABASE delegator;
   ```
4. Нажмите кнопку выполнения (▶️)

## ✅ Проверка создания

После создания вы должны увидеть базу данных `delegator` в списке:
- Servers → PostgreSQL → Databases → delegator

---

## 🔧 Настройка .env файла

1. **Откройте файл** `I:\site\delegator\delegator\.env`

2. **Измените DATABASE_URL** на ваш:
   ```env
   DATABASE_URL="postgresql://postgres:ВАШ_ПАРОЛЬ@localhost:5432/delegator?schema=public"
   ```

   **Замените `ВАШ_ПАРОЛЬ`** на пароль, который вы задали при установке PostgreSQL!

3. **Измените JWT_SECRET** на любой секретный ключ:
   ```env
   JWT_SECRET="super-secret-key-change-this-12345"
   ```

## 📝 Пример готового .env

```env
DATABASE_URL="postgresql://postgres:MyPassword123@localhost:5432/delegator?schema=public"
JWT_SECRET="my-super-secret-jwt-key-for-delegator-app"
NEXT_PUBLIC_APP_NAME="Delegator"
```

---

## 🚀 Следующие шаги

После настройки базы данных и .env файла выполните:

```bash
cd I:\site\delegator\delegator
npm install
npx prisma db push
npm run dev
```

Проект будет доступен по адресу: http://localhost:3000
