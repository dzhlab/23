import { Request, Response, NextFunction } from 'express';
import { CompetitionService } from '../services/competition.service';

const competitionService = new CompetitionService();

export class CompetitionController {
  /**
   * Создание соревнования
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const competition = await competitionService.create(req.body, req.user!.userId);
      res.status(201).json({
        success: true,
        data: competition,
        message: 'Соревнование создано успешно',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение всех соревнований
   */
  static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const competitions = await competitionService.findAll();
      res.status(200).json({
        success: true,
        data: competitions,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получение соревнования по ID
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const competition = await competitionService.findById(req.params['id']!);
      res.status(200).json({
        success: true,
        data: competition,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Обновление соревнования
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const competition = await competitionService.update(req.params['id']!, req.body);
      res.status(200).json({
        success: true,
        data: competition,
        message: 'Соревнование обновлено успешно',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Удаление соревнования
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await competitionService.delete(req.params['id']!);
      res.status(200).json({
        success: true,
        message: 'Соревнование удалено успешно',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }
}
