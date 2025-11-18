/**
 * Файл: services/api.service.ts
 * Описание: Сервис для работы с API бэкенда
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: axios, types
 */

// Импорт библиотеки Axios для HTTP запросов
// Import Axios library for HTTP requests
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

// Импорт типов
// Import types
import {
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiResponse,
  AuthTokens
} from '../types';

/**
 * Класс для работы с API
 * API service class
 */
class ApiService {
  // Экземпляр Axios / Axios instance
  private api: AxiosInstance;

  // Access токен / Access token
  private accessToken: string | null = null;

  // Refresh токен / Refresh token
  private refreshToken: string | null = null;

  // Флаг процесса обновления токена / Token refresh in progress flag
  private isRefreshing: boolean = false;

  // Очередь запросов во время обновления токена / Request queue during token refresh
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  /**
   * Конструктор ApiService
   * ApiService constructor
   */
  constructor() {
    // Получаем базовый URL из переменных окружения или используем дефолтный
    // Get base URL from environment variables or use default
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

    // Создаем экземпляр Axios с базовой конфигурацией
    // Create Axios instance with base configuration
    this.api = axios.create({
      baseURL,                                   // Базовый URL / Base URL
      timeout: 30000,                            // Таймаут 30 секунд / 30 second timeout
      headers: {
        'Content-Type': 'application/json'       // Тип контента JSON / JSON content type
      }
    });

    // Загружаем токены из localStorage
    // Load tokens from localStorage
    this.loadTokensFromStorage();

    // Настраиваем перехватчики запросов
    // Setup request interceptors
    this.setupRequestInterceptor();

    // Настраиваем перехватчики ответов
    // Setup response interceptors
    this.setupResponseInterceptor();
  }

