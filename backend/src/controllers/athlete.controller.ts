import { Request, Response, NextFunction } from 'express';
import { AthleteService } from '../services/athlete.service';

const athleteService = new AthleteService();

export class AthleteController {
  /**
   * Создание профиля спортсмена
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const athlete = await athleteService.create(req.body);
      res.status(201).json({
        success: true,
        data: athlete,
        message: 'Профиль спортсмена создан успешно',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение всех спортсменов
   */
  static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const athletes = await athleteService.findAll();
      res.status(200).json({
        success: true,
        data: athletes,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение спортсмена по ID
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const athlete = await athleteService.findById(req.params['id']!);
      res.status(200).json({
        success: true,
        data: athlete,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение спортсмена по userId
   */
  static async getByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const athlete = await athleteService.findByUserId(req.params['userId']!);
      res.status(200).json({
        success: true,
        data: athlete,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Обновление профиля спортсмена
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const athlete = await athleteService.update(req.params['id']!, req.body);
      res.status(200).json({
        success: true,
        data: athlete,
        message: 'Профиль спортсмена обновлен успешно',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Удаление спортсмена
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await athleteService.delete(req.params['id']!);
      res.status(200).json({
        success: true,
        message: 'Профиль спортсмена удален успешно',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }
}
