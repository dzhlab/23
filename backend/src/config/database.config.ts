import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables
config();

/**
 * Конфигурация подключения к базе данных PostgreSQL
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || '5432', 10),
  username: process.env['DB_USER'] || 'gymnastics_user',
  password: process.env['DB_PASSWORD'] || 'gymnastics_password',
  database: process.env['DB_NAME'] || 'gymnastics_db',
  synchronize: process.env['DB_SYNCHRONIZE'] === 'true',
  logging: process.env['DB_LOGGING'] === 'true',
  entities: [path.join(__dirname, '../entities/**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '../migrations/**/*.{ts,js}')],
  subscribers: [],
  ssl: process.env['DB_SSL'] === 'true' ? { rejectUnauthorized: false } : false,
  extra: {
    max: 20, // Максимальное количество подключений в пуле
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  },
});

/**
 * Инициализация подключения к базе данных
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ База данных успешно подключена');
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error);
    throw error;
  }
};

/**
 * Закрытие подключения к базе данных
 */
export const closeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.destroy();
    console.log('✅ Подключение к базе данных закрыто');
  } catch (error) {
    console.error('❌ Ошибка при закрытии подключения:', error);
    throw error;
  }
};
