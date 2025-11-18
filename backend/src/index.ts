/**
 * Файл: index.ts
 * Описание: Главный файл приложения - точка входа для backend сервера
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: express, dotenv, cors
 */

// Импорт библиотеки для загрузки переменных окружения
import dotenv from 'dotenv';

// Импорт основного фреймворка Express
import express, { Application, Request, Response, NextFunction } from 'express';

// Импорт middleware для CORS (Cross-Origin Resource Sharing)
import cors from 'cors';

// Импорт middleware для безопасности HTTP заголовков
import helmet from 'helmet';

// Импорт middleware для сжатия ответов
import compression from 'compression';

// Импорт middleware для логирования HTTP запросов
import morgan from 'morgan';

// Импорт системы логирования
// Import logging system
import { logger, morganStream } from './utils/logger.util';

// Загрузка переменных окружения из файла .env
dotenv.config();

// Интерфейс для расширения типа Error с дополнительными полями
interface AppError extends Error {
  status?: number;  // HTTP статус код ошибки
  code?: string;    // Внутренний код ошибки
}

/**
 * Класс для управления backend сервером
 * Инкапсулирует всю логику инициализации и запуска приложения
 */
class Server {
  // Экземпляр Express приложения
  private app: Application;

  // Порт для запуска сервера
  private port: number;

  /**
   * Конструктор класса Server
   * Инициализирует Express приложение и настраивает middleware
   */
  constructor() {
    // Создание экземпляра Express приложения
    this.app = express();

    // Получение порта из переменных окружения или использование 3000 по умолчанию
    this.port = parseInt(process.env.PORT || '3000', 10);

    // Вызов метода инициализации middleware
    this.initializeMiddlewares();

    // Вызов метода инициализации маршрутов
    this.initializeRoutes();

    // Вызов метода инициализации обработчиков ошибок
    this.initializeErrorHandlers();
  }

