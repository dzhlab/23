# Руководство по установке и запуску

## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/dzhlab/2.git
cd 2
```

### 2. Запуск с Docker (рекомендуется)

```bash
# Запуск всех сервисов
docker-compose up -d

# Приложение будет доступно по адресу:
# - Frontend: http://localhost
# - Backend API: http://localhost:3000/api
# - Health check: http://localhost:3000/health
```

### 3. Локальный запуск без Docker

#### Backend

```bash
cd backend

# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env
# Отредактируйте .env файл с вашими настройками

# Запуск PostgreSQL и Redis (требуется)
# Используйте Docker для БД:
docker run -d --name gymnastics_postgres -e POSTGRES_DB=gymnastics_db -e POSTGRES_USER=gymnastics_user -e POSTGRES_PASSWORD=gymnastics_password -p 5432:5432 postgres:15-alpine

# Запуск миграций
npm run migration:run

# Заполнение тестовыми данными
npm run seed:run

# Запуск в режиме разработки
npm run dev

# Или сборка и запуск production
npm run build
npm start
```

#### Frontend

```bash
cd frontend

# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:3000/api

# Запуск в режиме разработки
npm run dev

# Приложение будет доступно по адресу http://localhost:5173
```

## Тестовые учетные записи

После запуска `npm run seed:run` в backend, доступны следующие учетные записи:

| Email | Пароль | Роль |
|-------|--------|------|
| admin@gymnastics.com | password123 | Администратор |
| organizer@gymnastics.com | password123 | Организатор |
| chiefjudge@gymnastics.com | password123 | Главный судья |
| d-judge1@gymnastics.com | password123 | Судья по сложности |
| e-judge1@gymnastics.com | password123 | Судья по исполнению |
| coach@gymnastics.com | password123 | Тренер |
| athlete1@gymnastics.com | password123 | Спортсмен |
| athlete2@gymnastics.com | password123 | Спортсмен |

## API Endpoints

### Пользователи
- `POST /api/users/register` - Регистрация
- `POST /api/users/login` - Вход
- `GET /api/users/me` - Текущий пользователь (требуется аутентификация)
- `GET /api/users/:id` - Получить пользователя
- `GET /api/users` - Список пользователей
- `PATCH /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя

### Соревнования
- `POST /api/competitions` - Создать соревнование (требуется аутентификация)
- `GET /api/competitions` - Список соревнований
- `GET /api/competitions/:id` - Получить соревнование
- `PATCH /api/competitions/:id` - Обновить соревнование
- `DELETE /api/competitions/:id` - Удалить соревнование

## Переменные окружения

### Backend (.env)

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=gymnastics_db
DB_USER=gymnastics_user
DB_PASSWORD=gymnastics_password

JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Технологии

### Backend
- Node.js 18+
- Express.js 4.18
- TypeScript 5.3
- PostgreSQL 15
- TypeORM 0.3
- JWT аутентификация
- Bcrypt
- Joi валидация

### Frontend
- React 18
- TypeScript 5.3
- Material-UI 5
- React Router 6
- Axios
- Zustand
- React Hook Form + Zod
- Vite

### DevOps
- Docker & Docker Compose
- Nginx
- PostgreSQL
- Redis

## Разработка

### Backend

```bash
# Запуск в режиме разработки с hot reload
npm run dev

# Проверка кода (lint)
npm run lint

# Исправление ошибок линтера
npm run lint:fix

# Форматирование кода
npm run format

# Сборка
npm run build
```

### Frontend

```bash
# Запуск dev сервера
npm run dev

# Сборка для production
npm run build

# Предпросмотр production сборки
npm run preview
```

## Решение проблем

### Ошибка подключения к БД

Убедитесь, что PostgreSQL запущен и доступен:

```bash
# Проверка через psql
psql -h localhost -U gymnastics_user -d gymnastics_db

# Или через Docker
docker ps | grep postgres
```

### Ошибка CORS

Убедитесь, что в backend/.env переменная CORS_ORIGIN указывает на URL вашего frontend приложения.

### Проблемы с миграциями

```bash
# Откат последней миграции
npm run migration:revert

# Повторный запуск миграций
npm run migration:run
```

## Лицензия

MIT
