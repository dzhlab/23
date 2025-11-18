import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from 'dotenv';
import { initializeDatabase } from './config/database.config';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

// Загрузка переменных окружения
config();

const app: Application = express();
const PORT = process.env['PORT'] || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env['CORS_ORIGIN'] || 'http://localhost:5173',
  credentials: true,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

// Запуск сервера
const startServer = async (): Promise<void> => {
  try {
    // Инициализация базы данных
    await initializeDatabase();

    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error);
    process.exit(1);
  }
};

// Обработка необработанных ошибок
process.on('unhandledRejection', (reason: Error) => {
  console.error('❌ Необработанное отклонение промиса:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  console.error('❌ Необработанное исключение:', error);
  process.exit(1);
});

// Запуск
startServer().catch((error) => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
});

export default app;