  /**
   * Загрузка токенов из localStorage
   * Load tokens from localStorage
   */
  private loadTokensFromStorage(): void {
    // Пытаемся получить access токен
    // Try to get access token
    this.accessToken = localStorage.getItem('accessToken');

    // Пытаемся получить refresh токен
    // Try to get refresh token
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  /**
   * Сохранение токенов в localStorage
   * Save tokens to localStorage
   *
   * @param tokens - объект с токенами / tokens object
   */
  public setTokens(tokens: AuthTokens): void {
    // Сохраняем access токен в памяти
    // Save access token in memory
    this.accessToken = tokens.accessToken;

    // Сохраняем refresh токен в памяти
    // Save refresh token in memory
    this.refreshToken = tokens.refreshToken;

    // Сохраняем access токен в localStorage
    // Save access token to localStorage
    localStorage.setItem('accessToken', tokens.accessToken);

    // Сохраняем refresh токен в localStorage
    // Save refresh token to localStorage
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  /**
   * Удаление токенов из памяти и localStorage
   * Remove tokens from memory and localStorage
   */
  public clearTokens(): void {
    // Очищаем access токен в памяти
    // Clear access token in memory
    this.accessToken = null;

    // Очищаем refresh токен в памяти
    // Clear refresh token in memory
    this.refreshToken = null;

    // Удаляем access токен из localStorage
    // Remove access token from localStorage
    localStorage.removeItem('accessToken');

    // Удаляем refresh токен из localStorage
    // Remove refresh token from localStorage
    localStorage.removeItem('refreshToken');
  }

  /**
   * Настройка перехватчика запросов
   * Setup request interceptor
   */
  private setupRequestInterceptor(): void {
    // Добавляем перехватчик для всех исходящих запросов
    // Add interceptor for all outgoing requests
    this.api.interceptors.request.use(
      // Функция обработки успешного запроса
      // Success request handler function
      (config) => {
        // Если есть access токен, добавляем его в заголовок Authorization
        // If access token exists, add it to Authorization header
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }

        // Возвращаем модифицированную конфигурацию
        // Return modified configuration
        return config;
      },
      // Функция обработки ошибки запроса
      // Error request handler function
      (error) => {
        // Отклоняем промис с ошибкой
        // Reject promise with error
        return Promise.reject(error);
      }
    );
  }

  /**
   * Настройка перехватчика ответов
   * Setup response interceptor
   */
  private setupResponseInterceptor(): void {
    // Добавляем перехватчик для всех входящих ответов
    // Add interceptor for all incoming responses
    this.api.interceptors.response.use(
      // Функция обработки успешного ответа (просто возвращаем)
      // Success response handler function (just return)
      (response) => response,

      // Функция обработки ошибки ответа
      // Error response handler function
      async (error: AxiosError) => {
        // Получаем оригинальный запрос
        // Get original request
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Проверяем, является ли ошибка 401 (Unauthorized)
        // Check if error is 401 (Unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Если уже идет процесс обновления токена
          // If token refresh is already in progress
          if (this.isRefreshing) {
            // Добавляем запрос в очередь и ждем обновления токена
            // Add request to queue and wait for token refresh
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => {
                // После обновления токена повторяем запрос
                // Retry request after token refresh
                return this.api(originalRequest);
              })
              .catch((err) => {
                // В случае ошибки отклоняем промис
                // Reject promise on error
                return Promise.reject(err);
              });
          }

          // Устанавливаем флаг повторной попытки
          // Set retry flag
          originalRequest._retry = true;

          // Устанавливаем флаг процесса обновления токена
          // Set token refresh in progress flag
          this.isRefreshing = true;

          // Пытаемся обновить токен
          // Try to refresh token
          try {
            // Отправляем запрос на обновление токена
            // Send token refresh request
            const response = await axios.post<ApiSuccessResponse<AuthTokens>>(
              `${this.api.defaults.baseURL}/users/refresh-token`,
              { refreshToken: this.refreshToken }
            );

            // Получаем новые токены
            // Get new tokens
            const { accessToken, refreshToken } = response.data.data;

            // Сохраняем новые токены
            // Save new tokens
            this.setTokens({ accessToken, refreshToken });

            // Обрабатываем все запросы в очереди
            // Process all queued requests
            this.processQueue(null);

            // Повторяем оригинальный запрос с новым токеном
            // Retry original request with new token
            return this.api(originalRequest);
          } catch (refreshError) {
            // Если обновление токена не удалось, обрабатываем очередь с ошибкой
            // If token refresh failed, process queue with error
            this.processQueue(refreshError);

            // Очищаем токены
            // Clear tokens
            this.clearTokens();

            // Перенаправляем на страницу входа (можно настроить через событие)
            // Redirect to login page (can be configured via event)
            window.dispatchEvent(new Event('auth:logout'));

            // Отклоняем промис с ошибкой
            // Reject promise with error
            return Promise.reject(refreshError);
          } finally {
            // Сбрасываем флаг процесса обновления токена
            // Reset token refresh in progress flag
            this.isRefreshing = false;
          }
        }

        // Для всех остальных ошибок просто отклоняем промис
        // For all other errors just reject promise
        return Promise.reject(error);
      }
    );
  }

  /**
   * Обработка очереди запросов после обновления токена
   * Process request queue after token refresh
   *
   * @param error - ошибка (если есть) / error (if any)
   */
  private processQueue(error: any): void {
    // Обрабатываем каждый запрос в очереди
    // Process each request in queue
    this.failedQueue.forEach((promise) => {
      // Если есть ошибка, отклоняем промис
      // If error exists, reject promise
      if (error) {
        promise.reject(error);
      } else {
        // Иначе разрешаем промис
        // Otherwise resolve promise
        promise.resolve();
      }
    });

    // Очищаем очередь
    // Clear queue
    this.failedQueue = [];
  }

  /**
   * GET запрос
   * GET request
   *
   * @param url - URL путь / URL path
   * @param params - query параметры / query parameters
   * @returns Promise с ответом / Promise with response
   */
  public async get<T = any>(
    url: string,
    params?: Record<string, any>
  ): Promise<ApiSuccessResponse<T>> {
    // Отправляем GET запрос
    // Send GET request
    const response = await this.api.get<ApiSuccessResponse<T>>(url, { params });

    // Возвращаем данные ответа
    // Return response data
    return response.data;
  }

  /**
   * POST запрос
   * POST request
   *
   * @param url - URL путь / URL path
   * @param data - данные запроса / request data
   * @returns Promise с ответом / Promise with response
   */
  public async post<T = any>(
    url: string,
    data?: any
  ): Promise<ApiSuccessResponse<T>> {
    // Отправляем POST запрос
    // Send POST request
    const response = await this.api.post<ApiSuccessResponse<T>>(url, data);

    // Возвращаем данные ответа
    // Return response data
    return response.data;
  }

  /**
   * PUT запрос
   * PUT request
   *
   * @param url - URL путь / URL path
   * @param data - данные запроса / request data
   * @returns Promise с ответом / Promise with response
   */
  public async put<T = any>(
    url: string,
    data?: any
  ): Promise<ApiSuccessResponse<T>> {
    // Отправляем PUT запрос
    // Send PUT request
    const response = await this.api.put<ApiSuccessResponse<T>>(url, data);

    // Возвращаем данные ответа
    // Return response data
    return response.data;
  }

  /**
   * PATCH запрос
   * PATCH request
   *
   * @param url - URL путь / URL path
   * @param data - данные запроса / request data
   * @returns Promise с ответом / Promise with response
   */
  public async patch<T = any>(
    url: string,
    data?: any
  ): Promise<ApiSuccessResponse<T>> {
    // Отправляем PATCH запрос
    // Send PATCH request
    const response = await this.api.patch<ApiSuccessResponse<T>>(url, data);

    // Возвращаем данные ответа
    // Return response data
    return response.data;
  }

  /**
   * DELETE запрос
   * DELETE request
   *
   * @param url - URL путь / URL path
   * @returns Promise с ответом / Promise with response
   */
  public async delete<T = any>(url: string): Promise<ApiSuccessResponse<T>> {
    // Отправляем DELETE запрос
    // Send DELETE request
    const response = await this.api.delete<ApiSuccessResponse<T>>(url);

    // Возвращаем данные ответа
    // Return response data
    return response.data;
  }

  /**
   * Проверка наличия токена аутентификации
   * Check if authentication token exists
   *
   * @returns true если токен есть / true if token exists
   */
  public isAuthenticated(): boolean {
    // Возвращаем результат проверки наличия токена
    // Return token existence check result
    return !!this.accessToken;
  }
}

