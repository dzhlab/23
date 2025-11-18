# 🏅 Система управления соревнованиями по художественной гимнастике

Полнофункциональная веб-система для организации и проведения соревнований по художественной гимнастике с поддержкой правил FIG 2025-2028.

## 📋 Содержание

- [Описание проекта](#описание-проекта)
- [Технологический стек](#технологический-стек)
- [Основные возможности](#основные-возможности)
- [Требования](#требования)
- [Установка и запуск](#установка-и-запуск)
- [Структура проекта](#структура-проекта)
- [Документация](#документация)
- [Разработка](#разработка)
- [Тестирование](#тестирование)
- [Развертывание](#развертывание)
- [Лицензия](#лицензия)

## 📖 Описание проекта

Система предназначена для автоматизации процесса проведения соревнований по художественной гимнастике, включая:

- Управление соревнованиями и участниками
- Судейство в режиме реального времени
- Автоматический расчет оценок по правилам FIG 2025-2028
- Генерацию протоколов и отчетов
- Статистику и аналитику

## 🛠 Технологический стек

### Backend
- **Node.js** - серверная платформа
- **Express** - веб-фреймворк
- **TypeScript** - типизированный JavaScript
- **PostgreSQL** - реляционная база данных
- **Redis** - кеширование и очереди
- **Socket.io** - WebSocket для real-time
- **TypeORM** - ORM для работы с БД
- **Jest** - фреймворк для тестирования

### Frontend
- **React** - библиотека для UI
- **TypeScript** - типизация
- **Vite** - сборщик и dev-сервер
- **Material-UI** - UI компоненты
- **Zustand** - state management
- **React Hook Form** - управление формами
- **Axios** - HTTP клиент
- **Vitest** - тестирование

### DevOps
- **Docker** - контейнеризация
- **Docker Compose** - оркестрация контейнеров
- **Nginx** - обратный прокси
- **GitHub Actions** - CI/CD (планируется)

## ✨ Основные возможности

### 1. Управление соревнованиями
- Создание и настройка соревнований
- Управление группами и потоками
- Жеребьевка участников (3 алгоритма)
- Распределение по потокам

### 2. Судейская система
- 3 типа интерфейсов судьи (расширенный, сбалансированный, упрощенный)
- Бригады D, E, A судей
- Автоматический расчет оценок по FIG 2025-2028
- Механизм консенсуса судей
- Автосохранение оценок

### 3. Панель главного судьи
- Мониторинг всех бригад в реальном времени
- Анализ расхождений оценок
- Управление консенсусом
- Статистика работы судей

### 4. Real-time обновления
- WebSocket синхронизация
- Онлайн табло для зрителей
- Инфокиоск

### 5. Отчеты и экспорт
- Генерация протоколов
- Экспорт в Excel
- Экспорт в PDF
- Статистика и аналитика

### 6. Безопасность
- JWT аутентификация
- RBAC (11 ролей)
- Защита от SQL-инъекций и XSS
- Rate limiting
- Шифрование данных

## 📦 Требования

### Минимальные требования:
- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker >= 20.10.0 (для запуска через Docker)
- Docker Compose >= 2.0.0
- PostgreSQL >= 15.0 (если запуск без Docker)
- Redis >= 7.0 (если запуск без Docker)

### Рекомендуемые требования:
- Node.js >= 20.0.0
- 4 GB RAM
- 10 GB свободного места на диске

## 🚀 Установка и запуск

### Способ 1: Запуск через Docker (рекомендуется)

1. **Клонировать репозиторий:**
```bash
git clone https://github.com/yourusername/gymnastics-competition-system.git
cd gymnastics-competition-system
```

2. **Создать файлы окружения:**
```bash
# Backend
cp backend/.env.example backend/.env
# Отредактируйте backend/.env и заполните необходимые значения

# Frontend (если требуется)
cp frontend/.env.example frontend/.env
```

3. **Запустить все сервисы:**
```bash
# Запуск в development режиме
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка сервисов
docker-compose down
```

4. **Доступ к приложению:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Health: http://localhost:3000/health

### Способ 2: Запуск локально (без Docker)

1. **Установить зависимости:**
```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

2. **Запустить PostgreSQL и Redis:**
```bash
# PostgreSQL
psql -U postgres -c "CREATE DATABASE gymnastics_db;"

# Redis
redis-server
```

3. **Настроить переменные окружения:**
```bash
# Backend
cp backend/.env.example backend/.env
# Отредактируйте .env файл

# Frontend
cp frontend/.env.example frontend/.env
```

4. **Запустить миграции базы данных:**
```bash
cd backend
npm run migrate
```

5. **Запустить приложения:**
```bash
# Терминал 1: Backend
cd backend
npm run dev

# Терминал 2: Frontend
cd frontend
npm run dev
```

## 📁 Структура проекта

```
gymnastics-competition-system/
├── backend/                    # Backend приложение
│   ├── src/
│   │   ├── models/            # Модели данных
│   │   ├── controllers/       # Контроллеры
│   │   ├── services/          # Бизнес-логика
│   │   ├── middleware/        # Промежуточное ПО
│   │   ├── routes/            # Маршруты API
│   │   ├── utils/             # Утилиты
│   │   ├── config/            # Конфигурация
│   │   └── index.ts           # Точка входа
│   ├── tests/                 # Тесты
│   ├── Dockerfile             # Docker образ
│   ├── package.json           # Зависимости
│   └── tsconfig.json          # TypeScript конфигурация
├── frontend/                   # Frontend приложение
│   ├── src/
│   │   ├── components/        # React компоненты
│   │   ├── pages/             # Страницы
│   │   ├── services/          # API сервисы
│   │   ├── store/             # State management
│   │   ├── hooks/             # Custom hooks
│   │   ├── types/             # TypeScript типы
│   │   └── utils/             # Утилиты
│   ├── public/                # Статические файлы
│   ├── Dockerfile             # Docker образ
│   ├── package.json           # Зависимости
│   └── tsconfig.json          # TypeScript конфигурация
├── database/                   # База данных
│   ├── migrations/            # Миграции
│   └── seeds/                 # Начальные данные
├── docs/                       # Документация
│   ├── API.md                 # API документация
│   ├── DATABASE_SCHEMA.md     # Схема БД
│   ├── USER_GUIDE.md         # Руководство пользователя
│   └── DEPLOYMENT.md          # Развертывание
├── docker-compose.yml          # Docker Compose конфигурация
├── .gitignore                 # Git ignore
├── README.md                  # Этот файл
├── DEVELOPMENT_PROGRESS.md    # Журнал разработки
├── ФУНКЦИОНАЛЬНАЯ_СПЕЦИФИКАЦИЯ.md  # Спецификация
└── ПЛАН_РАЗРАБОТКИ.md         # План разработки
```

## 📚 Документация

- [Функциональная спецификация](./ФУНКЦИОНАЛЬНАЯ_СПЕЦИФИКАЦИЯ.md) - полное описание функционала
- [План разработки](./ПЛАН_РАЗРАБОТКИ.md) - детальный план разработки
- [Журнал разработки](./DEVELOPMENT_PROGRESS.md) - прогресс разработки
- [API документация](./docs/API.md) - описание API endpoints
- [Схема базы данных](./docs/DATABASE_SCHEMA.md) - структура БД
- [Руководство пользователя](./docs/USER_GUIDE.md) - инструкции для пользователей

## 💻 Разработка

### Настройка среды разработки

1. **Установить расширения VS Code (рекомендуется):**
- ESLint
- Prettier
- TypeScript
- Docker
- GitLens

2. **Настроить Git hooks:**
```bash
# Установить husky для pre-commit hooks
npm install -D husky
npx husky install
```

### Соглашения по коду

1. **Все комментарии на русском языке**
2. **Каждая строка кода должна иметь комментарий**
3. **Использовать TypeScript для type safety**
4. **Следовать принципам SOLID**
5. **Писать тесты для нового функционала**
6. **Использовать ESLint и Prettier**

### Git workflow

1. Создать ветку для новой функции: `git checkout -b feature/название-функции`
2. Делать коммиты с понятными сообщениями
3. Создать Pull Request
4. Дождаться code review
5. Слить в main после одобрения

## 🧪 Тестирование

### Backend тесты
```bash
cd backend

# Запустить все тесты
npm test

# Запустить с coverage
npm run test:coverage

# Запустить в watch mode
npm run test:watch
```

### Frontend тесты
```bash
cd frontend

# Запустить все тесты
npm test

# Запустить с UI
npm run test:ui

# Запустить с coverage
npm run test:coverage
```

### E2E тесты
```bash
# TODO: Будет добавлено позже
```

## 🚢 Развертывание

### Development
```bash
docker-compose up -d
```

### Production
```bash
# Сборка production образов
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Запуск с Nginx
docker-compose --profile production up -d
```

Подробные инструкции: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## 🤝 Вклад в проект

Мы приветствуем вклад в проект! Пожалуйста, следуйте этим шагам:

1. Fork проекта
2. Создайте ветку для функции (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE)

## 👥 Авторы

- **Claude Code** - Разработка системы

## 📧 Контакты

- Email: support@gymnastics-system.com
- Website: https://gymnastics-system.com
- Issues: https://github.com/yourusername/gymnastics-competition-system/issues

## 🙏 Благодарности

- Федерация художественной гимнастики
- FIG (Fédération Internationale de Gymnastique)
- Все контрибьюторы проекта

---

**Статус проекта:** 🟡 В разработке (Этап 1/8 завершено)

**Последнее обновление:** 18.11.2025
