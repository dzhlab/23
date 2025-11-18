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

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  country?: string;
  city?: string;
  organization?: string;
  role: UserRole;
  isBlocked: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  country?: string;
  city?: string;
  organization?: string;
}

export interface LoginData {
  emailOrUsername: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: User;
  tokens: AuthTokens;
}