// Создаем и экспортируем единственный экземпляр сервиса (Singleton)
// Create and export single service instance (Singleton)
export const apiService = new ApiService();

/**
 * ТЕСТЫ для api.service.ts
 *
 * Тест 1: ApiService создается с правильным baseURL
 * - Проверить что используется VITE_API_BASE_URL или дефолтный URL
 * - Проверить timeout === 30000
 *
 * Тест 2: setTokens сохраняет токены в localStorage
 * - Вызвать setTokens({ accessToken: 'test-access', refreshToken: 'test-refresh' })
 * - Проверить localStorage.getItem('accessToken') === 'test-access'
 * - Проверить localStorage.getItem('refreshToken') === 'test-refresh'
 *
 * Тест 3: clearTokens удаляет токены
 * - Установить токены
 * - Вызвать clearTokens()
 * - Проверить что токены удалены из localStorage
 *
 * Тест 4: Request interceptor добавляет Authorization header
 * - Установить токен
 * - Сделать запрос
 * - Проверить наличие заголовка Authorization
 *
 * Тест 5: Response interceptor обрабатывает 401 ошибки
 * - Сымитировать 401 ошибку
 * - Проверить попытку обновления токена
 *
 * Тест 6: GET запрос работает корректно
 * - Сымитировать успешный GET запрос
 * - Проверить возврат данных
 *
 * Тест 7: POST запрос отправляет данные
 * - Сымитировать POST запрос с данными
 * - Проверить отправку правильных данных
 *
 * Тест 8: isAuthenticated возвращает правильное значение
 * - Без токена должно быть false
 * - С токеном должно быть true
 *
 * Тест 9: processQueue обрабатывает очередь запросов
 * - Добавить запросы в очередь
 * - Вызвать processQueue без ошибки
 * - Проверить что все промисы разрешены
 *
 * Тест 10: processQueue обрабатывает ошибки
 * - Добавить запросы в очередь
 * - Вызвать processQueue с ошибкой
 * - Проверить что все промисы отклонены
 */
