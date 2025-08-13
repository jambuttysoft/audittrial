# Document Digitization System

Система цифровизации документов, состоящая из фронтенда и бэкенда.

## Структура проекта

```
audittrial/
├── frontend/          # Next.js фронтенд с ShadCN UI
├── backend/           # Next.js API бэкенд с Prisma + PostgreSQL
└── README.md          # Этот файл
```

## Быстрый старт

### 1. Запуск бэкенда

```bash
cd backend
npm install
npm run db:push          # Создание таблиц в базе данных
npm run dev              # Запуск на порту 3001
```

### 2. Запуск фронтенда

```bash
cd frontend
npm install
npm run dev              # Запуск на порту 3000
```

## Технологии

### Frontend
- **Next.js 15** - React фреймворк с App Router
- **TypeScript** - Типизированный JavaScript
- **Tailwind CSS** - Utility-first CSS фреймворк
- **ShadCN UI** - Современные React компоненты

### Backend
- **Next.js 15** - API Routes для бэкенда
- **Prisma** - ORM для работы с базой данных
- **PostgreSQL** - Реляционная база данных
- **TypeScript** - Типизированный JavaScript

## API Endpoints

- `GET /api/documents` - Получить все документы
- `POST /api/documents` - Создать новый документ
- `GET /api/documents/[id]` - Получить документ по ID
- `PUT /api/documents/[id]` - Обновить документ
- `DELETE /api/documents/[id]` - Удалить документ
- `POST /api/upload` - Загрузить файл
- `GET /api/users` - Получить всех пользователей
- `POST /api/users` - Создать пользователя

## База данных

Система использует Prisma с PostgreSQL. Схема включает:

- **User** - Пользователи системы
- **Document** - Документы с метаданными и статусом обработки
- **DocumentStatus** - Enum статусов (QUEUE, PROCESSING, DIGITIZED, ERROR)

## Переменные окружения

Скопируйте `.env.example` в `.env` и настройте:

```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_SECRET="your-secret-key"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760
```

## Разработка

### Работа с базой данных

```bash
cd backend
npm run db:generate     # Генерация Prisma клиента
npm run db:push         # Применение изменений схемы
npm run db:migrate      # Создание миграций
npm run db:studio       # Открытие Prisma Studio
```

### Добавление компонентов ShadCN

```bash
cd frontend
npx shadcn@latest add [component-name]
```

## Порты

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Prisma Studio**: http://localhost:5555

## Лицензия

MIT