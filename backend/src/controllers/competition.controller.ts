/**
 * Файл: controllers/competition.controller.ts
 * Описание: Контроллер для обработки HTTP запросов к API соревнований
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: express, services/competition.service, middleware/auth, middleware/authorize
 */

// Импорт типов Express для работы с запросами и ответами
// Import Express types for request and response handling
import { Request, Response, NextFunction } from 'express';

// Импорт сервиса соревнований для бизнес-логики
// Import competition service for business logic
import {
  competitionService,
  CreateCompetitionData,
  UpdateCompetitionData,
  CompetitionFilter
} from '../services/competition.service';

// Импорт типов для соревнований
// Import types for competitions
import { CompetitionType, CompetitionStatus } from '../types/common.types';

/**
 * Контроллер для работы с соревнованиями
 * Controller for competition operations
 */
export class CompetitionController {
  /**
   * Создание нового соревнования
   * Create new competition
   * POST /api/competitions
   * Требуется авторизация: ADMIN, ORGANIZER / Authorization required: ADMIN, ORGANIZER
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async createCompetition(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Формируем данные для создания соревнования из тела запроса
      // Form competition creation data from request body
      const createData: CreateCompetitionData = {
        name: req.body.name,
        fullName: req.body.fullName,
        description: req.body.description,
        type: req.body.type,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        location: req.body.location,
        venue: req.body.venue,
        organizerId: req.body.organizerId || req.user!.userId, // Используем текущего пользователя если не указан / Use current user if not specified
        chiefJudgeId: req.body.chiefJudgeId,
        registrationStartDate: req.body.registrationStartDate ? new Date(req.body.registrationStartDate) : undefined,
        registrationEndDate: req.body.registrationEndDate ? new Date(req.body.registrationEndDate) : undefined,
        maxParticipants: req.body.maxParticipants,
        entryFee: req.body.entryFee
      };

      // Вызываем сервис для создания соревнования
      // Call service to create competition
      const competition = await competitionService.createCompetition(createData);

      // Возвращаем успешный ответ с кодом 201 (Created)
      // Return success response with code 201 (Created)
      res.status(201).json({
        success: true,
        message: 'Соревнование успешно создано',
        data: competition
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Получение соревнования по ID
   * Get competition by ID
   * GET /api/competitions/:id
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async getCompetitionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Извлекаем ID соревнования из параметров URL
      // Extract competition ID from URL parameters
      const competitionId = req.params.id;

      // Проверяем, нужно ли включать связанные данные (relations)
      // Check if need to include related data (relations)
      const includeRelations = req.query.includeRelations === 'true';

      // Вызываем сервис для получения соревнования
      // Call service to get competition
      const competition = await competitionService.getCompetitionById(competitionId, includeRelations);

      // Возвращаем успешный ответ с данными соревнования
      // Return success response with competition data
      res.status(200).json({
        success: true,
        message: 'Соревнование найдено',
        data: competition
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Получение списка соревнований с фильтрацией
   * Get list of competitions with filtering
   * GET /api/competitions
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async getCompetitions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Формируем объект фильтра из query параметров
      // Form filter object from query parameters
      const filter: CompetitionFilter = {};

      // Фильтр по статусу / Filter by status
      if (req.query.status) {
        filter.status = req.query.status as CompetitionStatus;
      }

      // Фильтр по типу / Filter by type
      if (req.query.type) {
        filter.type = req.query.type as CompetitionType;
      }

      // Фильтр по организатору / Filter by organizer
      if (req.query.organizerId) {
        filter.organizerId = req.query.organizerId as string;
      }

      // Фильтр по дате начала (от) / Filter by start date (from)
      if (req.query.startDateFrom) {
        filter.startDateFrom = new Date(req.query.startDateFrom as string);
      }

      // Фильтр по дате начала (до) / Filter by start date (to)
      if (req.query.startDateTo) {
        filter.startDateTo = new Date(req.query.startDateTo as string);
      }

      // Фильтр по местоположению / Filter by location
      if (req.query.location) {
        filter.location = req.query.location as string;
      }

      // Фильтр по открытой регистрации / Filter by open registration
      if (req.query.registrationOpen !== undefined) {
        filter.registrationOpen = req.query.registrationOpen === 'true';
      }

      // Вызываем сервис для получения списка соревнований
      // Call service to get competitions list
      const competitions = await competitionService.getCompetitions(filter);

      // Возвращаем успешный ответ со списком соревнований
      // Return success response with competitions list
      res.status(200).json({
        success: true,
        message: 'Список соревнований получен',
        data: competitions,
        count: competitions.length
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Обновление соревнования
   * Update competition
   * PUT /api/competitions/:id
   * Требуется авторизация: ADMIN, ORGANIZER / Authorization required: ADMIN, ORGANIZER
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async updateCompetition(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Извлекаем ID соревнования из параметров URL
      // Extract competition ID from URL parameters
      const competitionId = req.params.id;

      // Формируем объект данных для обновления из тела запроса
      // Form update data object from request body
      const updateData: UpdateCompetitionData = {};

      // Обновляем только переданные поля / Update only provided fields
      if (req.body.name !== undefined) updateData.name = req.body.name;
      if (req.body.fullName !== undefined) updateData.fullName = req.body.fullName;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.type !== undefined) updateData.type = req.body.type;
      if (req.body.status !== undefined) updateData.status = req.body.status;
      if (req.body.startDate !== undefined) updateData.startDate = new Date(req.body.startDate);
      if (req.body.endDate !== undefined) updateData.endDate = new Date(req.body.endDate);
      if (req.body.location !== undefined) updateData.location = req.body.location;
      if (req.body.venue !== undefined) updateData.venue = req.body.venue;
      if (req.body.chiefJudgeId !== undefined) updateData.chiefJudgeId = req.body.chiefJudgeId;
      if (req.body.registrationOpen !== undefined) updateData.registrationOpen = req.body.registrationOpen;
      if (req.body.registrationStartDate !== undefined) {
        updateData.registrationStartDate = new Date(req.body.registrationStartDate);
      }
      if (req.body.registrationEndDate !== undefined) {
        updateData.registrationEndDate = new Date(req.body.registrationEndDate);
      }
      if (req.body.maxParticipants !== undefined) updateData.maxParticipants = req.body.maxParticipants;
      if (req.body.entryFee !== undefined) updateData.entryFee = req.body.entryFee;

      // Вызываем сервис для обновления соревнования
      // Call service to update competition
      const updatedCompetition = await competitionService.updateCompetition(competitionId, updateData);

      // Возвращаем успешный ответ с обновленными данными
      // Return success response with updated data
      res.status(200).json({
        success: true,
        message: 'Соревнование успешно обновлено',
        data: updatedCompetition
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Публикация соревнования
   * Publish competition
   * POST /api/competitions/:id/publish
   * Требуется авторизация: ADMIN, ORGANIZER / Authorization required: ADMIN, ORGANIZER
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async publishCompetition(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Извлекаем ID соревнования из параметров URL
      // Extract competition ID from URL parameters
      const competitionId = req.params.id;

      // Вызываем сервис для публикации соревнования
      // Call service to publish competition
      const publishedCompetition = await competitionService.publishCompetition(competitionId);

      // Возвращаем успешный ответ
      // Return success response
      res.status(200).json({
        success: true,
        message: 'Соревнование успешно опубликовано',
        data: publishedCompetition
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Отмена соревнования
   * Cancel competition
   * POST /api/competitions/:id/cancel
   * Требуется авторизация: ADMIN, ORGANIZER / Authorization required: ADMIN, ORGANIZER
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async cancelCompetition(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Извлекаем ID соревнования из параметров URL
      // Extract competition ID from URL parameters
      const competitionId = req.params.id;

      // Извлекаем причину отмены из тела запроса (необязательно)
      // Extract cancellation reason from request body (optional)
      const { reason } = req.body;

      // Вызываем сервис для отмены соревнования
      // Call service to cancel competition
      const cancelledCompetition = await competitionService.cancelCompetition(competitionId, reason);

      // Возвращаем успешный ответ
      // Return success response
      res.status(200).json({
        success: true,
        message: 'Соревнование успешно отменено',
        data: cancelledCompetition
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Удаление соревнования (только черновики)
   * Delete competition (drafts only)
   * DELETE /api/competitions/:id
   * Требуется авторизация: ADMIN, ORGANIZER / Authorization required: ADMIN, ORGANIZER
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async deleteCompetition(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Извлекаем ID соревнования из параметров URL
      // Extract competition ID from URL parameters
      const competitionId = req.params.id;

      // Вызываем сервис для удаления соревнования
      // Call service to delete competition
      await competitionService.deleteCompetition(competitionId);

      // Возвращаем успешный ответ без данных (204 No Content)
      // Return success response without data (204 No Content)
      res.status(204).send();
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Получение статистики соревнования
   * Get competition statistics
   * GET /api/competitions/:id/statistics
   * Требуется аутентификация / Authentication required
   *
   * @param req - Express request объект / Express request object
   * @param res - Express response объект / Express response object
   * @param next - Express next function для обработки ошибок / Express next function for error handling
   */
  async getCompetitionStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Извлекаем ID соревнования из параметров URL
      // Extract competition ID from URL parameters
      const competitionId = req.params.id;

