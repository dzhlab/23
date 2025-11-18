/**
 * Файл: utils/jwt.util.ts
 * Описание: Утилиты для работы с JWT токенами
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: jsonwebtoken, types/user.types.ts
 */

// Импорт библиотеки jsonwebtoken для создания и проверки токенов
import jwt from 'jsonwebtoken';

// Импорт типов
import { JwtPayload } from '../types/user.types';
import { UserRole } from '../types/common.types';

/**
 * Получение секретного ключа для подписи токенов из переменных окружения
 * Если не указан, использует дефолтное значение (только для development!)
 */
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';

/**
 * Получение секретного ключа для refresh токенов
 * Отдельный ключ для дополнительной безопасности
 */
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

/**
 * Время жизни access токена (по умолчанию 15 минут)
 * Короткий срок для безопасности
 */
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';

/**
 * Время жизни refresh токена (по умолчанию 7 дней)
 * Длительный срок для удобства пользователя
 */
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Интерфейс данных для создания токена
 * Минимальная информация о пользователе
 */
export interface TokenData {
  // ID пользователя
  userId: string;
  // Email пользователя
  email: string;
  // Роль пользователя
  role: UserRole;
}

/**
 * Генерация access токена
 * Используется для аутентификации запросов к API
 * @param data - данные пользователя для включения в токен
 * @returns JWT токен в виде строки
 */
export const generateAccessToken = (data: TokenData): string => {
  // Создаем payload для токена
  const payload: JwtPayload = {
    userId: data.userId, // ID пользователя
    email: data.email, // Email для идентификации
    role: data.role, // Роль для проверки прав доступа
    iat: Math.floor(Date.now() / 1000), // Время выдачи (issued at)
    exp: 0 // Будет установлено jwt.sign автоматически
  };

  // Подписываем токен секретным ключом
  const token = jwt.sign(
    payload, // Данные для включения в токен
    JWT_SECRET, // Секретный ключ
    {
      expiresIn: JWT_ACCESS_EXPIRES_IN // Время жизни токена
    }
  );

  // Возвращаем подписанный токен
  return token;
};

/**
 * Генерация refresh токена
 * Используется для обновления access токена
 * @param data - данные пользователя
 * @returns JWT refresh токен
 */
export const generateRefreshToken = (data: TokenData): string => {
  // Создаем payload для refresh токена (можно включить меньше данных)
  const payload = {
    userId: data.userId, // Только ID достаточно для refresh
    iat: Math.floor(Date.now() / 1000) // Время выдачи
  };

  // Подписываем токен отдельным секретным ключом
  const token = jwt.sign(
    payload, // Минимальные данные
    JWT_REFRESH_SECRET, // Отдельный секретный ключ
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN // Длительный срок жизни
    }
  );

  // Возвращаем refresh токен
  return token;
};

/**
 * Проверка и декодирование access токена
 * @param token - JWT токен для проверки
 * @returns Декодированный payload или null если токен невалиден
 */
export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    // Пытаемся верифицировать и декодировать токен
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Возвращаем декодированные данные
    return decoded;
  } catch (error) {
    // Если токен невалиден или истек, возвращаем null
    // Возможные ошибки: TokenExpiredError, JsonWebTokenError, NotBeforeError
    return null;
  }
};

/**
 * Проверка и декодирование refresh токена
 * @param token - refresh токен для проверки
 * @returns Декодированный payload или null
 */
export const verifyRefreshToken = (token: string): { userId: string; iat: number } | null => {
  try {
    // Верифицируем refresh токен отдельным ключом
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string; iat: number };

    // Возвращаем декодированные данные
    return decoded;
  } catch (error) {
    // Если токен невалиден, возвращаем null
    return null;
  }
};

/**
 * Декодирование токена без проверки подписи
 * ВНИМАНИЕ: Использовать только для отладки! Не для production!
 * @param token - JWT токен
 * @returns Декодированный payload или null
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    // Декодируем токен без верификации
    const decoded = jwt.decode(token) as JwtPayload;

    // Возвращаем декодированные данные
    return decoded;
  } catch (error) {
    // Если не удалось декодировать, возвращаем null
    return null;
  }
};

/**
 * Извлечение токена из заголовка Authorization
 * Формат: "Bearer <token>"
 * @param authHeader - значение заголовка Authorization
 * @returns Извлеченный токен или null
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  // Проверяем, что заголовок существует
  if (!authHeader) {
    return null;
  }

  // Проверяем формат: должно начинаться с "Bearer "
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  // Извлекаем токен (все после "Bearer ")
  const token = authHeader.substring(7); // "Bearer ".length === 7

  // Возвращаем токен
  return token;
};

/**
 * Проверка истечения срока действия токена
 * @param token - JWT токен
 * @returns true если токен истек, false если еще действителен
 */
export const isTokenExpired = (token: string): boolean => {
  // Декодируем токен без проверки подписи
  const decoded = decodeToken(token);

  // Если не удалось декодировать, считаем истекшим
  if (!decoded || !decoded.exp) {
    return true;
  }

  // Получаем текущее время в секундах (UNIX timestamp)
  const currentTime = Math.floor(Date.now() / 1000);

  // Проверяем, истек ли токен
  return decoded.exp < currentTime;
};

/**
 * Получение времени до истечения токена в секундах
 * @param token - JWT токен
 * @returns Количество секунд до истечения или 0 если уже истек
 */
export const getTokenTimeToExpire = (token: string): number => {
  // Декодируем токен
  const decoded = decodeToken(token);

  // Если не удалось декодировать, возвращаем 0
  if (!decoded || !decoded.exp) {
    return 0;
  }

  // Получаем текущее время
  const currentTime = Math.floor(Date.now() / 1000);

  // Вычисляем разницу
  const timeToExpire = decoded.exp - currentTime;

  // Возвращаем 0 если уже истек, иначе оставшееся время
  return timeToExpire > 0 ? timeToExpire : 0;
};

/**
 * ТЕСТЫ для jwt.util.ts
 *
 * Тест 1: Генерация access токена
 * - Вызвать generateAccessToken({ userId: '123', email: 'test@example.com', role: UserRole.ADMIN })
 * - Проверить, что возвращается строка (токен)
 * - Декодировать токен и проверить payload
 *
 * Тест 2: Проверка access токена
 * - Создать токен
 * - Вызвать verifyAccessToken(token)
 * - Проверить, что возвращается правильный payload
 * - Попытаться проверить невалидный токен
 * - Ожидать null
 *
 * Тест 3: Генерация refresh токена
 * - Вызвать generateRefreshToken({ userId: '123', email: 'test@example.com', role: UserRole.ADMIN })
 * - Проверить, что токен создан
 * - Верифицировать через verifyRefreshToken
 *
 * Тест 4: Извлечение токена из заголовка
 * - Вызвать extractTokenFromHeader('Bearer abc123')
 * - Ожидать 'abc123'
 * - Вызвать с невалидным форматом
 * - Ожидать null
 *
 * Тест 5: Проверка истечения токена
 * - Создать токен с коротким сроком (1 секунда)
 * - Подождать 2 секунды
 * - Вызвать isTokenExpired(token)
 * - Ожидать true
 *
 * Тест 6: Время до истечения
 * - Создать токен с expiresIn: '1m'
 * - Вызвать getTokenTimeToExpire(token)
 * - Ожидать значение близкое к 60 секунд
 */
