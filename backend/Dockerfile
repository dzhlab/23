# Файл: Dockerfile
# Описание: Docker образ для backend приложения
# Автор: Claude Code
# Дата создания: 18.11.2025
# Последнее изменение: 18.11.2025

# Используем официальный образ Node.js версии 18 на основе Alpine Linux
# Alpine выбран для минимального размера образа
FROM node:18-alpine AS base

# Установка дополнительных системных пакетов
# python3 и make нужны для сборки некоторых native модулей npm
RUN apk add --no-cache python3 make g++ curl

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы package.json и package-lock.json
# Копируем отдельно для использования Docker layer caching
COPY package*.json ./

# ===== DEVELOPMENT STAGE =====
# Стадия для development окружения
FROM base AS development

# Устанавливаем все зависимости (включая devDependencies)
RUN npm ci

# Копируем весь исходный код
COPY . .

# Открываем порт 3000 для REST API
EXPOSE 3000

# Открываем порт 3001 для WebSocket
EXPOSE 3001

# Команда запуска в development режиме с hot reload
CMD ["npm", "run", "dev"]

# ===== BUILD STAGE =====
# Стадия для сборки production версии
FROM base AS build

# Устанавливаем все зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Компилируем TypeScript в JavaScript
RUN npm run build

# Удаляем devDependencies для уменьшения размера
RUN npm prune --production

# ===== PRODUCTION STAGE =====
# Финальная стадия для production
FROM node:18-alpine AS production

# Устанавливаем curl для health checks
RUN apk add --no-cache curl

# Создаем непривилегированного пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json из build стадии
COPY --from=build /app/package*.json ./

# Копируем production зависимости из build стадии
COPY --from=build /app/node_modules ./node_modules

# Копируем скомпилированный код из build стадии
COPY --from=build /app/dist ./dist

# Создаем директории для данных
RUN mkdir -p logs backups uploads && \
    chown -R nodejs:nodejs /app

# Переключаемся на непривилегированного пользователя
USER nodejs

# Открываем порты
EXPOSE 3000
EXPOSE 3001

# Health check для проверки работоспособности контейнера
# Проверяется каждые 30 секунд
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Команда запуска приложения
CMD ["node", "dist/index.js"]
