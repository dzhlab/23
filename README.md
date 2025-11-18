# Система управления соревнованиями по спортивной гимнастике

Веб-приложение для организации и проведения соревнований по спортивной гимнастике в соответствии с правилами FIG 2025-2028.

## Описание

Полнофункциональная система для управления соревнованиями по спортивной гимнастике, включающая:

- **Регистрация и аутентификация** пользователей с различными ролями
- **Управление соревнованиями** (создание, редактирование, удаление)
- **Регистрация спортсменов** и команд на соревнования
- **Судейская система** в соответствии с правилами FIG
- **Подсчет баллов** и формирование рейтингов
- **Формирование отчетов** и протоколов соревнований

## Технологический стек

### Backend
- **Node.js** 18+
- **Express.js** 4.18
- **TypeScript** 5.3
- **PostgreSQL** 15
- **TypeORM** 0.3
- **JWT** для аутентификации
- **Bcrypt** для хеширования паролей
- **Joi** для валидации данных
- **Winston** для логирования

### Frontend
- **React** 18
- **TypeScript** 5.3
- **Material-UI** 5
- **React Router** 6
- **Zustand** для управления состоянием
- **Axios** для HTTP-запросов
- **React Hook Form** + **Zod** для валидации форм
- **Vite** как сборщик

### DevOps
- **Docker** и **Docker Compose**
- **Nginx** как reverse proxy
- **PostgreSQL** 15
- **Redis** для кеширования

## Роли пользователей

Система поддерживает 14 ролей:

1. **admin** - Администратор системы
2. **organizer** - Организатор соревнований
3. **chief_judge** - Главный судья
4. **difficulty_judge** - Судья по сложности (D-бригада)
5. **execution_judge** - Судья по исполнению (E-бригада)
6. **artistic_judge** - Судья по артистизму (A-бригада)
7. **line_judge** - Линейный судья
8. **time_judge** - Судья-хронометрист
9. **coach** - Тренер
10. **athlete** - Спортсмен
11. **spectator** - Зритель
12. **moderator** - Модератор
13. **analytics** - Аналитик
14. **technical_delegate** - Технический делегат

## Структура проекта

```
.
├── backend/               # Backend приложение
│   ├── src/
│   │   ├── config/       # Конфигурация
│   │   ├── entities/     # TypeORM сущности
│   │   ├── types/        # TypeScript типы
│   │   ├── services/     # Бизнес-логика
│   │   ├── controllers/  # HTTP контроллеры
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API маршруты
│   │   ├── utils/        # Утилиты
│   │   └── index.ts      # Точка входа
│   ├── migrations/       # Миграции БД
│   ├── seeds/           # Seed-данные
│   └── package.json
│
├── frontend/             # Frontend приложение
│   ├── src/
│   │   ├── components/  # React компоненты
│   │   ├── pages/       # Страницы
│   │   ├── services/    # API сервисы
│   │   ├── store/       # Zustand хранилища
│   │   ├── types/       # TypeScript типы
│   │   └── App.tsx
│   └── package.json
│
├── database/            # Документация БД
│   └── schema/
│
├── docs/               # Дополнительная документация
│
└── docker-compose.yml  # Docker Compose конфигурация
```

## Установка и запуск

### Требования

- Node.js 18+
- Docker и Docker Compose
- PostgreSQL 15+ (если запуск без Docker)

### Запуск с Docker

```bash
# Клонировать репозиторий
git clone https://github.com/dzhlab/2.git
cd 2

# Запустить все сервисы
docker-compose up -d

# Приложение будет доступно по адресу http://localhost
```

### Локальный запуск

#### Backend

```bash
cd backend

# Установить зависимости
npm install

# Создать файл .env на основе .env.example
cp .env.example .env

# Запустить миграции
npm run migration:run

# Запустить seed-данные
npm run seed:run

# Запустить в режиме разработки
npm run dev

# Запустить в production
npm run build
npm start
```

#### Frontend

```bash
cd frontend

# Установить зависимости
npm install

# Создать файл .env на основе .env.example
cp .env.example .env

# Запустить в режиме разработки
npm run dev

# Собрать для production
npm run build
```

## API Endpoints

### Пользователи
- `POST /api/users/register` - Регистрация
- `POST /api/users/login` - Вход
- `POST /api/users/logout` - Выход
- `POST /api/users/refresh-token` - Обновление токена
- `GET /api/users/me` - Текущий пользователь
- `GET /api/users/:id` - Получить пользователя
- `PATCH /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя
- `GET /api/users` - Список пользователей

### Соревнования
- `POST /api/competitions` - Создать соревнование
- `GET /api/competitions` - Список соревнований
- `GET /api/competitions/:id` - Получить соревнование
- `PATCH /api/competitions/:id` - Обновить соревнование
- `DELETE /api/competitions/:id` - Удалить соревнование

### Спортсмены
- `POST /api/athletes` - Создать профиль спортсмена
- `GET /api/athletes` - Список спортсменов
- `GET /api/athletes/:id` - Получить спортсмена
- `PATCH /api/athletes/:id` - Обновить спортсмена
- `DELETE /api/athletes/:id` - Удалить спортсмена

### Выступления
- `POST /api/performances` - Создать выступление
- `GET /api/performances` - Список выступлений
- `GET /api/performances/:id` - Получить выступление
- `PATCH /api/performances/:id` - Обновить выступление
- `DELETE /api/performances/:id` - Удалить выступление

## Лицензия

MIT

## Автор

dzhlab

## Статус разработки

В активной разработке. См. файл DEVELOPMENT_PROGRESS.md для деталей.
