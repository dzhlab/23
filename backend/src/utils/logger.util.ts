/**
 * Файл: utils/logger.util.ts
 * Описание: Система логирования с использованием Winston
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: winston, winston-daily-rotate-file
 */

// Импорт Winston для логирования
// Import Winston for logging
import winston from 'winston';

// Импорт path для работы с путями
// Import path for path operations
import path from 'path';

/**
 * Уровни логирования
 * Logging levels
 */
const levels = {
  error: 0,   // Ошибки / Errors
  warn: 1,    // Предупреждения / Warnings
  info: 2,    // Информация / Information
  http: 3,    // HTTP запросы / HTTP requests
  debug: 4    // Отладка / Debug
};

/**
 * Цвета для уровней логирования в консоли
 * Colors for logging levels in console
 */
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

// Добавляем цвета в winston
// Add colors to winston
winston.addColors(colors);

/**
 * Определяем уровень логирования в зависимости от окружения
 * Determine logging level based on environment
 */
const level = (): string => {
  // Получаем окружение из переменной среды
  // Get environment from environment variable
  const env = process.env.NODE_ENV || 'development';

  // В development показываем debug, в production только info
  // In development show debug, in production only info
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

/**
 * Формат для логов в файлы (JSON)
 * Format for file logs (JSON)
 */
const fileFormat = winston.format.combine(
  // Добавляем timestamp / Add timestamp
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  // Добавляем информацию об ошибках / Add error information
  winston.format.errors({ stack: true }),
  // Форматируем в JSON / Format as JSON
  winston.format.json()
);

/**
 * Формат для консоли (цветной, читаемый)
 * Format for console (colored, readable)
 */
const consoleFormat = winston.format.combine(
  // Добавляем timestamp / Add timestamp
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  // Добавляем цвета / Add colors
  winston.format.colorize({ all: true }),
  // Форматируем для читаемости / Format for readability
  winston.format.printf((info) => {
    // Формируем строку лога
    // Form log string
    const { timestamp, level, message, ...meta } = info;

    // Базовое сообщение с timestamp и level
    // Basic message with timestamp and level
    let log = `${timestamp} [${level}]: ${message}`;

    // Если есть дополнительные данные, добавляем их
    // If there are additional data, add them
    if (Object.keys(meta).length > 0) {
      // Удаляем служебные поля winston
      // Remove winston service fields
      const { splat, ...cleanMeta } = meta;

      // Если остались данные, добавляем их в JSON формате
      // If data remains, add them in JSON format
      if (Object.keys(cleanMeta).length > 0) {
        log += `\n${JSON.stringify(cleanMeta, null, 2)}`;
      }
    }

    return log;
  })
);

/**
 * Transports (куда сохранять логи)
 * Transports (where to save logs)
 */
const transports: winston.transport[] = [
  // Консоль (только в development)
  // Console (only in development)
  ...(process.env.NODE_ENV !== 'production'
    ? [
        new winston.transports.Console({
          format: consoleFormat
        })
      ]
    : []),

  // Файл для всех логов
  // File for all logs
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'combined.log'),
    format: fileFormat,
    maxsize: 10485760, // 10MB
    maxFiles: 10
  }),

  // Отдельный файл для ошибок
  // Separate file for errors
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'error.log'),
    level: 'error',
    format: fileFormat,
    maxsize: 10485760, // 10MB
    maxFiles: 10
  })
];

/**
 * Создание экземпляра logger
 * Create logger instance
 */
export const logger = winston.createLogger({
  // Уровень логирования / Logging level
  level: level(),

  // Уровни логирования / Logging levels
  levels,

  // Transports (куда писать) / Transports (where to write)
  transports,

  // Не выходить при ошибке / Don't exit on error
  exitOnError: false
});

/**
 * Stream для Morgan (HTTP логирование)
 * Stream for Morgan (HTTP logging)
 */
export const morganStream = {
  /**
   * Метод write для интеграции с Morgan
   * Write method for Morgan integration
   */
  write: (message: string) => {
    // Убираем перенос строки в конце
    // Remove newline at the end
    logger.http(message.trim());
  }
};

