import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.util';

/**
 * Middleware для обработки ошибок
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
      timestamp: new Date(),
    });
    return;
  }

  // Неизвестная ошибка
  console.error('Неизвестная ошибка:', err);
  res.status(500).json({
    success: false,
    error: {
      message: 'Внутренняя ошибка сервера',
      code: 'INTERNAL_SERVER_ERROR',
    },
    timestamp: new Date(),
  });
};
