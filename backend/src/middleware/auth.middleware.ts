/**
 * Файл: middleware/auth.middleware.ts
 * Описание: Middleware для аутентификации пользователей через JWT
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: express, utils/jwt.util.ts
 */

// Импорт типов Express
import { Request, Response, NextFunction } from 'express';

// Импорт утилит для работы с JWT
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt.util';

// Импорт типов
import { JwtPayload } from '../types/user.types';
import { UserRole } from '../types/common.types';

/**
 * Расширение интерфейса Request для добавления информации о пользователе
 * Позволяет сохранять данные из токена в объекте запроса
 */
declare global {
  namespace Express {
    interface Request {
      // Данные пользователя из JWT токена
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware для проверки аутентификации
 * Проверяет наличие и валидность JWT токена в заголовке Authorization
 * Если токен валиден, добавляет данные пользователя в req.user
 * Если токен невалиден или отсутствует, возвращает ошибку 401
 *
 * @param req - объект запроса Express
 * @param res - объект ответа Express
 * @param next - функция для передачи управления следующему middleware
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Получаем значение заголовка Authorization
    const authHeader = req.headers.authorization;

    // Извлекаем токен из заголовка (формат: "Bearer <token>")
    const token = extractTokenFromHeader(authHeader);

    // Проверяем, что токен был извлечен
    if (!token) {
      // Если токен отсутствует, возвращаем ошибку 401 Unauthorized
      res.status(401).json({
        success: false,
        message: 'Токен доступа не предоставлен',
        errorCode: 'NO_TOKEN'
      });
      return;
    }

    // Верифицируем и декодируем токен
    const decoded = verifyAccessToken(token);

    // Проверяем, что токен валиден
    if (!decoded) {
      // Если токен невалиден или истек, возвращаем ошибку 401
      res.status(401).json({
        success: false,
        message: 'Недействительный или истекший токен',
        errorCode: 'INVALID_TOKEN'
      });
      return;
    }

    // Сохраняем данные пользователя в объекте запроса
    req.user = decoded;

    // Передаем управление следующему middleware
    next();
  } catch (error) {
    // Логируем ошибку для отладки
    console.error('Ошибка в middleware аутентификации:', error);

    // Возвращаем ошибку 500 Internal Server Error
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера при проверке аутентификации',
      errorCode: 'AUTH_ERROR'
    });
  }
};

/**
 * Опциональная аутентификация
 * Проверяет токен если он есть, но не требует его наличия
 * Полезно для endpoints, которые работают по-разному для авторизованных и неавторизованных пользователей
 *
 * @param req - объект запроса
 * @param res - объект ответа
 * @param next - следующий middleware
 */
export const optionalAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Получаем заголовок Authorization
    const authHeader = req.headers.authorization;

    // Если заголовок отсутствует, просто продолжаем без аутентификации
    if (!authHeader) {
      next();
      return;
    }

    // Извлекаем токен
    const token = extractTokenFromHeader(authHeader);

    // Если токен есть, пытаемся его верифицировать
    if (token) {
      const decoded = verifyAccessToken(token);

      // Если токен валиден, сохраняем данные пользователя
      if (decoded) {
        req.user = decoded;
      }
    }

    // В любом случае продолжаем выполнение
    next();
  } catch (error) {
    // В случае ошибки просто продолжаем без аутентификации
    // Не блокируем запрос
    next();
  }
};

/**
 * ТЕСТЫ для auth.middleware.ts
 *
 * Тест 1: Успешная аутентификация
 * - Создать валидный JWT токен
 * - Отправить запрос с заголовком Authorization: Bearer <token>
 * - Вызвать middleware authenticate
 * - Проверить, что req.user заполнен правильными данными
 * - Проверить, что next() был вызван
 *
 * Тест 2: Отсутствие токена
 * - Отправить запрос без заголовка Authorization
 * - Вызвать middleware authenticate
 * - Проверить, что вернулся статус 401
 * - Проверить, что errorCode === 'NO_TOKEN'
 * - Проверить, что next() НЕ был вызван
 *
 * Тест 3: Невалидный токен
 * - Отправить запрос с невалидным токеном
 * - Вызвать middleware authenticate
 * - Проверить, что вернулся статус 401
 * - Проверить, что errorCode === 'INVALID_TOKEN'
 *
 * Тест 4: Истекший токен
 * - Создать токен с expiresIn: '1s'
 * - Подождать 2 секунды
 * - Отправить запрос с этим токеном
 * - Вызвать middleware authenticate
 * - Проверить, что вернулся статус 401
 *
 * Тест 5: Опциональная аутентификация с токеном
 * - Создать валидный токен
 * - Отправить запрос с токеном
 * - Вызвать middleware optionalAuthenticate
 * - Проверить, что req.user заполнен
 * - Проверить, что next() был вызван
 *
 * Тест 6: Опциональная аутентификация без токена
 * - Отправить запрос без токена
 * - Вызвать middleware optionalAuthenticate
 * - Проверить, что req.user === undefined
 * - Проверить, что next() был вызван (запрос не блокируется)
 */