  /**
   * Метод инициализации middleware
   * Настраивает промежуточное ПО для обработки запросов
   */
  private initializeMiddlewares(): void {
    // Middleware для установки безопасных HTTP заголовков
    this.app.use(helmet());

    // Middleware для включения CORS
    // Позволяет frontend приложению делать запросы к backend
    this.app.use(cors({
      // Разрешенные источники запросов (из переменных окружения)
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],

      // Разрешенные HTTP методы
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],

      // Разрешить отправку credentials (cookies, authorization headers)
      credentials: true
    }));

    // Middleware для сжатия HTTP ответов (gzip)
    this.app.use(compression());

    // Middleware для логирования HTTP запросов
    // HTTP request logging middleware
    // Интеграция Morgan с Winston logger
    // Morgan integration with Winston logger
    this.app.use(
      morgan(
        // Формат логирования: метод URL статус время размер
        // Logging format: method URL status time size
        ':method :url :status :res[content-length] - :response-time ms',
        {
          // Используем stream нашего логгера
          // Use our logger stream
          stream: morganStream
        }
      )
    );

    // Middleware для парсинга JSON тела запроса
    // Лимит размера - 10MB
    this.app.use(express.json({ limit: '10mb' }));

    // Middleware для парсинга URL-encoded тела запроса
    // extended: true позволяет парсить сложные объекты
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Middleware для обслуживания статических файлов из папки public
    this.app.use(express.static('public'));
  }

  /**
   * Метод инициализации маршрутов
   * Регистрирует все API endpoints приложения
   */
  private initializeRoutes(): void {
    // Импорт всех API роутов
    // Import all API routes
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const apiRoutes = require('./routes/index').default;

    // Базовый маршрут для проверки работоспособности сервера
    // GET /
    this.app.get('/', (req: Request, res: Response) => {
      // Отправка JSON ответа с информацией о сервере
      res.json({
        message: 'Gymnastics Competition Management System API',  // Название сервиса
        version: '1.0.0',  // Версия API
        status: 'running',  // Статус сервера
        timestamp: new Date().toISOString()  // Текущее время в формате ISO
      });
    });

    // Health check endpoint для мониторинга
    // GET /health
    this.app.get('/health', (req: Request, res: Response) => {
      // Отправка статуса 200 OK
      res.status(200).json({
        status: 'healthy',  // Статус здоровья сервера
        uptime: process.uptime(),  // Время работы процесса в секундах
        timestamp: new Date().toISOString()  // Текущее время
      });
    });

    // Монтирование всех API роутов с префиксом /api
    // Mount all API routes with /api prefix
    // Все маршруты из routes/index.ts будут доступны по адресу /api/*
    // All routes from routes/index.ts will be available at /api/*
    this.app.use('/api', apiRoutes);

    // TODO: Будущие роуты / Future routes:
    // - /api/athletes - управление спортсменами
    // - /api/performances - управление выступлениями
    // - /api/scores - управление оценками
    // - /api/judges - назначение судей
    // - /api/reports - генерация отчетов
  }

  /**
   * Метод инициализации обработчиков ошибок
   * Настраивает middleware для обработки ошибок и несуществующих маршрутов
   */
  private initializeErrorHandlers(): void {
    // Импорт обработчиков ошибок из utils
    // Import error handlers from utils
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { notFoundHandler, errorHandler } = require('./utils/errors.util');

    // Обработчик несуществующих маршрутов (404)
    // Handler for non-existent routes (404)
    // Этот middleware срабатывает, если ни один маршрут не совпал
    // This middleware triggers if no route matched
    this.app.use(notFoundHandler);

    // Глобальный обработчик ошибок
    // Global error handler
    // Должен быть последним middleware в цепочке
    // Must be last middleware in chain
    // Принимает 4 параметра: error, request, response, next
    // Accepts 4 parameters: error, request, response, next
    this.app.use(errorHandler);
  }

  /**
   * Метод запуска сервера
   * Начинает прослушивание указанного порта
   */
  public start(): void {
    // Запуск HTTP сервера на указанном порту
    this.app.listen(this.port, () => {
      // Вывод сообщения о запуске сервера
      // Output server start message
      logger.info('='.repeat(50));
      logger.info('🚀 Сервер успешно запущен!');
      logger.info(`📡 Порт: ${this.port}`);
      logger.info(`🌍 Окружение: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 URL: http://localhost:${this.port}`);
      logger.info(`✅ Health check: http://localhost:${this.port}/health`);
      logger.info(`📝 Логи сохраняются в: ${process.cwd()}/logs/`);
      logger.info('='.repeat(50));
    });

    // Обработчик необработанных отклонений промисов
    // Unhandled rejection handler
    process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
      // Логирование информации об ошибке
      // Log error information
      logger.error('Необработанное отклонение промиса', {
        reason: reason.message,
        stack: reason.stack,
        promise: String(promise)
      });

      // В production режиме следует закрыть сервер
      // In production mode should close server
      if (process.env.NODE_ENV === 'production') {
        logger.error('Завершение работы сервера из-за необработанного отклонения промиса');
        process.exit(1);  // Выход с кодом ошибки
      }
    });

    // Обработчик необработанных исключений
    // Uncaught exception handler
    process.on('uncaughtException', (error: Error) => {
      // Логирование критической ошибки
      // Log critical error
      logger.error('Необработанное исключение', {
        message: error.message,
        stack: error.stack
      });

      // Немедленное завершение процесса
      // Immediate process termination
      process.exit(1);
    });

    // Обработчик сигнала SIGTERM (graceful shutdown)
    // SIGTERM signal handler (graceful shutdown)
    process.on('SIGTERM', () => {
      logger.warn('Получен сигнал SIGTERM. Корректное завершение работы...');

      // Здесь должна быть логика закрытия соединений с БД, WebSocket и т.д.
      // Here should be logic for closing DB connections, WebSocket, etc.
      // TODO: Добавить закрытие соединений перед выходом
      // TODO: Add connection closing before exit

      // Завершение процесса
      // Process termination
      logger.info('Сервер остановлен');
      process.exit(0);
    });

    // Обработчик сигнала SIGINT (Ctrl+C)
    // SIGINT signal handler (Ctrl+C)
    process.on('SIGINT', () => {
      logger.warn('\nПолучен сигнал SIGINT. Завершение работы...');

      // Здесь должна быть логика закрытия соединений
      // Here should be logic for closing connections
      // TODO: Добавить закрытие соединений перед выходом
      // TODO: Add connection closing before exit

      // Завершение процесса
      // Process termination
      logger.info('Сервер остановлен');
      process.exit(0);
    });
  }
}

// Создание экземпляра сервера
const server = new Server();

// Запуск сервера
server.start();

// Экспорт класса для использования в тестах
export default Server;

/**
 * ТЕСТЫ для index.ts
 *
 * Тест 1: Сервер должен запуститься на указанном порту
 * - Создать экземпляр Server
 * - Вызвать метод start()
 * - Проверить, что сервер слушает порт 3000
 *
 * Тест 2: GET / должен возвращать информацию о сервере
 * - Отправить GET запрос на /
 * - Проверить статус 200
 * - Проверить наличие полей message, version, status
 *
 * Тест 3: GET /health должен возвращать статус здоровья
 * - Отправить GET запрос на /health
 * - Проверить статус 200
 * - Проверить status === 'healthy'
 *
 * Тест 4: Несуществующий маршрут должен возвращать 404
 * - Отправить GET запрос на /nonexistent
 * - Проверить статус 404
 * - Проверить сообщение об ошибке
 *
 * Тест 5: CORS заголовки должны быть установлены
 * - Отправить OPTIONS запрос с Origin заголовком
 * - Проверить наличие Access-Control-Allow-Origin заголовка
 */
