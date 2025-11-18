import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthenticationError } from '../utils/errors.util';
import { JwtPayload } from '../types/user.types';

// Расширение типа Request
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware для проверки JWT токена
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Токен не предоставлен');
    }

    const token = authHeader.substring(7);
    const authService = new AuthService();
    const payload = authService.verifyToken(token);

    req.user = payload;
    next();
  } catch (error) {
    next(new AuthenticationError('Недействительный токен'));
  }
};
