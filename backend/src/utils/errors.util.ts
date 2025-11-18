/**
 * Файл: utils/errors.util.ts
 * Описание: Кастомные классы ошибок и централизованная обработка ошибок
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: express
 */

// Импорт типов Express для middleware
// Import Express types for middleware
import { Request, Response, NextFunction } from 'express';

/**
 * Базовый класс для всех кастомных ошибок приложения
 * Base class for all custom application errors
 */
export class AppError extends Error {
  // HTTP статус код / HTTP status code
  public statusCode: number;

  // Код ошибки для клиента / Error code for client
  public errorCode: string;

  // Флаг операционной ошибки (безопасно показывать клиенту) / Operational error flag
  public isOperational: boolean;

  /**
   * Конструктор класса AppError
   * AppError class constructor
   *
   * @param message - сообщение об ошибке / error message
   * @param statusCode - HTTP статус код / HTTP status code
   * @param errorCode - код ошибки / error code
   * @param isOperational - операционная ли ошибка / is operational error
   */
  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = 'INTERNAL_ERROR',
    isOperational: boolean = true
  ) {
    // Вызываем конструктор родительского класса Error
    // Call parent Error class constructor
    super(message);

    // Устанавливаем имя ошибки
    // Set error name
    this.name = this.constructor.name;

    // Устанавливаем статус код
    // Set status code
    this.statusCode = statusCode;

    // Устанавливаем код ошибки
    // Set error code
    this.errorCode = errorCode;

    // Устанавливаем флаг операционной ошибки
    // Set operational flag
    this.isOperational = isOperational;

    // Захватываем stack trace
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Ошибка валидации (400 Bad Request)
 * Validation error (400 Bad Request)
 */
export class ValidationError extends AppError {
  // Детали ошибок валидации / Validation error details
  public details?: any;

  /**
   * Конструктор ValidationError
   * ValidationError constructor
   *
   * @param message - сообщение об ошибке / error message
   * @param details - детали ошибок / error details
   */
  constructor(message: string = 'Ошибка валидации данных', details?: any) {
    // Вызываем конструктор родительского класса
    // Call parent class constructor
    super(message, 400, 'VALIDATION_ERROR', true);

    // Сохраняем детали ошибок
    // Save error details
    this.details = details;
  }
}

/**
 * Ошибка аутентификации (401 Unauthorized)
 * Authentication error (401 Unauthorized)
 */
export class AuthenticationError extends AppError {
  /**
   * Конструктор AuthenticationError
   * AuthenticationError constructor
   *
   * @param message - сообщение об ошибке / error message
   * @param errorCode - код ошибки / error code
   */
  constructor(
    message: string = 'Требуется аутентификация',
    errorCode: string = 'AUTHENTICATION_REQUIRED'
  ) {
    // Вызываем конструктор родительского класса
    // Call parent class constructor
    super(message, 401, errorCode, true);
  }
}

/**
 * Ошибка авторизации (403 Forbidden)
 * Authorization error (403 Forbidden)
 */
export class AuthorizationError extends AppError {
  /**
   * Конструктор AuthorizationError
   * AuthorizationError constructor
   *
   * @param message - сообщение об ошибке / error message
   * @param errorCode - код ошибки / error code
   */
  constructor(
    message: string = 'Недостаточно прав для выполнения этой операции',
    errorCode: string = 'FORBIDDEN'
  ) {
    // Вызываем конструктор родительского класса
    // Call parent class constructor
    super(message, 403, errorCode, true);
  }
}

/**
 * Ошибка "не найдено" (404 Not Found)
 * Not found error (404 Not Found)
 */
export class NotFoundError extends AppError {
  /**
   * Конструктор NotFoundError
   * NotFoundError constructor
   *
   * @param resource - название ресурса / resource name
   * @param identifier - идентификатор / identifier
   */
  constructor(resource: string = 'Ресурс', identifier?: string) {
    // Формируем сообщение об ошибке
    // Form error message
    const message = identifier
      ? `${resource} с идентификатором "${identifier}" не найден`
      : `${resource} не найден`;

    // Вызываем конструктор родительского класса
    // Call parent class constructor
    super(message, 404, 'NOT_FOUND', true);
  }
}

/**
 * Ошибка конфликта (409 Conflict)
 * Conflict error (409 Conflict)
 * Используется когда ресурс уже существует / Used when resource already exists
 */
export class ConflictError extends AppError {
  /**
   * Конструктор ConflictError
   * ConflictError constructor
   *
   * @param message - сообщение об ошибке / error message
   * @param errorCode - код ошибки / error code
   */
  constructor(
    message: string = 'Конфликт данных',
    errorCode: string = 'CONFLICT'
  ) {
    // Вызываем конструктор родительского класса
    // Call parent class constructor
    super(message, 409, errorCode, true);
  }
}

/**
 * Ошибка бизнес-логики (422 Unprocessable Entity)
 * Business logic error (422 Unprocessable Entity)
 */
export class BusinessLogicError extends AppError {
  /**
   * Конструктор BusinessLogicError
   * BusinessLogicError constructor
   *
   * @param message - сообщение об ошибке / error message
   * @param errorCode - код ошибки / error code
   */
  constructor(
    message: string = 'Ошибка бизнес-логики',
    errorCode: string = 'BUSINESS_LOGIC_ERROR'
  ) {
    // Вызываем конструктор родительского класса
    // Call parent class constructor
    super(message, 422, errorCode, true);
  }
}

/**
 * Ошибка базы данных (500 Internal Server Error)
 * Database error (500 Internal Server Error)
 */
export class DatabaseError extends AppError {
  /**
   * Конструктор DatabaseError
   * DatabaseError constructor
   *
   * @param message - сообщение об ошибке / error message
   * @param originalError - оригинальная ошибка БД / original DB error
   */
  constructor(message: string = 'Ошибка базы данных', originalError?: Error) {
    // Вызываем конструктор родительского класса
    // Call parent class constructor
    super(message, 500, 'DATABASE_ERROR', true);

    // Если есть оригинальная ошибка, логируем ее
    // If there's original error, log it
    if (originalError) {
      console.error('Оригинальная ошибка БД:', originalError);
    }
  }
}

/**
 * Middleware для глобальной обработки ошибок
 * Middleware for global error handling
 * Должен быть последним middleware в цепочке / Should be last middleware in chain
 *
 * @param err - объект ошибки / error object
 * @param req - Express request / Express request
 * @param res - Express response / Express response
 * @param next - Express next function / Express next function
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Логируем ошибку в консоль
  // Log error to console
  console.error('=== Ошибка ===');
  console.error('Путь:', req.method, req.path);
  console.error('Сообщение:', err.message);
  console.error('Stack:', err.stack);
  console.error('=============');

  // Проверяем, является ли ошибка нашей кастомной ошибкой
  // Check if error is our custom error
  if (err instanceof AppError) {
    // Отправляем структурированный ответ клиенту
    // Send structured response to client
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      // Если это ValidationError с деталями, добавляем их
      // If it's ValidationError with details, add them
      ...(err instanceof ValidationError && err.details && { details: err.details }),
      // В режиме разработки добавляем stack trace
      // In development mode add stack trace
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
    return;
  }

  // Обработка ошибок TypeORM
  // Handle TypeORM errors
  if (err.name === 'QueryFailedError') {
    // Ошибка SQL запроса
    // SQL query error
    res.status(500).json({
      success: false,
      message: 'Ошибка при выполнении запроса к базе данных',
      errorCode: 'DATABASE_QUERY_ERROR',
      ...(process.env.NODE_ENV === 'development' && {
        details: err.message,
        stack: err.stack
      })
    });
    return;
  }

  // Обработка ошибок валидации TypeORM
  // Handle TypeORM validation errors
  if (err.name === 'EntityNotFoundError') {
    // Сущность не найдена
    // Entity not found
    res.status(404).json({
      success: false,
      message: 'Запрашиваемый ресурс не найден',
      errorCode: 'NOT_FOUND',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
    return;
  }

  // Обработка ошибок уникальности (дубликаты)
  // Handle uniqueness errors (duplicates)
  if (err.message && err.message.includes('duplicate key')) {
    // Нарушение уникальности
    // Uniqueness violation
    res.status(409).json({
      success: false,
      message: 'Запись с такими данными уже существует',
      errorCode: 'DUPLICATE_ENTRY',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
    return;
  }

  // Обработка синтаксических ошибок JSON
  // Handle JSON syntax errors
  if (err instanceof SyntaxError && 'body' in err) {
    // Невалидный JSON в теле запроса
    // Invalid JSON in request body
    res.status(400).json({
      success: false,
      message: 'Невалидный JSON в теле запроса',
      errorCode: 'INVALID_JSON'
    });
    return;
  }

  // Для всех остальных ошибок возвращаем общий ответ
  // For all other errors return generic response
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
    errorCode: 'INTERNAL_SERVER_ERROR',
    // В режиме разработки показываем детали
    // In development mode show details
    ...(process.env.NODE_ENV === 'development' && {
      details: err.message,
      stack: err.stack
    })
  });
};

/**
 * Middleware для обработки несуществующих маршрутов (404)
 * Middleware for handling non-existent routes (404)
 *
 * @param req - Express request / Express request
 * @param res - Express response / Express response
 * @param next - Express next function / Express next function
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Создаем ошибку "не найдено"
  // Create not found error
  const error = new NotFoundError('Маршрут', req.path);

  // Передаем ошибку в обработчик ошибок
  // Pass error to error handler
  next(error);
};

/**
 * Обертка для async функций контроллеров
 * Wrapper for async controller functions
 * Автоматически ловит ошибки и передает их в error handler
 * Automatically catches errors and passes them to error handler
 *
 * @param fn - async функция контроллера / async controller function
 * @returns Express middleware / Express middleware
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  // Возвращаем middleware функцию
  // Return middleware function
  return (req: Request, res: Response, next: NextFunction) => {
    // Вызываем async функцию и ловим ошибки
    // Call async function and catch errors
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * ТЕСТЫ для errors.util.ts
 *
 * Тест 1: AppError создается с правильными параметрами
 * - Создать new AppError('Test error', 400, 'TEST_ERROR')
 * - Проверить message === 'Test error'
 * - Проверить statusCode === 400
 * - Проверить errorCode === 'TEST_ERROR'
 * - Проверить isOperational === true
 *
 * Тест 2: ValidationError устанавливает статус 400
 * - Создать new ValidationError('Invalid data')
 * - Проверить statusCode === 400
 * - Проверить errorCode === 'VALIDATION_ERROR'
 *
 * Тест 3: ValidationError сохраняет детали
 * - Создать new ValidationError('Invalid', { field: 'email' })
 * - Проверить details.field === 'email'
 *
 * Тест 4: AuthenticationError устанавливает статус 401
 * - Создать new AuthenticationError()
 * - Проверить statusCode === 401
 * - Проверить errorCode === 'AUTHENTICATION_REQUIRED'
 *
 * Тест 5: AuthorizationError устанавливает статус 403
 * - Создать new AuthorizationError()
 * - Проверить statusCode === 403
 * - Проверить errorCode === 'FORBIDDEN'
 *
 * Тест 6: NotFoundError формирует правильное сообщение
 * - Создать new NotFoundError('User', '123')
 * - Проверить message.includes('User')
 * - Проверить message.includes('123')
 * - Проверить statusCode === 404
 *
 * Тест 7: ConflictError устанавливает статус 409
 * - Создать new ConflictError('Duplicate entry')
 * - Проверить statusCode === 409
 * - Проверить errorCode === 'CONFLICT'
 *
 * Тест 8: BusinessLogicError устанавливает статус 422
 * - Создать new BusinessLogicError()
 * - Проверить statusCode === 422
 *
 * Тест 9: errorHandler обрабатывает AppError
 * - Создать mock req, res, next
 * - Создать AppError с statusCode 400
 * - Вызвать errorHandler(error, req, res, next)
 * - Проверить res.status вызван с 400
 * - Проверить res.json содержит success: false, message, errorCode
 *
 * Тест 10: errorHandler обрабатывает ValidationError с деталями
 * - Создать ValidationError с details
 * - Вызвать errorHandler
 * - Проверить res.json содержит поле details
 *
 * Тест 11: errorHandler обрабатывает обычные Error как 500
 * - Создать new Error('Something went wrong')
 * - Вызвать errorHandler
 * - Проверить res.status вызван с 500
 * - Проверить errorCode === 'INTERNAL_SERVER_ERROR'
 *
 * Тест 12: errorHandler добавляет stack в development режиме
 * - Установить process.env.NODE_ENV = 'development'
 * - Создать ошибку
 * - Вызвать errorHandler
 * - Проверить наличие поля stack в ответе
 *
 * Тест 13: notFoundHandler создает NotFoundError
 * - Создать mock req с path = '/nonexistent'
 * - Вызвать notFoundHandler
 * - Проверить, что next() вызван с NotFoundError
 *
 * Тест 14: asyncHandler ловит ошибки из async функций
 * - Создать async функцию, которая выбрасывает ошибку
 * - Обернуть в asyncHandler
 * - Вызвать обернутую функцию
 * - Проверить, что next() вызван с ошибкой
 *
 * Тест 15: asyncHandler не вызывает next если нет ошибок
 * - Создать async функцию, которая возвращает успех
 * - Обернуть в asyncHandler
 * - Вызвать обернутую функцию
 * - Проверить, что next() НЕ вызван
 */
