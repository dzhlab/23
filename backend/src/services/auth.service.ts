import { LoginUserData, AuthResult, AuthTokens, JwtPayload } from '../types/user.types';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

/**
 * Сервис аутентификации
 */
export class AuthService {
  private userService: UserService;
  private jwtSecret: string;
  private jwtRefreshSecret: string;
  private jwtExpiresIn: string;
  private jwtRefreshExpiresIn: string;

  constructor() {
    this.userService = new UserService();
    this.jwtSecret = process.env['JWT_SECRET'] || 'default-secret';
    this.jwtRefreshSecret = process.env['JWT_REFRESH_SECRET'] || 'default-refresh-secret';
    this.jwtExpiresIn = process.env['JWT_EXPIRES_IN'] || '15m';
    this.jwtRefreshExpiresIn = process.env['JWT_REFRESH_EXPIRES_IN'] || '7d';
  }

  /**
   * Вход пользователя
   */
  async login(data: LoginUserData): Promise<AuthResult> {
    // Поиск пользователя по email или username
    let user = await this.userService.findByEmail(data.emailOrUsername);
    if (!user) {
      user = await this.userService.findByUsername(data.emailOrUsername);
    }

    if (!user) {
      throw new Error('Неверный email/username или пароль');
    }

    // Проверка блокировки
    if (user.isBlocked) {
      throw new Error('Учетная запись заблокирована');
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Неверный email/username или пароль');
    }

    // Обновление времени последнего входа
    await this.userService.updateLastLogin(user.id);

    // Генерация токенов
    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    // Получение безопасной информации о пользователе
    const safeUser = await this.userService.findById(user.id);
    if (!safeUser) {
      throw new Error('Ошибка получения информации о пользователе');
    }

    return {
      user: safeUser,
      tokens,
    };
  }

  /**
   * Обновление access токена
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = jwt.verify(refreshToken, this.jwtRefreshSecret) as JwtPayload;

      // Проверка существования пользователя
      const user = await this.userService.findById(payload.userId);
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      // Генерация новых токенов
      return this.generateTokens({
        userId: payload.userId,
        email: payload.email,
        username: payload.username,
        role: payload.role,
      });
    } catch (error) {
      throw new Error('Недействительный refresh token');
    }
  }

  /**
   * Верификация access токена
   */
  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JwtPayload;
    } catch (error) {
      throw new Error('Недействительный токен');
    }
  }

  /**
   * Генерация JWT токенов
   */
  private generateTokens(payload: Omit<JwtPayload, 'iat' | 'exp'>): AuthTokens {
    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });

    const refreshToken = jwt.sign(payload, this.jwtRefreshSecret, {
      expiresIn: this.jwtRefreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
