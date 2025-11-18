/**
 * Файл: types/api.types.ts
 * Описание: TypeScript типы для API запросов и ответов
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: Нет
 */

/**
 * Базовый успешный ответ API
 * Base API success response
 */
export interface ApiSuccessResponse<T = any> {
  // Флаг успеха / Success flag
  success: true;

  // Сообщение (опционально) / Message (optional)
  message?: string;

  // Данные ответа / Response data
  data: T;
}

/**
 * Базовый ответ с ошибкой API
 * Base API error response
 */
export interface ApiErrorResponse {
  // Флаг успеха (всегда false) / Success flag (always false)
  success: false;

  // Сообщение об ошибке / Error message
  message: string;

  // Код ошибки / Error code
  errorCode: string;

  // Детали ошибки (опционально) / Error details (optional)
  details?: any;

  // Stack trace (только в development) / Stack trace (development only)
  stack?: string;
}

/**
 * Объединенный тип ответа API
 * Combined API response type
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Параметры пагинации
 * Pagination parameters
 */
export interface PaginationParams {
  // Номер страницы (начиная с 1) / Page number (starting from 1)
  page?: number;

  // Количество элементов на странице / Items per page
  limit?: number;

  // Поле для сортировки / Sort field
  sortBy?: string;

  // Направление сортировки / Sort direction
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Результат с пагинацией
 * Paginated result
 */
export interface PaginatedResult<T> {
  // Массив данных / Data array
  items: T[];

  // Общее количество элементов / Total items count
  total: number;

  // Текущая страница / Current page
  page: number;

  // Количество элементов на странице / Items per page
  limit: number;

  // Общее количество страниц / Total pages count
  totalPages: number;

  // Есть ли следующая страница / Has next page
  hasNextPage: boolean;

  // Есть ли предыдущая страница / Has previous page
  hasPreviousPage: boolean;
}

/**
 * Перечисление кодов ошибок API
 * API error codes enumeration
 */
export enum ApiErrorCode {
  // Общие ошибки / General errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_JSON = 'INVALID_JSON',

  // Ошибки аутентификации / Authentication errors
  AUTHENTICATION_REQUIRED = 'AUTHENTICATION_REQUIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',

  // Ошибки авторизации / Authorization errors
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Ошибки ресурсов / Resource errors
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',

  // Ошибки бизнес-логики / Business logic errors
  BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR',

  // Ошибки базы данных / Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  DATABASE_QUERY_ERROR = 'DATABASE_QUERY_ERROR'
}

/**
 * HTTP методы
 * HTTP methods
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

/**
 * Конфигурация запроса API
 * API request configuration
 */
export interface ApiRequestConfig {
  // HTTP метод / HTTP method
  method: HttpMethod;

  // URL путь / URL path
  url: string;

  // Данные запроса (для POST, PUT, PATCH) / Request data (for POST, PUT, PATCH)
  data?: any;

  // Query параметры / Query parameters
  params?: Record<string, any>;

  // Заголовки / Headers
  headers?: Record<string, string>;

  // Требуется ли аутентификация / Requires authentication
  requiresAuth?: boolean;

  // Таймаут (мс) / Timeout (ms)
  timeout?: number;
}

/**
 * Токены аутентификации
 * Authentication tokens
 */
export interface AuthTokens {
  // Access токен / Access token
  accessToken: string;

  // Refresh токен / Refresh token
  refreshToken: string;
}

/**
 * Данные состояния загрузки
 * Loading state data
 */
export interface LoadingState {
  // Флаг загрузки / Loading flag
  isLoading: boolean;

  // Ошибка (если есть) / Error (if any)
  error: string | null;
}

/**
 * ТЕСТЫ для api.types.ts
 *
 * Тест 1: ApiSuccessResponse имеет правильную структуру
 * - success === true
 * - data присутствует
 * - message опционально
 *
 * Тест 2: ApiErrorResponse имеет правильную структуру
 * - success === false
 * - message и errorCode обязательны
 * - details и stack опциональны
 *
 * Тест 3: PaginatedResult содержит все необходимые поля
 * - items, total, page, limit, totalPages
 * - hasNextPage, hasPreviousPage вычисляются правильно
 *
 * Тест 4: ApiErrorCode содержит все коды ошибок
 * - Проверить наличие всех 15 кодов ошибок
 *
 * Тест 5: HttpMethod содержит все методы
 * - GET, POST, PUT, PATCH, DELETE
 */
