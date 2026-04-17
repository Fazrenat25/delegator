# 📋 Инструкция по развёртыванию Delegator на VPS

## 🎯 Что будет сделано

- ✅ Установка Node.js 20, PostgreSQL, Nginx
- ✅ Настройка базы данных
- ✅ Деплой Next.js приложения
- ✅ Настройка reverse proxy через Nginx
- ✅ Автоматический перезапуск через PM2
- ✅ Настройка firewall

---

## 📝 Шаг 1: Подключение к серверу

Откройте терминал на вашем компьютере (PowerShell или CMD):

```bash
ssh root@144.31.14.195
```

Или используйте ваш username вместо `root`.

---

## 📝 Шаг 2: Загрузка файлов проекта на сервер

**Вариант A: Через SCP (из PowerShell на локальной машине)**

```powershell
scp -r I:\site\delegator\delegator\* root@144.31.14.195:/var/www/delegator/
```

**Вариант B: Через Git (если проект в репозитории)**

На сервере выполните:

```bash
mkdir -p /var/www/delegator
cd /var/www/delegator
git clone <ваш-репозиторий> .
```

**Вариант C: Через SFTP клиент (WinSCP, FileZilla)**

- Подключитесь к `144.31.14.195`
- Загрузите все файлы из `I:\site\delegator\delegator\` в `/var/www/delegator/`

---

## 📝 Шаг 3: Запуск скрипта развёртывания

### 3.1. Загрузите скрипт `deploy.sh` на сервер

```powershell
scp I:\site\delegator\delegator\deploy.sh root@144.31.14.195:/root/deploy.sh
```

### 3.2. Сделайте скрипт исполняемым и запустите

На сервере выполните:

```bash
chmod +x /root/deploy.sh
sudo /root/deploy.sh
```

⏱️ **Время выполнения:** 5-15 минут (зависит от скорости сервера)

---

## 📝 Шаг 4: Проверка результата

После завершения скрипт покажет:

```
✅ РАЗВЁРТЫВАНИЕ ЗАВЕРШЕНО!
🌐 Сайт доступен по адресу: http://144.31.14.195
```

**Откройте в браузере:** `http://144.31.14.195`

---

## 📝 Шаг 5: Создание администратора (если нужно)

```bash
cd /var/www/delegator
npx tsx scripts/create-admin.ts
```

---

## 🔧 Управление приложением

### Статус приложения

```bash
pm2 status
```

### Логи приложения

```bash
pm2 logs delegator
pm2 logs delegator --lines 100  # последние 100 строк
```

### Перезапуск приложения

```bash
pm2 restart delegator
```

### Остановка приложения

```bash
pm2 stop delegator
```

### Обновление приложения

```bash
cd /var/www/delegator
git pull  # или загрузите новые файлы
npm install
npx prisma migrate deploy
npm run build
pm2 restart delegator
```

---

## 🗄️ База данных

### Подключение к базе данных

```bash
sudo -u postgres psql delegator
```

### Создание бэкапа базы данных

```bash
sudo -u postgres pg_dump delegator > delegator_backup_$(date +%Y%m%d).sql
```

### Восстановление из бэкапа

```bash
sudo -u postgres psql delegator < delegator_backup_20260410.sql
```

---

## 🔒 Безопасность (рекомендации)

### 1. Смените пароль root

```bash
passwd
```

### 2. Создайте обычного пользователя

```bash
adduser deploy
usermod -aG sudo deploy
```

### 3. Отключите вход по паролю (используйте SSH ключи)

```bash
sudo nano /etc/ssh/sshd_config
# Измените: PasswordAuthentication no
sudo systemctl restart sshd
```

### 4. Настройте SSL (Let's Encrypt) - если будет домен

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ваш-домен.com
```

---

## 🐛 Решение проблем

### Приложение не запускается

```bash
# Проверьте логи PM2
pm2 logs delegator

# Проверьте статус
pm2 status

# Перезапустите
pm2 restart delegator
```

### Nginx не работает

```bash
# Проверьте конфигурацию
sudo nginx -t

# Перезапустите Nginx
sudo systemctl restart nginx

# Проверьте статус
sudo systemctl status nginx
```

### Ошибка подключения к базе данных

```bash
# Проверьте, что PostgreSQL работает
sudo systemctl status postgresql

# Проверьте .env файл
cat /var/www/delegator/.env

# Перезапустите приложение
pm2 restart delegator
```

### Порт 3000 не доступен

```bash
# Проверьте, что приложение слушает порт
pm2 logs delegator

# Проверьте firewall
sudo ufw status
```

---

## 📞 Поддержка

Если что-то пошло не так, предоставьте:

1. Вывод команды: `pm2 logs delegator --lines 50`
2. Вывод команды: `sudo systemctl status nginx`
3. Вывод команды: `sudo systemctl status postgresql`

---

**Готово! 🎉**
