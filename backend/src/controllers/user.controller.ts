/**
 * Файл: controllers/user.controller.ts
 * Описание: Контроллер для обработки HTTP запросов к API пользователей
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: express, services/user.service, middleware/auth, middleware/authorize
 */

// Импорт типов Express для работы с запросами и ответами
// Import Express types for request and response handling
import { Request, Response, NextFunction } from 'express';

// Импорт сервиса пользователей для бизнес-логики
// Import user service for business logic
import { userService, RegisterUserData, LoginUserData, UpdateProfileData } from '../services/user.service';

// Импорт типов ролей пользователей
// Import user role types
import { UserRole } from '../types/common.types';

/**
 * Контроллер для работы с пользователями
 * Controller for user operations
 */
export class UserController {
  /**
   * Регистрация нового пользователя
   * Register new user
   * POST /api/users/register
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Извлекаем данные из тела запроса
      // Extract data from request body
      const registerData: RegisterUserData = {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        role: req.body.role,
        phoneNumber: req.body.phoneNumber
      };

      // Вызываем сервис для регистрации пользователя
      // Call service to register user
      const result = await userService.register(registerData);

      // Возвращаем успешный ответ с кодом 201 (Created)
      // Return success response with code 201 (Created)
      res.status(201).json({
        success: true,
        message: 'Пользователь успешно зарегистрирован',
        data: result
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Вход пользователя в систему
   * User login
   * POST /api/users/login
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Извлекаем данные для входа из тела запроса
      // Extract login data from request body
      const loginData: LoginUserData = {
        emailOrUsername: req.body.emailOrUsername,
        password: req.body.password
      };

      // Вызываем сервис для входа пользователя
      // Call service to login user
      const result = await userService.login(loginData);

      // Возвращаем успешный ответ с кодом 200 (OK)
      // Return success response with code 200 (OK)
      res.status(200).json({
        success: true,
        message: 'Вход выполнен успешно',
        data: result
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Обновление access токена через refresh токен
   * Refresh access token
   * POST /api/users/refresh-token
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Извлекаем refresh токен из тела запроса
      // Extract refresh token from request body
      const { refreshToken } = req.body;

      // Проверяем наличие refresh токена
      // Check for refresh token presence
      if (!refreshToken) {
        // Возвращаем ошибку 400 (Bad Request)
        // Return 400 (Bad Request) error
        res.status(400).json({
          success: false,
          message: 'Refresh токен не предоставлен',
          errorCode: 'NO_REFRESH_TOKEN'
        });
        return;
      }

      // Вызываем сервис для обновления access токена
      // Call service to refresh access token
      const result = await userService.refreshAccessToken(refreshToken);

      // Возвращаем успешный ответ с новым access токеном
      // Return success response with new access token
      res.status(200).json({
        success: true,
        message: 'Access токен успешно обновлен',
        data: result
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Получение профиля текущего пользователя
   * Get current user profile
   * GET /api/users/me
   * Требуется аутентификация / Authentication required
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Извлекаем ID пользователя из req.user (добавлен auth middleware)
      // Extract user ID from req.user (added by auth middleware)
      const userId = req.user!.userId;

      // Вызываем сервис для получения данных пользователя
      // Call service to get user data
      const user = await userService.getUserById(userId);

      // Возвращаем успешный ответ с данными пользователя
      // Return success response with user data
      res.status(200).json({
        success: true,
        message: 'Профиль пользователя получен',
        data: user
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Обновление профиля текущего пользователя
   * Update current user profile
   * PUT /api/users/me
   * Требуется аутентификация / Authentication required
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async updateMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Извлекаем ID пользователя из req.user
      // Extract user ID from req.user
      const userId = req.user!.userId;

      // Формируем данные для обновления из тела запроса
      // Form update data from request body
      const updateData: UpdateProfileData = {
        username: req.body.username,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        phoneNumber: req.body.phoneNumber,
        avatarUrl: req.body.avatarUrl
      };

      // Вызываем сервис для обновления профиля
      // Call service to update profile
      const updatedUser = await userService.updateProfile(userId, updateData);

      // Возвращаем успешный ответ с обновленными данными
      // Return success response with updated data
      res.status(200).json({
        success: true,
        message: 'Профиль успешно обновлен',
        data: updatedUser
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Изменение пароля текущего пользователя
   * Change current user password
   * PUT /api/users/me/password
   * Требуется аутентификация / Authentication required
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Извлекаем ID пользователя из req.user
      // Extract user ID from req.user
      const userId = req.user!.userId;

      // Извлекаем старый и новый пароли из тела запроса
      // Extract old and new passwords from request body
      const { oldPassword, newPassword } = req.body;

      // Проверяем наличие обоих паролей
      // Check for presence of both passwords
      if (!oldPassword || !newPassword) {
        // Возвращаем ошибку 400 (Bad Request)
        // Return 400 (Bad Request) error
        res.status(400).json({
          success: false,
          message: 'Необходимо указать старый и новый пароли',
          errorCode: 'MISSING_PASSWORDS'
        });
        return;
      }

      // Вызываем сервис для изменения пароля
      // Call service to change password
      await userService.changePassword(userId, oldPassword, newPassword);

      // Возвращаем успешный ответ
      // Return success response
      res.status(200).json({
        success: true,
        message: 'Пароль успешно изменен'
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Получение пользователя по ID
   * Get user by ID
   * GET /api/users/:id
   * Требуется аутентификация / Authentication required
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Извлекаем ID пользователя из параметров URL
      // Extract user ID from URL parameters
      const userId = req.params.id;

      // Вызываем сервис для получения данных пользователя
      // Call service to get user data
      const user = await userService.getUserById(userId);

      // Возвращаем успешный ответ с данными пользователя
      // Return success response with user data
      res.status(200).json({
        success: true,
        message: 'Пользователь найден',
        data: user
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Получение списка всех пользователей с фильтрацией
   * Get list of all users with filtering
   * GET /api/users
   * Требуется авторизация: ADMIN / Authorization required: ADMIN
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Извлекаем параметры фильтрации из query параметров
      // Extract filter parameters from query parameters
      const role = req.query.role as UserRole | undefined;
      const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;

      // Вызываем сервис для получения списка пользователей
      // Call service to get users list
      const users = await userService.getAllUsers(role, isActive);

      // Возвращаем успешный ответ со списком пользователей
      // Return success response with users list
      res.status(200).json({
        success: true,
        message: 'Список пользователей получен',
        data: users,
        count: users.length
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Блокировка пользователя
   * Block user
   * POST /api/users/:id/block
   * Требуется авторизация: ADMIN / Authorization required: ADMIN
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async blockUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Извлекаем ID пользователя для блокировки из параметров URL
      // Extract user ID to block from URL parameters
      const userId = req.params.id;

      // Извлекаем причину блокировки из тела запроса (необязательно)
      // Extract block reason from request body (optional)
      const { reason } = req.body;

      // Вызываем сервис для блокировки пользователя
      // Call service to block user
      await userService.blockUser(userId, reason);

      // Возвращаем успешный ответ
      // Return success response
      res.status(200).json({
        success: true,
        message: 'Пользователь успешно заблокирован'
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Разблокировка пользователя
   * Unblock user
   * POST /api/users/:id/unblock
   * Требуется авторизация: ADMIN / Authorization required: ADMIN
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async unblockUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Извлекаем ID пользователя для разблокировки из параметров URL
      // Extract user ID to unblock from URL parameters
      const userId = req.params.id;

      // Вызываем сервис для разблокировки пользователя
      // Call service to unblock user
      await userService.unblockUser(userId);

      // Возвращаем успешный ответ
      // Return success response
      res.status(200).json({
        success: true,
        message: 'Пользователь успешно разблокирован'
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }
}

/**
 * Экспорт экземпляра контроллера (Singleton pattern)
 * Export controller instance (Singleton pattern)
 */
export const userController = new UserController();

/**
 * ТЕСТЫ для user.controller.ts
 *
 * Тест 1: POST /api/users/register - Успешная регистрация
 * - Отправить POST запрос с валидными данными
 * - Проверить статус код 201
 * - Проверить наличие success: true
 * - Проверить наличие user, accessToken, refreshToken в data
 *
 * Тест 2: POST /api/users/register - Регистрация с существующим email
 * - Создать пользователя с email test@example.com
 * - Отправить POST запрос с тем же email
 * - Проверить статус код 400 или 409
 * - Проверить наличие сообщения об ошибке
 *
 * Тест 3: POST /api/users/login - Успешный вход
 * - Зарегистрировать пользователя
 * - Отправить POST запрос на /api/users/login с правильными данными
 * - Проверить статус код 200
 * - Проверить наличие токенов в ответе
 *
 * Тест 4: POST /api/users/login - Вход с неверным паролем
 * - Зарегистрировать пользователя
 * - Отправить POST запрос с неверным паролем
 * - Проверить статус код 401
 * - Проверить сообщение об ошибке
 *
 * Тест 5: POST /api/users/refresh-token - Обновление токена
 * - Зарегистрировать пользователя и получить refresh токен
 * - Отправить POST запрос на /api/users/refresh-token
 * - Проверить статус код 200
 * - Проверить наличие нового accessToken
 *
 * Тест 6: POST /api/users/refresh-token - С невалидным токеном
 * - Отправить POST запрос с невалидным refresh токеном
 * - Проверить статус код 401
 *
 * Тест 7: GET /api/users/me - Получение своего профиля
 * - Зарегистрировать пользователя и получить access токен
 * - Отправить GET запрос с Authorization header
 * - Проверить статус код 200
 * - Проверить данные пользователя в ответе
 *
 * Тест 8: GET /api/users/me - Без токена
 * - Отправить GET запрос без Authorization header
 * - Проверить статус код 401
 *
 * Тест 9: PUT /api/users/me - Обновление профиля
 * - Зарегистрировать пользователя
 * - Отправить PUT запрос с новыми данными
 * - Проверить статус код 200
 * - Проверить обновленные данные
 *
 * Тест 10: PUT /api/users/me/password - Изменение пароля
 * - Зарегистрировать пользователя
 * - Отправить PUT запрос с oldPassword и newPassword
 * - Проверить статус код 200
 * - Попробовать войти со старым паролем - должно быть отклонено
 * - Попробовать войти с новым паролем - должно быть успешно
 *
 * Тест 11: GET /api/users/:id - Получение пользователя по ID
 * - Создать пользователя
 * - Отправить GET запрос с ID пользователя
 * - Проверить статус код 200
 * - Проверить корректность данных
 *
 * Тест 12: GET /api/users - Получение списка пользователей (ADMIN)
 * - Создать пользователя с ролью ADMIN
 * - Отправить GET запрос с токеном админа
 * - Проверить статус код 200
 * - Проверить наличие массива users
 *
 * Тест 13: GET /api/users - Без прав администратора
 * - Создать обычного пользователя
 * - Отправить GET запрос с токеном обычного пользователя
 * - Проверить статус код 403 (Forbidden)
 *
 * Тест 14: POST /api/users/:id/block - Блокировка пользователя
 * - Создать админа и обычного пользователя
 * - Отправить POST запрос от имени админа
 * - Проверить статус код 200
 * - Попробовать войти заблокированным пользователем - ожидать ошибку
 *
 * Тест 15: POST /api/users/:id/unblock - Разблокировка пользователя
 * - Заблокировать пользователя
 * - Отправить POST запрос на /api/users/:id/unblock
 * - Проверить статус код 200
 * - Попробовать войти - должно быть успешно
 */
