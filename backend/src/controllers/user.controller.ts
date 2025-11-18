import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

const userService = new UserService();
const authService = new AuthService();

export class UserController {
  /**
   * Регистрация пользователя
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.register(req.body);
      res.status(201).json({
        success: true,
        data: user,
        message: 'Пользователь успешно зарегистрирован',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Вход пользователя
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        success: true,
        data: result,
        message: 'Вход выполнен успешно',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение текущего пользователя
   */
  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.findById(req.user!.userId);
      res.status(200).json({
        success: true,
        data: user,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение пользователя по ID
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.findById(req.params['id']!);
      res.status(200).json({
        success: true,
        data: user,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение всех пользователей
   */
  static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.findAll();
      res.status(200).json({
        success: true,
        data: users,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Обновление профиля
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.update(req.params['id']!, req.body);
      res.status(200).json({
        success: true,
        data: user,
        message: 'Профиль обновлен успешно',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Удаление пользователя
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.delete(req.params['id']!);
      res.status(200).json({
        success: true,
        message: 'Пользователь удален успешно',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }
}
