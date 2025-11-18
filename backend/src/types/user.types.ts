/**
 * Типы данных для пользователей и аутентификации
 */

import { BaseEntityFields } from './common.types';

/**
 * Роли пользователей в системе
 */
export enum UserRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  CHIEF_JUDGE = 'chief_judge',
  DIFFICULTY_JUDGE = 'difficulty_judge',
  EXECUTION_JUDGE = 'execution_judge',
  ARTISTIC_JUDGE = 'artistic_judge',
  LINE_JUDGE = 'line_judge',
  TIME_JUDGE = 'time_judge',
  COACH = 'coach',
  ATHLETE = 'athlete',
  SPECTATOR = 'spectator',
  MODERATOR = 'moderator',
  ANALYTICS = 'analytics',
  TECHNICAL_DELEGATE = 'technical_delegate',
}

/**
 * Полная информация о пользователе
 */
export interface User extends BaseEntityFields {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: Date;
  country?: string;
  city?: string;
  organization?: string;
  role: UserRole;
  isBlocked: boolean;
  emailVerified: boolean;
  lastLoginAt?: Date;
}

/**
 * Данные для регистрации пользователя
 */
export interface RegisterUserData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: Date;
  country?: string;
  city?: string;
  organization?: string;
  role?: UserRole;
}

/**
 * Данные для входа пользователя
 */
export interface LoginUserData {
  emailOrUsername: string;
  password: string;
}

/**
 * Данные для обновления профиля пользователя
 */
export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: Date;
  country?: string;
  city?: string;
  organization?: string;
}

/**
 * Данные для смены пароля
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

/**
 * JWT токены
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Payload JWT токена
 */
export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Безопасная информация о пользователе (без пароля)
 */
export type SafeUser = Omit<User, 'password'>;

/**
 * Публичная информация о пользователе
 */
export interface PublicUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  country?: string;
  organization?: string;
  role: UserRole;
}

/**
 * Результат аутентификации
 */
export interface AuthResult {
  user: SafeUser;
  tokens: AuthTokens;
}
