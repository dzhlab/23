/**
 * Файл: types/user.types.ts
 * Описание: TypeScript типы для пользователей и аутентификации
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: Нет
 */

/**
 * Перечисление ролей пользователей в системе
 * Enumeration of user roles in the system
 */
export enum UserRole {
  ADMIN = 'admin',                               // Администратор системы / System administrator
  ORGANIZER = 'organizer',                       // Организатор соревнований / Competition organizer
  CHIEF_JUDGE = 'chief_judge',                   // Главный судья / Chief judge
  DIFFICULTY_JUDGE = 'difficulty_judge',         // Судья по сложности / Difficulty judge
  EXECUTION_JUDGE = 'execution_judge',           // Судья по исполнению / Execution judge
  ARTISTIC_JUDGE = 'artistic_judge',             // Судья по артистизму / Artistic judge
  LINE_JUDGE = 'line_judge',                     // Судья на линии / Line judge
  TIME_JUDGE = 'time_judge',                     // Судья-хронометрист / Time judge
  COACH = 'coach',                               // Тренер / Coach
  ATHLETE = 'athlete',                           // Спортсменка / Athlete
  SPECTATOR = 'spectator',                       // Зритель / Spectator
  MODERATOR = 'moderator',                       // Модератор / Moderator
  ANALYTICS = 'analytics',                       // Аналитик / Analytics
  TECHNICAL_DELEGATE = 'technical_delegate'      // Технический делегат / Technical delegate
}

/**
 * Интерфейс пользователя
 * User interface
 */
export interface User {
  // Уникальный идентификатор пользователя / Unique user identifier
  id: string;

  // Email пользователя (уникальный) / User email (unique)
  email: string;

  // Имя пользователя (логин) / Username (login)
  username: string;

  // Имя / First name
  firstName: string;

  // Фамилия / Last name
  lastName: string;

  // Отчество (опционально) / Middle name (optional)
  middleName?: string;

  // Дата рождения / Date of birth
  dateOfBirth?: Date;

  // Страна / Country
  country?: string;

  // Город / City
  city?: string;

  // Организация / Organization
  organization?: string;

  // Роль пользователя / User role
  role: UserRole;

  // Флаг блокировки / Block flag
  isBlocked: boolean;

  // Дата создания / Creation date
  createdAt: Date;

  // Дата последнего обновления / Last update date
  updatedAt: Date;
}

/**
 * Данные для регистрации пользователя
 * User registration data
 */
export interface RegisterUserData {
  // Email (обязательно) / Email (required)
  email: string;

  // Пароль (обязательно) / Password (required)
  password: string;

  // Имя пользователя (обязательно) / Username (required)
  username: string;

  // Имя (обязательно) / First name (required)
  firstName: string;

  // Фамилия (обязательно) / Last name (required)
  lastName: string;

  // Отчество (опционально) / Middle name (optional)
  middleName?: string;

  // Дата рождения (опционально) / Date of birth (optional)
  dateOfBirth?: Date;

  // Страна (опционально) / Country (optional)
  country?: string;

  // Город (опционально) / City (optional)
  city?: string;

  // Организация (опционально) / Organization (optional)
  organization?: string;

  // Роль (опционально, по умолчанию spectator) / Role (optional, default spectator)
  role?: UserRole;
}

/**
 * Данные для входа пользователя
 * User login data
 */
export interface LoginUserData {
  // Email или username / Email or username
  emailOrUsername: string;

  // Пароль / Password
  password: string;
}

/**
 * Результат аутентификации
 * Authentication result
 */
export interface AuthResult {
  // Access токен (JWT) / Access token (JWT)
  accessToken: string;

  // Refresh токен / Refresh token
  refreshToken: string;

  // Данные пользователя / User data
  user: User;
}

/**
 * Данные для обновления профиля
 * Profile update data
 */
export interface UpdateProfileData {
  // Имя пользователя / Username
  username?: string;

  // Имя / First name
  firstName?: string;

  // Фамилия / Last name
  lastName?: string;

  // Отчество / Middle name
  middleName?: string;

  // Дата рождения / Date of birth
  dateOfBirth?: Date;

  // Страна / Country
  country?: string;

  // Город / City
  city?: string;

  // Организация / Organization
  organization?: string;
}

/**
 * Данные для смены пароля
 * Password change data
 */
export interface ChangePasswordData {
  // Старый пароль / Old password
  oldPassword: string;

  // Новый пароль / New password
  newPassword: string;
}

/**
 * ТЕСТЫ для user.types.ts
 *
 * Тест 1: UserRole содержит все необходимые роли
 * - Проверить наличие всех 14 ролей
 * - Проверить правильность значений enum
 *
 * Тест 2: User интерфейс содержит все обязательные поля
 * - Проверить наличие id, email, username, firstName, lastName, role, isBlocked
 * - Проверить типы полей
 *
 * Тест 3: RegisterUserData требует минимальные поля
 * - email, password, username, firstName, lastName должны быть обязательными
 * - Остальные поля опциональные
 *
 * Тест 4: LoginUserData принимает email или username
 * - emailOrUsername должен принимать строку
 * - password обязателен
 *
 * Тест 5: AuthResult содержит токены и данные пользователя
 * - accessToken, refreshToken, user должны присутствовать
 * - user должен соответствовать интерфейсу User
 */
