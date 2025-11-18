/**
 * Файл: types/user.types.ts
 * Описание: TypeScript типы и интерфейсы для пользователей и аутентификации
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: common.types.ts
 */

// Импорт общих типов
import { UUID, Timestamp, UserRole } from './common.types';

/**
 * Интерфейс для пользователя системы
 * Базовая сущность для всех пользователей
 */
export interface User {
  // Уникальный идентификатор пользователя
  id: UUID;

  // Email (используется для входа)
  email: string;

  // Хешированный пароль
  passwordHash: string;

  // Имя пользователя (username)
  username: string;

  // Фамилия
  lastName: string;

  // Имя
  firstName: string;

  // Отчество
  middleName?: string;

  // Роль пользователя в системе
  role: UserRole;

  // Телефон
  phone?: string;

  // Аватар (URL)
  avatar?: string;

  // Язык интерфейса (ru, en)
  language: string;

  // Часовой пояс
  timezone: string;

  // Email подтвержден
  emailVerified: boolean;

  // Токен подтверждения email
  emailVerificationToken?: string;

  // Срок действия токена подтверждения
  emailVerificationExpires?: Timestamp;

  // Телефон подтвержден
  phoneVerified: boolean;

  // Аккаунт активен
  isActive: boolean;

  // Аккаунт заблокирован
  isBlocked: boolean;

  // Причина блокировки
  blockReason?: string;

  // Дата последнего входа
  lastLoginAt?: Timestamp;

  // IP последнего входа
  lastLoginIp?: string;

  // Количество неудачных попыток входа
  failedLoginAttempts: number;

  // Дата блокировки за неудачные попытки
  accountLockedUntil?: Timestamp;

  // Настройки уведомлений
  notificationSettings?: NotificationSettings;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для регистрации нового пользователя
 */
export interface RegisterUserDto {
  // Email
  email: string;

  // Пароль (минимум 8 символов)
  password: string;

  // Подтверждение пароля
  confirmPassword: string;

  // Имя пользователя
  username: string;

  // ФИО
  firstName: string;
  lastName: string;
  middleName?: string;

  // Роль (по умолчанию spectator)
  role?: UserRole;

  // Телефон
  phone?: string;

  // Язык
  language?: string;

  // Часовой пояс
  timezone?: string;
}

/**
 * Интерфейс для входа в систему
 */
export interface LoginDto {
  // Email или username
  emailOrUsername: string;

  // Пароль
  password: string;

  // Запомнить меня (для длительной сессии)
  rememberMe?: boolean;
}

/**
 * Интерфейс для обновления профиля пользователя
 */
export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
  avatar?: string;
  language?: string;
  timezone?: string;
}

/**
 * Интерфейс для смены пароля
 */
export interface ChangePasswordDto {
  // Текущий пароль
  currentPassword: string;

  // Новый пароль
  newPassword: string;

  // Подтверждение нового пароля
  confirmNewPassword: string;
}

/**
 * Интерфейс для восстановления пароля
 */
export interface ResetPasswordDto {
  // Email
  email: string;
}

/**
 * Интерфейс для установки нового пароля после сброса
 */
export interface SetNewPasswordDto {
  // Токен восстановления
  resetToken: string;

  // Новый пароль
  newPassword: string;

  // Подтверждение пароля
  confirmPassword: string;
}

/**
 * Интерфейс для токена сброса пароля
 * Хранится отдельно от User для безопасности
 */
export interface PasswordResetToken {
  // Уникальный идентификатор
  id: UUID;

  // ID пользователя
  userId: UUID;

  // Токен
  token: string;

  // Срок действия токена
  expiresAt: Timestamp;

  // Использован ли токен
  used: boolean;

  // Временные метки
  createdAt: Timestamp;
}

/**
 * Интерфейс для JWT токена
 * Содержит информацию для авторизации
 */
export interface JwtPayload {
  // ID пользователя
  userId: UUID;

  // Email
  email: string;

  // Роль
  role: UserRole;

  // Время выпуска токена (issued at)
  iat: number;

