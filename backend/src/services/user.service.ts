/**
 * Файл: services/user.service.ts
 * Описание: Сервис для работы с пользователями (регистрация, аутентификация, управление профилями)
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: typeorm, entities, utils/jwt, utils/password
 */

// Импорт DataSource для работы с базой данных
// Import DataSource for database operations
import { AppDataSource } from '../config/database.config';

// Импорт Repository из TypeORM для работы с репозиториями
// Import Repository from TypeORM for repository operations
import { Repository } from 'typeorm';

// Импорт сущности User
// Import User entity
import { User } from '../entities/User.entity';

// Импорт типов ролей пользователей
// Import user role types
import { UserRole } from '../types/common.types';

// Импорт утилит для работы с паролями
// Import password utilities
import { hashPassword, comparePassword, validatePassword } from '../utils/password.util';

// Импорт утилит для работы с JWT токенами
// Import JWT token utilities
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util';

// Импорт кастомных классов ошибок
// Import custom error classes
import {
  ValidationError,
  ConflictError,
  AuthenticationError,
  NotFoundError
} from '../utils/errors.util';

/**
 * Интерфейс для данных регистрации пользователя
 * Interface for user registration data
 */
export interface RegisterUserData {
  // Email пользователя (должен быть уникальным)
  // User email (must be unique)
  email: string;

  // Пароль в открытом виде (будет захеширован)
  // Plain text password (will be hashed)
  password: string;

  // Имя пользователя (username, должен быть уникальным)
  // Username (must be unique)
  username: string;

  // Фамилия / Last name
  lastName: string;

  // Имя / First name
  firstName: string;

  // Отчество (необязательно) / Middle name (optional)
  middleName?: string;

  // Роль пользователя (по умолчанию - зритель)
  // User role (default - spectator)
  role?: UserRole;

  // Номер телефона (необязательно) / Phone number (optional)
  phoneNumber?: string;
}

/**
 * Интерфейс для данных входа пользователя
 * Interface for user login data
 */
export interface LoginUserData {
  // Email или username для входа
  // Email or username for login
  emailOrUsername: string;

  // Пароль в открытом виде
  // Plain text password
  password: string;
}

/**
 * Интерфейс для результата успешной аутентификации
 * Interface for successful authentication result
 */
export interface AuthResult {
  // Пользователь (без пароля)
  // User (without password)
  user: Omit<User, 'passwordHash'>;

  // Access токен (короткоживущий, 15 минут)
  // Access token (short-lived, 15 minutes)
  accessToken: string;

  // Refresh токен (долгоживущий, 7 дней)
  // Refresh token (long-lived, 7 days)
  refreshToken: string;
}

/**
 * Интерфейс для данных обновления профиля
 * Interface for profile update data
 */
export interface UpdateProfileData {
  // Имя пользователя (необязательно)
  // Username (optional)
  username?: string;

  // Фамилия (необязательно)
  // Last name (optional)
  lastName?: string;

  // Имя (необязательно)
  // First name (optional)
  firstName?: string;

  // Отчество (необязательно)
  // Middle name (optional)
  middleName?: string;

  // Номер телефона (необязательно)
  // Phone number (optional)
  phoneNumber?: string;

  // URL аватара (необязательно)
  // Avatar URL (optional)
  avatarUrl?: string;
}

/**
 * Сервис для работы с пользователями
 * Service for user operations
 */
export class UserService {
  // Репозиторий для работы с пользователями в БД
  // Repository for user database operations
  private userRepository: Repository<User>;

