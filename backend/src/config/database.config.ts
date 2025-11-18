/**
 * Файл: config/database.config.ts
 * Описание: Конфигурация подключения к базе данных PostgreSQL через TypeORM
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: typeorm, entities
 */

// Импорт DataSource из TypeORM
import { DataSource } from 'typeorm';

// Импорт dotenv для загрузки переменных окружения
import * as dotenv from 'dotenv';

// Импорт всех entities
import { entities } from '../entities';

// Загрузка переменных окружения из файла .env
dotenv.config();

/**
 * Конфигурация подключения к базе данных
 * Используется TypeORM DataSource API (новый подход с версии 0.3.x)
 */
export const AppDataSource = new DataSource({
  // Тип базы данных - PostgreSQL
  type: 'postgres',

  // Хост БД (из переменных окружения или по умолчанию localhost)
  host: process.env.DB_HOST || 'localhost',

  // Порт БД (из переменных окружения или по умолчанию 5432)
  port: parseInt(process.env.DB_PORT || '5432', 10),

  // Имя пользователя БД
  username: process.env.DB_USERNAME || 'postgres',

  // Пароль пользователя БД
  password: process.env.DB_PASSWORD || 'password',

  // Название базы данных
  database: process.env.DB_NAME || 'gymnastics_db',

  // Массив entities для работы с БД
  entities: entities,

  // Автоматическая синхронизация схемы БД с entities
  // ВАЖНО: в production должно быть false! Используйте миграции!
  synchronize: process.env.NODE_ENV === 'development',

  // Логирование SQL запросов
  // true - логировать все запросы
  // false - не логировать
  // ['query', 'error', 'schema'] - выборочное логирование
  logging: process.env.NODE_ENV === 'development' ? ['query', 'error', 'schema'] : ['error'],

  // Директория с миграциями
  migrations: ['src/migrations/**/*.ts'],

  // Директория для subscribers (слушатели событий Entity)
  subscribers: ['src/subscribers/**/*.ts'],

  // Дополнительные опции подключения
  extra: {
    // Максимальное количество подключений в пуле
    max: parseInt(process.env.DB_POOL_MAX || '10', 10),

    // Минимальное количество подключений в пуле
    min: parseInt(process.env.DB_POOL_MIN || '2', 10),

    // Время ожидания подключения (миллисекунды)
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000', 10),

    // Время жизни простаивающего подключения (миллисекунды)
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10)
  },

  // SSL конфигурация (для production)
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          // Не отклонять неавторизованные сертификаты
          rejectUnauthorized: false
        }
      : false,

  // Настройки кэширования запросов
  cache: {
    // Включить кэширование
    type: 'redis',

    // Опции для Redis
    options: {
      // Хост Redis
      host: process.env.REDIS_HOST || 'localhost',

      // Порт Redis
      port: parseInt(process.env.REDIS_PORT || '6379', 10),

      // База данных Redis (0-15)
      db: parseInt(process.env.REDIS_DB || '0', 10)
    },

    // Время жизни кэша (миллисекунды)
    duration: 60000 // 60 секунд
  }
});

/**
 * Функция инициализации подключения к БД
 * Вызывается при запуске приложения
 * @returns Promise<DataSource>
 */
export const initializeDatabase = async (): Promise<DataSource> => {
  try {
    // Логируем попытку подключения
    console.log('🔄 Подключение к базе данных...');

    // Инициализируем DataSource
    await AppDataSource.initialize();

    // Логируем успешное подключение
    console.log('✅ База данных успешно подключена!');
    console.log(`📊 База данных: ${process.env.DB_NAME}`);
    console.log(`🏠 Хост: ${process.env.DB_HOST}:${process.env.DB_PORT}`);

    // Возвращаем DataSource для использования в приложении
    return AppDataSource;
  } catch (error) {
    // Логируем ошибку подключения
    console.error('❌ Ошибка подключения к базе данных:', error);

    // Пробрасываем ошибку дальше
    throw error;
  }
};

/**
 * Функция закрытия подключения к БД
 * Вызывается при остановке приложения
 * @returns Promise<void>
 */
export const closeDatabase = async (): Promise<void> => {
  try {
    // Проверяем, инициализирован ли DataSource
    if (AppDataSource.isInitialized) {
      // Логируем попытку закрытия
      console.log('🔄 Закрытие подключения к базе данных...');

      // Закрываем подключение
      await AppDataSource.destroy();

      // Логируем успешное закрытие
      console.log('✅ Подключение к базе данных закрыто');
    }
  } catch (error) {
    // Логируем ошибку
    console.error('❌ Ошибка при закрытии подключения к БД:', error);

    // Пробрасываем ошибку
    throw error;
  }
};

/**
 * ТЕСТЫ для database.config.ts
 *
 * Тест 1: Инициализация подключения
 * - Вызвать initializeDatabase()
 * - Проверить, что AppDataSource.isInitialized === true
 * - Проверить, что подключение работает (выполнить простой запрос)
 *
 * Тест 2: Закрытие подключения
 * - Инициализировать подключение
 * - Вызвать closeDatabase()
 * - Проверить, что AppDataSource.isInitialized === false
 *
 * Тест 3: Проверка entities
 * - Проверить, что AppDataSource.options.entities содержит все entities
 * - Проверить, что количество entities соответствует ожидаемому
 *
 * Тест 4: Переменные окружения
 * - Установить тестовые переменные окружения
 * - Создать новый DataSource с тестовыми параметрами
 * - Проверить, что параметры применились корректно
 *
 * Тест 5: Обработка ошибок подключения
 * - Установить неправильные параметры подключения
 * - Попытаться инициализировать DataSource
 * - Ожидать выброс ошибки
 * - Проверить, что ошибка правильно обработана
 */