  // Время истечения токена (expiration)
  exp: number;
}

/**
 * Интерфейс для refresh токена
 * Используется для обновления access токена
 */
export interface RefreshToken {
  // Уникальный идентификатор
  id: UUID;

  // ID пользователя
  userId: UUID;

  // Токен
  token: string;

  // Срок действия
  expiresAt: Timestamp;

  // Отозван ли токен
  revoked: boolean;

  // IP адрес при создании
  createdByIp: string;

  // Заменен ли токен новым
  replacedByToken?: string;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для ответа после успешной аутентификации
 */
export interface AuthResponse {
  // Access токен (короткий срок жизни, 15 минут)
  accessToken: string;

  // Refresh токен (длительный срок, 7 дней)
  refreshToken: string;

  // Тип токена (всегда Bearer)
  tokenType: string;

  // Срок действия access токена (в секундах)
  expiresIn: number;

  // Информация о пользователе
  user: {
    id: UUID;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatar?: string;
  };
}

/**
 * Интерфейс для настроек уведомлений
 * Определяет, какие уведомления получает пользователь
 */
export interface NotificationSettings {
  // Email уведомления
  emailNotifications: boolean;

  // Push уведомления в браузере
  pushNotifications: boolean;

  // SMS уведомления
  smsNotifications: boolean;

  // Уведомления о новых соревнованиях
  newCompetitions: boolean;

  // Уведомления об изменениях в расписании
  scheduleChanges: boolean;

  // Уведомления о результатах
  results: boolean;

  // Уведомления о начале выступления
  performanceStart: boolean;

  // Уведомления системы
  systemNotifications: boolean;
}

/**
 * Интерфейс для сессии пользователя
 * Отслеживание активных сессий
 */
export interface UserSession {
  // Уникальный идентификатор сессии
  id: UUID;

  // ID пользователя
  userId: UUID;

  // ID refresh токена
  refreshTokenId: UUID;

  // IP адрес
  ipAddress: string;

  // User Agent (браузер и ОС)
  userAgent: string;

  // Устройство (desktop, mobile, tablet)
  device: string;

  // Браузер
  browser?: string;

  // Операционная система
  os?: string;

  // Последняя активность
  lastActivityAt: Timestamp;

  // Срок истечения сессии
  expiresAt: Timestamp;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для логирования действий пользователя
 * Аудит всех важных операций
 */
export interface UserAuditLog {
  // Уникальный идентификатор
  id: UUID;

  // ID пользователя
  userId: UUID;

  // Тип действия
  action: UserAuditAction;

  // Описание действия
  description: string;

  // IP адрес
  ipAddress: string;

  // User Agent
  userAgent?: string;

  // Дополнительные данные (JSON)
  metadata?: any;

  // Результат действия (success, failure)
  result: 'success' | 'failure';

  // Сообщение об ошибке (если есть)
  errorMessage?: string;

  // Временная метка
  timestamp: Timestamp;

  // Временные метки
  createdAt: Timestamp;
}

/**
 * Перечисление типов действий для аудита
 * Все важные операции пользователя
 */
export enum UserAuditAction {
  // Аутентификация
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_RESET_REQUESTED = 'password_reset_requested',
  PASSWORD_CHANGED = 'password_changed',
  EMAIL_VERIFIED = 'email_verified',

  // Управление профилем
  PROFILE_UPDATED = 'profile_updated',
  AVATAR_UPDATED = 'avatar_updated',
  SETTINGS_CHANGED = 'settings_changed',

  // Управление соревнованиями
  COMPETITION_CREATED = 'competition_created',
  COMPETITION_UPDATED = 'competition_updated',
  COMPETITION_DELETED = 'competition_deleted',
  COMPETITION_PUBLISHED = 'competition_published',

  // Судейство
  SCORE_SUBMITTED = 'score_submitted',
  SCORE_UPDATED = 'score_updated',
  SCORE_APPROVED = 'score_approved',
  SCORE_REJECTED = 'score_rejected',