  /**
   * Конструктор сервиса
   * Service constructor
   */
  constructor() {
    // Получаем репозиторий User из DataSource
    // Get User repository from DataSource
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Регистрация нового пользователя
   * Register a new user
   *
   * @param data - данные для регистрации / registration data
   * @returns Promise с результатом аутентификации / Promise with authentication result
   * @throws Error если email или username уже существуют / if email or username already exist
   */
  async register(data: RegisterUserData): Promise<AuthResult> {
    try {
      // Валидируем пароль на соответствие требованиям безопасности
      // Validate password against security requirements
      const passwordValidation = validatePassword(data.password);

      // Если пароль не прошел валидацию, выбрасываем ошибку с описанием
      // If password validation failed, throw error with description
      if (!passwordValidation.valid) {
        // Объединяем все ошибки в одну строку
        // Combine all errors into one string
        const errorMessage = passwordValidation.errors.join(', ');
        throw new Error(`Пароль не соответствует требованиям: ${errorMessage}`);
      }

      // Проверяем, существует ли уже пользователь с таким email
      // Check if user with this email already exists
      const existingUserByEmail = await this.userRepository.findOne({
        where: { email: data.email }
      });

      // Если email уже занят, выбрасываем ошибку
      // If email is already taken, throw error
      if (existingUserByEmail) {
        throw new Error('Пользователь с таким email уже существует');
      }

      // Проверяем, существует ли уже пользователь с таким username
      // Check if user with this username already exists
      const existingUserByUsername = await this.userRepository.findOne({
        where: { username: data.username }
      });

      // Если username уже занят, выбрасываем ошибку
      // If username is already taken, throw error
      if (existingUserByUsername) {
        throw new Error('Пользователь с таким username уже существует');
      }

      // Хешируем пароль с помощью bcrypt
      // Hash password using bcrypt
      const passwordHash = await hashPassword(data.password);

      // Создаем объект нового пользователя
      // Create new user object
      const newUser = this.userRepository.create({
        email: data.email,
        passwordHash: passwordHash,
        username: data.username,
        lastName: data.lastName,
        firstName: data.firstName,
        middleName: data.middleName,
        role: data.role || UserRole.SPECTATOR, // По умолчанию - зритель / Default - spectator
        phoneNumber: data.phoneNumber,
        emailVerified: false, // Email еще не подтвержден / Email not yet verified
        isActive: true, // Аккаунт активен / Account is active
        isBlocked: false // Аккаунт не заблокирован / Account is not blocked
      });

      // Сохраняем пользователя в БД
      // Save user to database
      const savedUser = await this.userRepository.save(newUser);

      // Удаляем passwordHash из объекта для отправки клиенту
      // Remove passwordHash from object for sending to client
      const { passwordHash: _, ...userWithoutPassword } = savedUser;

      // Генерируем access токен (15 минут)
      // Generate access token (15 minutes)
      const accessToken = generateAccessToken({
        userId: savedUser.id,
        email: savedUser.email,
        role: savedUser.role
      });

      // Генерируем refresh токен (7 дней)
      // Generate refresh token (7 days)
      const refreshToken = generateRefreshToken({
        userId: savedUser.id,
        email: savedUser.email,
        role: savedUser.role
      });

      // Возвращаем результат аутентификации
      // Return authentication result
      return {
        user: userWithoutPassword,
        accessToken: accessToken,
        refreshToken: refreshToken
      };
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при регистрации пользователя:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }

  /**
   * Вход пользователя в систему
   * User login
   *
   * @param data - данные для входа / login data
   * @returns Promise с результатом аутентификации / Promise with authentication result
   * @throws Error если учетные данные неверны / if credentials are invalid
   */
  async login(data: LoginUserData): Promise<AuthResult> {
    try {
      // Ищем пользователя по email или username
      // Find user by email or username
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :emailOrUsername', { emailOrUsername: data.emailOrUsername })
        .orWhere('user.username = :emailOrUsername', { emailOrUsername: data.emailOrUsername })
        .getOne();

      // Если пользователь не найден, выбрасываем ошибку
      // If user not found, throw error
      if (!user) {
        throw new Error('Неверный email/username или пароль');
      }

      // Проверяем, не заблокирован ли аккаунт
      // Check if account is blocked
      if (user.isBlocked) {
        throw new Error('Аккаунт заблокирован. Обратитесь к администратору');
      }

      // Проверяем, активен ли аккаунт
      // Check if account is active
      if (!user.isActive) {
        throw new Error('Аккаунт не активен');
      }

      // Сравниваем введенный пароль с хешем из БД
      // Compare provided password with hash from database
      const isPasswordValid = await comparePassword(data.password, user.passwordHash);

      // Если пароль неверный, выбрасываем ошибку
      // If password is invalid, throw error
      if (!isPasswordValid) {
        throw new Error('Неверный email/username или пароль');
      }

      // Обновляем дату последнего входа
      // Update last login date
      user.lastLogin = new Date();

      // Сохраняем изменения в БД
      // Save changes to database
      await this.userRepository.save(user);

      // Удаляем passwordHash из объекта для отправки клиенту
      // Remove passwordHash from object for sending to client
      const { passwordHash: _, ...userWithoutPassword } = user;

      // Генерируем access токен (15 минут)
      // Generate access token (15 minutes)
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      // Генерируем refresh токен (7 дней)
      // Generate refresh token (7 days)
      const refreshToken = generateRefreshToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      // Возвращаем результат аутентификации
      // Return authentication result
      return {
        user: userWithoutPassword,
        accessToken: accessToken,
        refreshToken: refreshToken
      };
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при входе пользователя:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }

  /**
   * Обновление access токена с помощью refresh токена
   * Refresh access token using refresh token
   *
   * @param refreshToken - refresh токен / refresh token
   * @returns Promise с новым access токеном / Promise with new access token
   * @throws Error если refresh токен невалиден / if refresh token is invalid
   */
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Верифицируем refresh токен
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Если токен невалиден или истек, выбрасываем ошибку
      // If token is invalid or expired, throw error
      if (!decoded) {
        throw new Error('Недействительный или истекший refresh токен');
      }

      // Получаем пользователя по ID из токена
      // Get user by ID from token
      const user = await this.userRepository.findOne({
        where: { id: decoded.userId }
      });

      // Если пользователь не найден, выбрасываем ошибку
      // If user not found, throw error
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      // Проверяем, активен ли аккаунт
      // Check if account is active
      if (!user.isAccountActive()) {
        throw new Error('Аккаунт не активен или заблокирован');
      }

      // Генерируем новый access токен
      // Generate new access token
      const newAccessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      // Возвращаем новый access токен
      // Return new access token
      return {
        accessToken: newAccessToken
      };
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при обновлении access токена:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }

  /**
   * Получение пользователя по ID
   * Get user by ID
   *
   * @param userId - ID пользователя / user ID
   * @returns Promise с пользователем без пароля / Promise with user without password
   * @throws Error если пользователь не найден / if user not found
   */
  async getUserById(userId: string): Promise<Omit<User, 'passwordHash'>> {
    try {
      // Ищем пользователя по ID
      // Find user by ID
      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      // Если пользователь не найден, выбрасываем ошибку
      // If user not found, throw error
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      // Удаляем passwordHash из объекта для отправки клиенту
      // Remove passwordHash from object for sending to client
      const { passwordHash: _, ...userWithoutPassword } = user;

      // Возвращаем пользователя
      // Return user
      return userWithoutPassword;
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при получении пользователя по ID:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }

  /**
   * Получение пользователя по email
   * Get user by email
   *
   * @param email - email пользователя / user email
   * @returns Promise с пользователем без пароля / Promise with user without password
   * @throws Error если пользователь не найден / if user not found
   */
  async getUserByEmail(email: string): Promise<Omit<User, 'passwordHash'>> {
    try {
      // Ищем пользователя по email
      // Find user by email
      const user = await this.userRepository.findOne({
        where: { email: email }
      });

      // Если пользователь не найден, выбрасываем ошибку
      // If user not found, throw error
      if (!user) {
        throw new Error('Пользователь с таким email не найден');
      }

      // Удаляем passwordHash из объекта для отправки клиенту
      // Remove passwordHash from object for sending to client
      const { passwordHash: _, ...userWithoutPassword } = user;

      // Возвращаем пользователя
      // Return user
      return userWithoutPassword;
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при получении пользователя по email:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }

  /**
   * Обновление профиля пользователя
   * Update user profile
   *
   * @param userId - ID пользователя / user ID
   * @param data - данные для обновления / update data
   * @returns Promise с обновленным пользователем / Promise with updated user
   * @throws Error если пользователь не найден / if user not found
   */
  async updateProfile(userId: string, data: UpdateProfileData): Promise<Omit<User, 'passwordHash'>> {
    try {
      // Получаем пользователя по ID
      // Get user by ID
      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      // Если пользователь не найден, выбрасываем ошибку
      // If user not found, throw error
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      // Если обновляется username, проверяем уникальность
      // If updating username, check uniqueness
      if (data.username && data.username !== user.username) {
        // Ищем пользователя с таким username
        // Find user with this username
        const existingUser = await this.userRepository.findOne({
          where: { username: data.username }
        });

        // Если username уже занят, выбрасываем ошибку
        // If username is already taken, throw error
        if (existingUser) {
          throw new Error('Пользователь с таким username уже существует');
        }

        // Обновляем username
        // Update username
        user.username = data.username;
      }

      // Обновляем остальные поля, если они предоставлены
      // Update other fields if provided
      if (data.lastName !== undefined) {
        user.lastName = data.lastName;
      }

      if (data.firstName !== undefined) {
        user.firstName = data.firstName;
      }

      if (data.middleName !== undefined) {
        user.middleName = data.middleName;
      }

      if (data.phoneNumber !== undefined) {
        user.phoneNumber = data.phoneNumber;
      }

      if (data.avatarUrl !== undefined) {
        user.avatarUrl = data.avatarUrl;
      }

      // Сохраняем изменения в БД
      // Save changes to database
      const updatedUser = await this.userRepository.save(user);

      // Удаляем passwordHash из объекта для отправки клиенту
      // Remove passwordHash from object for sending to client
      const { passwordHash: _, ...userWithoutPassword } = updatedUser;

      // Возвращаем обновленного пользователя
      // Return updated user
      return userWithoutPassword;
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при обновлении профиля:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }

  /**
   * Изменение пароля пользователя
   * Change user password
   *
   * @param userId - ID пользователя / user ID
   * @param oldPassword - старый пароль / old password
   * @param newPassword - новый пароль / new password
   * @returns Promise<void>
   * @throws Error если старый пароль неверен / if old password is incorrect
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
      // Получаем пользователя по ID
      // Get user by ID
      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      // Если пользователь не найден, выбрасываем ошибку
      // If user not found, throw error
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      // Проверяем старый пароль
      // Verify old password
      const isOldPasswordValid = await comparePassword(oldPassword, user.passwordHash);

      // Если старый пароль неверный, выбрасываем ошибку
      // If old password is incorrect, throw error
      if (!isOldPasswordValid) {
        throw new Error('Неверный текущий пароль');
      }

      // Валидируем новый пароль
      // Validate new password
      const passwordValidation = validatePassword(newPassword);

      // Если новый пароль не прошел валидацию, выбрасываем ошибку
      // If new password validation failed, throw error
      if (!passwordValidation.valid) {
        const errorMessage = passwordValidation.errors.join(', ');
        throw new Error(`Новый пароль не соответствует требованиям: ${errorMessage}`);
      }

      // Хешируем новый пароль
      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);

      // Обновляем хеш пароля
      // Update password hash
      user.passwordHash = newPasswordHash;

      // Сохраняем изменения в БД
      // Save changes to database
      await this.userRepository.save(user);

      // Логируем успешную смену пароля
      // Log successful password change
      console.log(`Пароль успешно изменен для пользователя ${user.email}`);
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при изменении пароля:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }

  /**
   * Получение списка всех пользователей с фильтрацией
   * Get list of all users with filtering
   *
   * @param role - фильтр по роли (необязательно) / filter by role (optional)
   * @param isActive - фильтр по активности (необязательно) / filter by active status (optional)
   * @returns Promise со списком пользователей / Promise with list of users
   */
  async getAllUsers(
    role?: UserRole,
    isActive?: boolean
  ): Promise<Array<Omit<User, 'passwordHash'>>> {
    try {
      // Создаем query builder для построения запроса
      // Create query builder for building query
      const queryBuilder = this.userRepository.createQueryBuilder('user');

      // Если указан фильтр по роли, добавляем условие
      // If role filter is specified, add condition
      if (role) {
        queryBuilder.andWhere('user.role = :role', { role: role });
      }

      // Если указан фильтр по активности, добавляем условие
      // If active status filter is specified, add condition
      if (isActive !== undefined) {
        queryBuilder.andWhere('user.isActive = :isActive', { isActive: isActive });
      }

      // Сортируем по дате создания (новые первыми)
      // Sort by creation date (newest first)
      queryBuilder.orderBy('user.createdAt', 'DESC');

      // Выполняем запрос
      // Execute query
      const users = await queryBuilder.getMany();

      // Удаляем passwordHash из каждого пользователя
      // Remove passwordHash from each user
      const usersWithoutPasswords = users.map((user) => {
        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      // Возвращаем список пользователей
      // Return list of users
      return usersWithoutPasswords;
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при получении списка пользователей:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }

  /**
   * Блокировка пользователя (только для администраторов)
   * Block user (admin only)
   *
   * @param userId - ID пользователя для блокировки / user ID to block
   * @param reason - причина блокировки / block reason
   * @returns Promise<void>
   * @throws Error если пользователь не найден / if user not found
   */
  async blockUser(userId: string, reason?: string): Promise<void> {
    try {
      // Получаем пользователя по ID
      // Get user by ID
      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      // Если пользователь не найден, выбрасываем ошибку
      // If user not found, throw error
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      // Блокируем пользователя
      // Block user
      user.isBlocked = true;

      // Сохраняем изменения в БД
      // Save changes to database
      await this.userRepository.save(user);

      // Логируем блокировку
      // Log block action
      console.log(`Пользователь ${user.email} заблокирован. Причина: ${reason || 'не указана'}`);
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при блокировке пользователя:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }

  /**
   * Разблокировка пользователя (только для администраторов)
   * Unblock user (admin only)
   *
   * @param userId - ID пользователя для разблокировки / user ID to unblock
   * @returns Promise<void>
   * @throws Error если пользователь не найден / if user not found
   */
  async unblockUser(userId: string): Promise<void> {
    try {
      // Получаем пользователя по ID
      // Get user by ID
      const user = await this.userRepository.findOne({
        where: { id: userId }
      });

      // Если пользователь не найден, выбрасываем ошибку
      // If user not found, throw error
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      // Разблокируем пользователя
      // Unblock user
      user.isBlocked = false;

      // Сохраняем изменения в БД
      // Save changes to database
      await this.userRepository.save(user);

      // Логируем разблокировку
      // Log unblock action
      console.log(`Пользователь ${user.email} разблокирован`);
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при разблокировке пользователя:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }
}

/**
 * Экспорт экземпляра сервиса (Singleton pattern)
 * Export service instance (Singleton pattern)
 */
export const userService = new UserService();

/**
 * ТЕСТЫ для user.service.ts
 *
 * Тест 1: Успешная регистрация пользователя
 * - Вызвать userService.register() с валидными данными
 * - Проверить, что возвращается объект с user, accessToken, refreshToken
 * - Проверить, что пользователь сохранен в БД
 * - Проверить, что пароль захеширован (не равен исходному)
 * - Проверить, что в ответе нет passwordHash
 *
 * Тест 2: Регистрация с дублирующимся email
 * - Создать пользователя с email test@example.com
 * - Попытаться зарегистрировать еще одного пользователя с тем же email
 * - Ожидать ошибку "Пользователь с таким email уже существует"
 *
 * Тест 3: Регистрация с дублирующимся username
 * - Создать пользователя с username "testuser"
 * - Попытаться зарегистрировать еще одного пользователя с тем же username
 * - Ожидать ошибку "Пользователь с таким username уже существует"
 *
 * Тест 4: Регистрация со слабым паролем
 * - Вызвать userService.register() с паролем "123"
 * - Ожидать ошибку валидации пароля
 *
 * Тест 5: Успешный вход пользователя по email
 * - Зарегистрировать пользователя
 * - Вызвать userService.login() с email и правильным паролем
 * - Проверить, что возвращается объект с user, accessToken, refreshToken
 * - Проверить, что lastLogin обновлен
 *
 * Тест 6: Успешный вход пользователя по username
 * - Зарегистрировать пользователя
 * - Вызвать userService.login() с username и правильным паролем
 * - Проверить успешный вход
 *
 * Тест 7: Вход с неверным паролем
 * - Зарегистрировать пользователя
 * - Вызвать userService.login() с неверным паролем
 * - Ожидать ошибку "Неверный email/username или пароль"
 *
 * Тест 8: Вход заблокированного пользователя
 * - Зарегистрировать пользователя
 * - Заблокировать пользователя (isBlocked = true)
 * - Попытаться войти
 * - Ожидать ошибку "Аккаунт заблокирован"
 *
 * Тест 9: Обновление access токена
 * - Зарегистрировать пользователя и получить refresh токен
 * - Вызвать userService.refreshAccessToken() с refresh токеном
 * - Проверить, что возвращается новый access токен
 *
 * Тест 10: Обновление access токена с невалидным refresh токеном
 * - Вызвать userService.refreshAccessToken() с невалидным токеном
 * - Ожидать ошибку "Недействительный или истекший refresh токен"
 *
 * Тест 11: Получение пользователя по ID
 * - Создать пользователя
 * - Вызвать userService.getUserById()
 * - Проверить, что возвращается пользователь
 * - Проверить, что в ответе нет passwordHash
 *
 * Тест 12: Обновление профиля пользователя
 * - Создать пользователя
 * - Вызвать userService.updateProfile() с новыми данными
 * - Проверить, что данные обновлены
 *
 * Тест 13: Изменение пароля
 * - Создать пользователя с паролем "OldPassword123!"
 * - Вызвать userService.changePassword() с правильным старым паролем
 * - Попытаться войти со старым паролем - ожидать ошибку
 * - Попытаться войти с новым паролем - ожидать успех
 *
 * Тест 14: Изменение пароля с неверным старым паролем
 * - Создать пользователя
 * - Вызвать userService.changePassword() с неверным старым паролем
 * - Ожидать ошибку "Неверный текущий пароль"
 *
 * Тест 15: Получение всех пользователей с фильтрацией по роли
 * - Создать 3 пользователя: 1 admin, 2 judge
 * - Вызвать userService.getAllUsers(UserRole.JUDGE)
 * - Проверить, что возвращается 2 пользователя
 *
 * Тест 16: Блокировка и разблокировка пользователя
 * - Создать пользователя
 * - Вызвать userService.blockUser()
 * - Проверить, что isBlocked = true
 * - Вызвать userService.unblockUser()
 * - Проверить, что isBlocked = false
 */
