# 📐 Архитектура Delegator

## Общая структура

```
delegator/
├── prisma/                    # Схема базы данных и миграции
│   ├── schema.prisma          # Модель данных
│   └── migrations/            # История миграций БД
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API endpoints
│   │   │   ├── auth/          # Аутентификация
│   │   │   ├── tasks/         # Задачи
│   │   │   └── employees/     # Сотрудники
│   │   ├── dashboard/         # Личный кабинет
│   │   │   ├── tasks/         # Управление задачами
│   │   │   └── employees/     # Управление сотрудниками
│   │   ├── login/             # Страница входа
│   │   ├── register/          # Страница регистрации
│   │   ├── layout.tsx         # Корневой layout
│   │   └── page.tsx           # Главная страница
│   ├── components/            # React компоненты
│   │   ├── layout/            # Layout компоненты
│   │   │   ├── Sidebar.tsx    # Боковая панель
│   │   │   └── DashboardLayout.tsx
│   │   └── ui/                # UI компоненты
│   │       ├── Button.tsx     # Кнопка
│   │       ├── Card.tsx       # Карточка
│   │       ├── Input.tsx      # Поле ввода
│   │       ├── Select.tsx     # Выпадающий список
│   │       └── Badge.tsx      # Бейдж
│   ├── lib/                   # Утилиты и библиотеки
│   │   ├── auth.ts            # Аутентификация (JWT)
│   │   ├── prisma.ts          # Prisma клиент
│   │   └── utils.ts           # Helper функции
│   ├── types/                 # TypeScript типы
│   │   └── index.ts           # Общие типы
│   └── middleware.ts          # Middleware для защиты роутов
├── .env                       # Переменные окружения
├── next.config.ts             # Конфигурация Next.js
├── package.json               # Зависимости
├── prisma.config.ts           # Конфигурация Prisma
└── tailwind.config.ts         # Конфигурация Tailwind
```

## Технологический стек

### Frontend
- **Next.js 16** - React фреймворк с App Router
- **React 19** - UI библиотека
- **TypeScript** - Типизация
- **Tailwind CSS 4** - Стилизация

### Backend
- **Next.js API Routes** - Серверная логика
- **Prisma 7** - ORM для работы с БД
- **PostgreSQL** - Реляционная база данных

### Безопасность
- **JWT (jose)** - Токены аутентификации
- **bcryptjs** - Хэширование паролей
- **HttpOnly Cookies** - Безопасное хранение токенов

## Модель данных

```prisma
User
├── id: String (cuid)
├── email: String (unique)
├── password: String (hashed)
├── firstName: String
├── lastName: String
├── role: Role (DIRECTOR | EMPLOYEE)
├── companyId: String?
├── company: Company?
├── tasks: Task[] (assigned)
├── createdTasks: Task[] (created)
└── timestamps

Company
├── id: String (cuid)
├── name: String
├── description: String?
├── users: User[]
├── tasks: Task[]
└── timestamps

Task
├── id: String (cuid)
├── title: String
├── description: String
├── status: TaskStatus
├── priority: Priority
├── deadline: DateTime?
├── companyId: String
├── createdById: String
├── assignedToId: String?
├── comments: Comment[]
└── timestamps

Comment
├── id: String (cuid)
├── content: String
├── taskId: String
├── authorId: String
└── timestamps
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `GET /api/auth/session` - Получение текущей сессии

### Задачи
- `GET /api/tasks` - Список задач (фильтруется по роли)
- `POST /api/tasks` - Создание задачи (только директор)

### Сотрудники
- `GET /api/employees` - Список сотрудников компании
- `POST /api/employees` - Добавление сотрудника (только директор)

## Аутентификация

1. Пользователь вводит email/пароль
2. Сервер проверяет credentials
3. При успехе создается JWT токен
4. Токен сохраняется в HttpOnly cookie
5. Middleware проверяет токен на защищенных роутах

## Middleware

```typescript
// src/middleware.ts
- Проверяет наличие JWT токена
- Защищает dashboard роуты
- Перенаправляет неавторизованных на /login
- Пропускает публичные роуты (/login, /register, /)
```

## Компоненты

### UI Components
Базовые переиспользуемые компоненты с премиальным дизайном:

- **Button** - Кнопки с вариантами (primary, secondary, outline, ghost, danger)
- **Card** - Карточки с header, content, footer
- **Input** - Поля ввода с label и валидацией
- **Select** - Выпадающие списки
- **Badge** - Бейджи для статусов и приоритетов

### Layout Components
- **Sidebar** - Боковая навигационная панель
- **DashboardLayout** - Обертка для страниц дашборда

## Стили

### Цветовая схема
- **Primary**: Slate (900, 800, 700)
- **Accent**: Amber (500, 600, 700)
- **Success**: Emerald (500, 600)
- **Warning**: Amber/Yellow
- **Danger**: Red (500, 600)
- **Info**: Blue (500, 600)

### Дизайн принципы
- Градиентные фоны и кнопки
- Glassmorphism эффекты
- Плавные transition анимации
- Тени для глубины
- Закругленные углы (rounded-lg, rounded-xl)

## Безопасность

### Пароли
- Хэширование bcrypt с salt rounds = 12
- Минимальная длина 6 символов

### Токены
- JWT с алгоритмом HS256
- Время жизни 24 часа
- HttpOnly cookies для защиты от XSS

### Валидация
- Проверка обязательных полей
- Уникальность email
- Проверка ролей для защищенных операций

## Развертывание

### Локально
```bash
npm install
npx prisma migrate dev
npm run dev
```

### VPS (Production)
```bash
npm install --production
npx prisma migrate deploy
npm run build
pm2 start npm --name "delegator" -- start
```

### Environment Variables
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NEXT_PUBLIC_APP_NAME=Delegator
```

## Масштабируемость

### Горизонтальное масштабирование
- Stateless архитектура (токены в cookies)
- База данных PostgreSQL с репликацией

### Оптимизация
- Статическая генерация где возможно
- Серверный рендеринг для динамических данных
- Индексы в БД для быстрых запросов

## Будущие улучшения

1. Real-time уведомления (WebSocket)
2. Email уведомления
3. Файловые вложения к задачам
4. История изменений задач
5. Экспорт отчетов (PDF, Excel)
6. Мобильное приложение
7. Интеграция с календарями
8. Аналитика и дашборды

---

**Delegator v1.0** - Профессиональная система делегирования задач
