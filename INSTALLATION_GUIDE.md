# Инструкция по установке и запуску проекта

## 📦 Системные требования

- **Node.js**: >=18.0.0
- **npm**: >=9.0.0
- **PostgreSQL**: 15+
- **Docker** и **Docker Compose** (опционально, рекомендуется)

## 🚀 Вариант 1: Запуск через Docker (рекомендуется)

Это самый простой способ - все зависимости будут установлены автоматически.

### Шаг 1: Распаковка архива

```bash
# Распаковать архив
tar -xzf gymnastics-competition-system.tar.gz

# Перейти в директорию проекта
cd gymnastics-competition-system
```

### Шаг 2: Настройка переменных окружения

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

Отредактируйте `backend/.env` при необходимости (базовые настройки уже установлены).

### Шаг 3: Запуск всех сервисов

```bash
# Запустить все сервисы (PostgreSQL, Redis, Backend, Frontend)
docker-compose up -d

# Просмотр логов
docker-compose logs -f
```

### Шаг 4: Доступ к приложению

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **API Health Check**: http://localhost:3000/api/health
- **PostgreSQL**: localhost:5432 (username: postgres, password: postgres123)
- **Redis**: localhost:6379

### Остановка

```bash
docker-compose down
```

---

## 🔧 Вариант 2: Локальная установка (без Docker)

### Шаг 1: Установка PostgreSQL

Установите PostgreSQL 15 и создайте базу данных:

```sql
CREATE DATABASE gymnastics_db;
CREATE USER gymnastics_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE gymnastics_db TO gymnastics_user;
```

### Шаг 2: Настройка Backend

```bash
# Перейти в директорию backend
cd backend

# Установить зависимости
npm install

# Настроить .env
cp .env.example .env
# Отредактируйте .env, укажите данные PostgreSQL

# Запустить миграции базы данных
npm run migration:run

# Заполнить базу тестовыми данными (опционально)
npm run seed

# Запустить в режиме разработки
npm run dev
```

Backend будет доступен на http://localhost:3000

### Шаг 3: Настройка Frontend

Откройте новый терминал:

```bash
# Перейти в директорию frontend
cd frontend

# Установить зависимости
npm install

# Настроить .env (опционально)
cp .env.example .env

# Запустить в режиме разработки
npm run dev
```

Frontend будет доступен на http://localhost:5173

---

## 👤 Тестовые пользователи

После выполнения seed скрипта будут созданы следующие пользователи:

### Администратор
- **Email**: admin@example.com
- **Password**: Admin123!
- **Роль**: admin

### Организатор
- **Email**: organizer@example.com
- **Password**: Organizer123!
- **Роль**: organizer

### Главный судья
- **Email**: chief.judge@example.com
- **Password**: Chief123!
- **Роль**: chief_judge

### Судья по сложности
- **Email**: difficulty.judge@example.com
- **Password**: Difficulty123!
- **Роль**: difficulty_judge

### Судья по исполнению
- **Email**: execution.judge@example.com
- **Password**: Execution123!
- **Роль**: execution_judge

### Зритель
- **Email**: spectator@example.com
- **Password**: Spectator123!
- **Роль**: spectator

---

## 📝 Доступные команды

### Backend

```bash
npm run dev           # Запуск в режиме разработки
npm run build         # Сборка для production
npm run start         # Запуск production версии
npm run migration:run # Выполнить миграции
npm run migration:revert # Откатить последнюю миграцию
npm run seed          # Заполнить БД тестовыми данными
npm run lint          # Проверка кода ESLint
npm run lint:fix      # Автоисправление ESLint
npm run format        # Форматирование кода Prettier
npm test              # Запуск тестов
```

### Frontend

```bash
npm run dev           # Запуск в режиме разработки
npm run build         # Сборка для production
npm run preview       # Предпросмотр production сборки
npm run lint          # Проверка кода ESLint
npm run lint:fix      # Автоисправление ESLint
npm run format        # Форматирование кода Prettier
npm test              # Запуск тестов
```

---

## 🔍 Проверка работоспособности

### 1. Проверка Backend

```bash
curl http://localhost:3000/api/health
```

Должен вернуть:
```json
{
  "success": true,
  "message": "API работает нормально",
  "timestamp": "...",
  "uptime": ...
}
```

### 2. Проверка Frontend

Откройте http://localhost:5173 в браузере. Должна открыться страница входа.

### 3. Проверка базы данных

```bash
# Подключиться к PostgreSQL
psql -h localhost -U gymnastics_user -d gymnastics_db

# Проверить таблицы
\dt
```

---

## 🐛 Решение проблем

### Backend не запускается

1. Проверьте, что PostgreSQL запущен
2. Проверьте переменные окружения в `backend/.env`
3. Убедитесь, что порт 3000 свободен

### Frontend не запускается

1. Проверьте, что Backend запущен на порту 3000
2. Убедитесь, что порт 5173 свободен
3. Проверьте `frontend/.env` - VITE_API_BASE_URL должен указывать на http://localhost:3000/api

### Ошибки миграций

```bash
# Откатить все миграции и выполнить заново
npm run migration:revert
npm run migration:run
```

### Очистка данных Docker

```bash
# Остановить и удалить все контейнеры, сети и volumes
docker-compose down -v

# Запустить заново
docker-compose up -d
```

---

## 📚 Дополнительная информация

- **Документация проекта**: См. README.md
- **План разработки**: См. ПЛАН_РАЗРАБОТКИ.md
- **Функциональная спецификация**: См. ФУНКЦИОНАЛЬНАЯ_СПЕЦИФИКАЦИЯ.md
- **Прогресс разработки**: См. DEVELOPMENT_PROGRESS.md
- **Схема базы данных**: См. database/DATABASE_SCHEMA.md

---

## 🆘 Поддержка

Если у вас возникли проблемы:

1. Проверьте логи: `docker-compose logs` или логи в `backend/logs/`
2. Убедитесь, что все зависимости установлены
3. Проверьте версии Node.js и npm
4. Убедитесь, что все порты свободны (3000, 5173, 5432, 6379)

---

## ✅ Чек-лист успешной установки

- [ ] Node.js >=18.0.0 установлен
- [ ] PostgreSQL запущен
- [ ] Backend переменные окружения настроены
- [ ] Backend зависимости установлены (`npm install`)
- [ ] Миграции выполнены (`npm run migration:run`)
- [ ] Backend запущен (`npm run dev`)
- [ ] Backend health check работает (http://localhost:3000/api/health)
- [ ] Frontend зависимости установлены
- [ ] Frontend запущен (`npm run dev`)
- [ ] Можно войти через тестового пользователя
- [ ] Все страницы открываются без ошибок

---

**Версия проекта**: 0.1.0
**Дата последнего обновления**: 18.11.2025
**Статус**: Stage 4 (80% завершено) - User Interface Main Pages