      // Вызываем сервис для получения статистики
      // Call service to get statistics
      const statistics = await competitionService.getCompetitionStatistics(competitionId);

      // Возвращаем успешный ответ со статистикой
      // Return success response with statistics
      res.status(200).json({
        success: true,
        message: 'Статистика соревнования получена',
        data: statistics
      });
    } catch (error) {
      // Передаем ошибку в middleware обработки ошибок
      // Pass error to error handling middleware
      next(error);
    }
  }
}

/**
 * Экспорт экземпляра контроллера (Singleton pattern)
 * Export controller instance (Singleton pattern)
 */
export const competitionController = new CompetitionController();

/**
 * ТЕСТЫ для competition.controller.ts
 *
 * Тест 1: POST /api/competitions - Успешное создание соревнования
 * - Создать пользователя с ролью ORGANIZER
 * - Отправить POST запрос с валидными данными
 * - Проверить статус код 201
 * - Проверить наличие success: true
 * - Проверить данные соревнования в ответе
 *
 * Тест 2: POST /api/competitions - Без авторизации
 * - Отправить POST запрос без токена аутентификации
 * - Проверить статус код 401 (Unauthorized)
 *
 * Тест 3: POST /api/competitions - С неправильной ролью
 * - Создать пользователя с ролью SPECTATOR
 * - Отправить POST запрос от имени зрителя
 * - Проверить статус код 403 (Forbidden)
 *
 * Тест 4: POST /api/competitions - С неправильными датами
 * - Отправить POST запрос где endDate <= startDate
 * - Проверить статус код 400
 * - Проверить сообщение об ошибке
 *
 * Тест 5: GET /api/competitions/:id - Получение соревнования
 * - Создать соревнование
 * - Отправить GET запрос с ID соревнования
 * - Проверить статус код 200
 * - Проверить корректность данных
 *
 * Тест 6: GET /api/competitions/:id - С relations
 * - Создать соревнование с организатором
 * - Отправить GET запрос с параметром includeRelations=true
 * - Проверить наличие объектов organizer и chiefJudge
 *
 * Тест 7: GET /api/competitions - Получение списка без фильтра
 * - Создать 3 соревнования
 * - Отправить GET запрос на /api/competitions
 * - Проверить статус код 200
 * - Проверить count = 3
 *
 * Тест 8: GET /api/competitions - Фильтрация по статусу
 * - Создать 2 соревнования DRAFT и 1 PUBLISHED
 * - Отправить GET запрос с query параметром ?status=draft
 * - Проверить, что возвращается только 2 соревнования
 *
 * Тест 9: GET /api/competitions - Фильтрация по типу
 * - Создать INDIVIDUAL и GROUP соревнования
 * - Отправить GET запрос с ?type=individual
 * - Проверить, что возвращаются только INDIVIDUAL
 *
 * Тест 10: GET /api/competitions - Фильтрация по датам
 * - Создать соревнования с разными датами
 * - Отправить GET запрос с ?startDateFrom=... &startDateTo=...
 * - Проверить, что возвращаются только соревнования в диапазоне
 *
 * Тест 11: PUT /api/competitions/:id - Обновление соревнования
 * - Создать соревнование
 * - Отправить PUT запрос с новыми данными
 * - Проверить статус код 200
 * - Проверить обновленные данные
 *
 * Тест 12: POST /api/competitions/:id/publish - Публикация
 * - Создать соревнование в статусе DRAFT с главным судьей
 * - Отправить POST запрос на /publish
 * - Проверить статус код 200
 * - Проверить, что status = PUBLISHED
 *
 * Тест 13: POST /api/competitions/:id/publish - Без главного судьи
 * - Создать соревнование без chiefJudgeId
 * - Попытаться опубликовать
 * - Проверить статус код 400
 * - Проверить сообщение об ошибке
 *
 * Тест 14: POST /api/competitions/:id/cancel - Отмена соревнования
 * - Создать и опубликовать соревнование
 * - Отправить POST запрос на /cancel с причиной
 * - Проверить статус код 200
 * - Проверить, что status = CANCELLED
 * - Проверить, что registrationOpen = false
 *
 * Тест 15: DELETE /api/competitions/:id - Удаление черновика
 * - Создать соревнование в статусе DRAFT
 * - Отправить DELETE запрос
 * - Проверить статус код 204
 * - Проверить, что соревнование удалено из БД
 *
 * Тест 16: DELETE /api/competitions/:id - Попытка удалить опубликованное
 * - Создать и опубликовать соревнование
 * - Отправить DELETE запрос
 * - Проверить статус код 400
 * - Проверить сообщение об ошибке
 *
 * Тест 17: GET /api/competitions/:id/statistics - Получение статистики
 * - Создать соревнование
 * - Отправить GET запрос на /statistics
 * - Проверить статус код 200
 * - Проверить наличие totalParticipants, totalPerformances и т.д.
 */
