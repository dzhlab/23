/**
 * Файл: services/user.service.ts
 * Описание: Сервис для работы с пользователями и аутентификацией
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: api.service, types
 */

// Импорт API сервиса
// Import API service
import { apiService } from './api.service';

// Импорт типов
// Import types
import {
  User,
  RegisterUserData,
  LoginUserData,
  AuthResult,
  UpdateProfileData,
  ChangePasswordData,
  ApiSuccessResponse
} from '../types';

/**
 * Класс для работы с пользователями
 * User service class
 */
class UserService {
  // Базовый путь для пользовательских эндпоинтов
  // Base path for user endpoints
  private readonly basePath = '/users';

  /**
   * Регистрация нового пользователя
   * Register new user
   *
   * @param data - данные для регистрации / registration data
   * @returns Promise с результатом аутентификации / Promise with auth result
   */
  async register(data: RegisterUserData): Promise<AuthResult> {
    // Отправляем POST запрос на регистрацию
    // Send POST request for registration
    const response = await apiService.post<AuthResult>(
      `${this.basePath}/register`,
      data
    );

    // Сохраняем токены в API сервисе
    // Save tokens in API service
    apiService.setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken
    });

    // Возвращаем данные результата
    // Return result data
    return response.data;
  }

  /**
   * Вход пользователя
   * User login
   *
   * @param data - данные для входа / login data
   * @returns Promise с результатом аутентификации / Promise with auth result
   */
  async login(data: LoginUserData): Promise<AuthResult> {
    // Отправляем POST запрос на вход
    // Send POST request for login
    const response = await apiService.post<AuthResult>(
      `${this.basePath}/login`,
      data
    );

    // Сохраняем токены в API сервисе
    // Save tokens in API service
    apiService.setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken
    });

    // Возвращаем данные результата
    // Return result data
    return response.data;
  }

  /**
   * Выход пользователя
   * User logout
   */
  logout(): void {
    // Очищаем токены из API сервиса
    // Clear tokens from API service
    apiService.clearTokens();
  }

  /**
   * Получение текущего профиля пользователя
   * Get current user profile
   *
   * @returns Promise с данными пользователя / Promise with user data
   */
  async getMyProfile(): Promise<User> {
    // Отправляем GET запрос на получение профиля
    // Send GET request to get profile
    const response = await apiService.get<User>(`${this.basePath}/me`);

    // Возвращаем данные пользователя
    // Return user data
    return response.data;
  }

  /**
   * Обновление профиля текущего пользователя
   * Update current user profile
   *
   * @param data - данные для обновления / update data
   * @returns Promise с обновленными данными пользователя / Promise with updated user data
   */
  async updateMyProfile(data: UpdateProfileData): Promise<User> {
    // Отправляем PUT запрос на обновление профиля
    // Send PUT request to update profile
    const response = await apiService.put<User>(`${this.basePath}/me`, data);

    // Возвращаем обновленные данные пользователя
    // Return updated user data
    return response.data;
  }

  /**
   * Смена пароля текущего пользователя
   * Change current user password
   *
   * @param data - данные для смены пароля / password change data
   * @returns Promise с результатом / Promise with result
   */
  async changePassword(data: ChangePasswordData): Promise<void> {
    // Отправляем PUT запрос на смену пароля
    // Send PUT request to change password
    await apiService.put(`${this.basePath}/me/password`, data);
  }

  /**
   * Получение пользователя по ID
   * Get user by ID
   *
   * @param userId - ID пользователя / user ID
   * @returns Promise с данными пользователя / Promise with user data
   */
  async getUserById(userId: string): Promise<User> {
    // Отправляем GET запрос на получение пользователя
    // Send GET request to get user
    const response = await apiService.get<User>(`${this.basePath}/${userId}`);

    // Возвращаем данные пользователя
    // Return user data
    return response.data;
  }

  /**
   * Получение списка всех пользователей (только для админа)
   * Get list of all users (admin only)
   *
   * @returns Promise с массивом пользователей / Promise with users array
   */
  async getAllUsers(): Promise<User[]> {
    // Отправляем GET запрос на получение всех пользователей
    // Send GET request to get all users
    const response = await apiService.get<User[]>(this.basePath);

    // Возвращаем массив пользователей
    // Return users array
    return response.data;
  }

  /**
   * Блокировка пользователя (только для админа)
   * Block user (admin only)
   *
   * @param userId - ID пользователя / user ID
   * @returns Promise с обновленными данными пользователя / Promise with updated user data
   */
  async blockUser(userId: string): Promise<User> {
    // Отправляем POST запрос на блокировку пользователя
    // Send POST request to block user
    const response = await apiService.post<User>(
      `${this.basePath}/${userId}/block`
    );

    // Возвращаем обновленные данные пользователя
    // Return updated user data
    return response.data;
  }

  /**
   * Разблокировка пользователя (только для админа)
   * Unblock user (admin only)
   *
   * @param userId - ID пользователя / user ID
   * @returns Promise с обновленными данными пользователя / Promise with updated user data
   */
  async unblockUser(userId: string): Promise<User> {
    // Отправляем POST запрос на разблокировку пользователя
    // Send POST request to unblock user
    const response = await apiService.post<User>(
      `${this.basePath}/${userId}/unblock`
    );

    // Возвращаем обновленные данные пользователя
    // Return updated user data
    return response.data;
  }

  /**
   * Проверка аутентификации пользователя
   * Check if user is authenticated
   *
   * @returns true если пользователь аутентифицирован / true if user is authenticated
   */
  isAuthenticated(): boolean {
    // Возвращаем результат проверки из API сервиса
    // Return check result from API service
    return apiService.isAuthenticated();
  }
}

// Создаем и экспортируем единственный экземпляр сервиса (Singleton)
// Create and export single service instance (Singleton)
export const userService = new UserService();

/**
 * ТЕСТЫ для user.service.ts
 *
 * Тест 1: register отправляет правильные данные
 * - Вызвать register с данными
 * - Проверить POST запрос на /users/register
 * - Проверить сохранение токенов
 *
 * Тест 2: login отправляет правильные данные
 * - Вызвать login с email и паролем
 * - Проверить POST запрос на /users/login
 * - Проверить сохранение токенов
 *
 * Тест 3: logout очищает токены
 * - Установить токены
 * - Вызвать logout
 * - Проверить что токены удалены
 *
 * Тест 4: getMyProfile возвращает данные пользователя
 * - Вызвать getMyProfile
 * - Проверить GET запрос на /users/me
 *
 * Тест 5: updateMyProfile обновляет данные
 * - Вызвать updateMyProfile с новыми данными
 * - Проверить PUT запрос на /users/me
 *
 * Тест 6: changePassword отправляет пароли
 * - Вызвать changePassword
 * - Проверить PUT запрос на /users/me/password
 *
 * Тест 7: getUserById получает пользователя по ID
 * - Вызвать getUserById('123')
 * - Проверить GET запрос на /users/123
 *
 * Тест 8: getAllUsers возвращает массив
 * - Вызвать getAllUsers
 * - Проверить GET запрос на /users
 *
 * Тест 9: blockUser отправляет запрос блокировки
 * - Вызвать blockUser('123')
 * - Проверить POST запрос на /users/123/block
 *
 * Тест 10: unblockUser отправляет запрос разблокировки
 * - Вызвать unblockUser('123')
 * - Проверить POST запрос на /users/123/unblock
 *
 * Тест 11: isAuthenticated проверяет наличие токена
 * - Без токена должно вернуть false
 * - С токеном должно вернуть true
 */