  // Администрирование
  USER_CREATED = 'user_created',
  USER_UPDATED = 'user_updated',
  USER_BLOCKED = 'user_blocked',
  USER_UNBLOCKED = 'user_unblocked',
  USER_DELETED = 'user_deleted',
  ROLE_CHANGED = 'role_changed',

  // Другие действия
  FILE_UPLOADED = 'file_uploaded',
  FILE_DELETED = 'file_deleted',
  REPORT_GENERATED = 'report_generated',
  DATA_EXPORTED = 'data_exported',
  DATA_IMPORTED = 'data_imported'
}

/**
 * Интерфейс для разрешений (permissions)
 * Детальный контроль доступа к функциям
 */
export interface Permission {
  // Уникальный идентификатор
  id: UUID;

  // Название разрешения
  name: string;

  // Код разрешения (например: 'competition:create')
  code: string;

  // Описание
  description?: string;

  // Категория разрешения
  category: PermissionCategory;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Перечисление категорий разрешений
 * Группировка разрешений по модулям
 */
export enum PermissionCategory {
  // Управление соревнованиями
  COMPETITIONS = 'competitions',

  // Управление участниками
  PARTICIPANTS = 'participants',

  // Судейство
  JUDGING = 'judging',

  // Управление пользователями
  USERS = 'users',

  // Отчеты
  REPORTS = 'reports',

  // Настройки системы
  SYSTEM = 'system'
}

/**
 * Интерфейс для связи роли с разрешениями
 * Определяет, какие разрешения имеет каждая роль
 */
export interface RolePermission {
  // Уникальный идентификатор
  id: UUID;

  // Роль
  role: UserRole;

  // ID разрешения
  permissionId: UUID;

  // Временные метки
  createdAt: Timestamp;
}

/**
 * ТЕСТЫ для user.types.ts
 *
 * Тест 1: Регистрация пользователя
 * - Создать RegisterUserDto с валидными данными
 * - Проверить, что password === confirmPassword
 * - Проверить длину пароля >= 8 символов
 * - Создать User с хешированным паролем
 *
 * Тест 2: Аутентификация пользователя
 * - Создать LoginDto
 * - Проверить пароль
 * - Создать JWT токен с правильным payload
 * - Создать refresh токен
 * - Вернуть AuthResponse
 *
 * Тест 3: Проверка JWT токена
 * - Создать JwtPayload
 * - Проверить срок действия (exp > current time)
 * - Извлечь userId и role
 * - Проверить валидность токена
 *
 * Тест 4: Обновление токена
 * - Использовать валидный refresh токен
 * - Проверить, что токен не отозван (revoked === false)
 * - Создать новый access токен
 * - Создать новый refresh токен
 * - Отозвать старый refresh токен
 *
 * Тест 5: Смена пароля
 * - Создать ChangePasswordDto
 * - Проверить текущий пароль
 * - Проверить, что newPassword === confirmNewPassword
 * - Хешировать новый пароль
 * - Обновить passwordHash в User
 *
 * Тест 6: Восстановление пароля
 * - Создать ResetPasswordDto с email
 * - Создать PasswordResetToken
 * - Отправить email с токеном
 * - Использовать токен для установки нового пароля через SetNewPasswordDto
 * - Отметить токен как использованный
 *
 * Тест 7: Аудит действий
 * - Создать UserAuditLog при входе пользователя
 * - Проверить action === UserAuditAction.LOGIN
 * - Проверить наличие IP адреса и User Agent
 * - Проверить result === 'success'
 *
 * Тест 8: Управление сессиями
 * - Создать UserSession при входе
 * - Обновить lastActivityAt при каждом запросе
 * - Удалить сессию при выходе или истечении срока
 * - Проверить количество активных сессий пользователя
 *
 * Тест 9: Разрешения ролей
 * - Создать Permission для действия 'competition:create'
 * - Связать разрешение с ролью ORGANIZER через RolePermission
 * - Проверить, что пользователь с ролью ORGANIZER может создавать соревнования
 * - Проверить, что пользователь с ролью SPECTATOR не может
 */