/**
 * Вспомогательные функции для логирования
 * Helper functions for logging
 */

/**
 * Логирование ошибки
 * Log error
 */
export const logError = (message: string, error?: Error | any, meta?: any): void => {
  // Формируем объект для логирования
  // Form object for logging
  const logObject: any = {
    message,
    ...(meta && { meta })
  };

  // Если передана ошибка, добавляем ее детали
  // If error is passed, add its details
  if (error) {
    logObject.error = {
      message: error.message,
      stack: error.stack,
      ...(error.code && { code: error.code })
    };
  }

  // Логируем
  // Log
  logger.error(logObject);
};

/**
 * Логирование предупреждения
 * Log warning
 */
export const logWarn = (message: string, meta?: any): void => {
  logger.warn(message, meta);
};

/**
 * Логирование информации
 * Log info
 */
export const logInfo = (message: string, meta?: any): void => {
  logger.info(message, meta);
};

/**
 * Логирование HTTP запроса
 * Log HTTP request
 */
export const logHttp = (message: string, meta?: any): void => {
  logger.http(message, meta);
};

/**
 * Логирование отладочной информации
 * Log debug information
 */
export const logDebug = (message: string, meta?: any): void => {
  logger.debug(message, meta);
};

/**
 * Middleware для логирования запросов
 * Middleware for logging requests
 */
export const requestLogger = (req: any, res: any, next: any): void => {
  // Сохраняем время начала запроса
  // Save request start time
  const startTime = Date.now();

  // Когда ответ завершен, логируем
  // When response is finished, log
  res.on('finish', () => {
    // Вычисляем время обработки
    // Calculate processing time
    const duration = Date.now() - startTime;

    // Логируем запрос
    // Log request
    logger.http('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });

  // Передаем управление дальше
  // Pass control to next middleware
  next();
};

/**
 * Экспорт по умолчанию
 * Default export
 */
export default logger;

/**
 * ТЕСТЫ для logger.util.ts
 *
 * Тест 1: logger создан успешно
 * - Проверить, что logger определен
 * - Проверить, что logger.info является функцией
 *
 * Тест 2: logger.info записывает в файл
 * - Вызвать logger.info('Test message')
 * - Проверить, что файл logs/combined.log создан
 * - Проверить, что сообщение есть в файле
 *
 * Тест 3: logger.error записывает в error.log
 * - Вызвать logger.error('Error message')
 * - Проверить, что файл logs/error.log создан
 * - Проверить, что сообщение есть в файле
 *
 * Тест 4: logError форматирует ошибку правильно
 * - Создать Error с message и stack
 * - Вызвать logError('Test', error)
 * - Проверить, что в логе есть message, stack
 *
 * Тест 5: logWarn записывает с уровнем warn
 * - Вызвать logWarn('Warning message')
 * - Проверить уровень в логе === 'warn'
 *
 * Тест 6: logInfo записывает с уровнем info
 * - Вызвать logInfo('Info message')
 * - Проверить уровень в логе === 'info'
 *
 * Тест 7: logDebug записывает только в development
 * - Установить NODE_ENV = 'production'
 * - Вызвать logDebug('Debug message')
 * - Проверить, что сообщение НЕ записано
 *
 * Тест 8: morganStream.write интегрируется с Morgan
 * - Вызвать morganStream.write('GET /api/users 200')
 * - Проверить, что сообщение залогировано с уровнем 'http'
 *
 * Тест 9: requestLogger middleware логирует запросы
 * - Создать mock req, res, next
 * - Вызвать requestLogger(req, res, next)
 * - Эмулировать res.on('finish')
 * - Проверить, что запрос залогирован
 *
 * Тест 10: logger не выходит при ошибке
 * - Проверить logger.exitOnError === false
 *
 * Тест 11: консольный вывод только в development
 * - Установить NODE_ENV = 'production'
 * - Проверить, что консоль НЕ в списке transports
 *
 * Тест 12: timestamp добавляется к логам
 * - Вызвать logger.info('Test')
 * - Проверить наличие поля timestamp в логе
 */
