/**
 * Общие типы данных, используемые в приложении
 */

/**
 * Стандартный ответ API с данными
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  timestamp: Date;
}

/**
 * Стандартный ответ API с ошибкой
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
  timestamp: Date;
}

/**
 * Объединенный тип ответа API
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Параметры пагинации
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Результат с пагинацией
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Базовые поля сущности
 */
export interface BaseEntityFields {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Результат операции
 */
export interface OperationResult {
  success: boolean;
  message?: string;
}
