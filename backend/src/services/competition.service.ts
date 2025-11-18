/**
 * Файл: services/competition.service.ts
 * Описание: Сервис для работы с соревнованиями (создание, управление, регистрация участников)
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: typeorm, entities, types
 */

// Импорт DataSource для работы с базой данных
// Import DataSource for database operations
import { AppDataSource } from '../config/database.config';

// Импорт Repository и FindOptionsWhere из TypeORM
// Import Repository and FindOptionsWhere from TypeORM
import { Repository, FindOptionsWhere, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

// Импорт сущностей
// Import entities
import { Competition } from '../entities/Competition.entity';
import { User } from '../entities/User.entity';
import { Athlete } from '../entities/Athlete.entity';

// Импорт типов
// Import types
import {
  CompetitionType,
  CompetitionStatus,
  UserRole
} from '../types/common.types';

/**
 * Интерфейс для данных создания соревнования
 * Interface for competition creation data
 */
export interface CreateCompetitionData {
  // Название соревнования (краткое) / Competition name (short)
  name: string;

  // Полное название соревнования / Full competition name
  fullName?: string;

  // Описание соревнования / Competition description
  description?: string;

  // Тип соревнования (индивидуальное/групповое) / Competition type (individual/group)
  type: CompetitionType;

  // Дата начала / Start date
  startDate: Date;

  // Дата окончания / End date
  endDate: Date;

  // Местоположение (город) / Location (city)
  location: string;

  // Площадка (адрес) / Venue (address)
  venue?: string;

  // ID организатора / Organizer ID
  organizerId: string;

  // ID главного судьи (необязательно) / Chief judge ID (optional)
  chiefJudgeId?: string;

  // Дата начала регистрации / Registration start date
  registrationStartDate?: Date;

  // Дата окончания регистрации / Registration end date
  registrationEndDate?: Date;

  // Максимальное количество участников / Maximum participants
  maxParticipants?: number;

  // Стоимость участия / Entry fee
  entryFee?: number;
}

/**
 * Интерфейс для данных обновления соревнования
 * Interface for competition update data
 */
export interface UpdateCompetitionData {
  // Название соревнования / Competition name
  name?: string;

  // Полное название / Full name
  fullName?: string;

  // Описание / Description
  description?: string;

  // Тип соревнования / Competition type
  type?: CompetitionType;

  // Статус соревнования / Competition status
  status?: CompetitionStatus;

  // Дата начала / Start date
  startDate?: Date;

  // Дата окончания / End date
  endDate?: Date;

  // Местоположение / Location
  location?: string;

  // Площадка / Venue
  venue?: string;

  // ID главного судьи / Chief judge ID
  chiefJudgeId?: string;

  // Открыта ли регистрация / Registration open
  registrationOpen?: boolean;

  // Дата начала регистрации / Registration start date
  registrationStartDate?: Date;

  // Дата окончания регистрации / Registration end date
  registrationEndDate?: Date;

  // Максимальное количество участников / Maximum participants
  maxParticipants?: number;

  // Стоимость участия / Entry fee
  entryFee?: number;
}

/**
 * Интерфейс для фильтрации соревнований
 * Interface for competition filtering
 */
export interface CompetitionFilter {
  // Фильтр по статусу / Filter by status
  status?: CompetitionStatus;

  // Фильтр по типу / Filter by type
  type?: CompetitionType;

  // Фильтр по организатору / Filter by organizer
  organizerId?: string;

  // Фильтр по дате начала (от) / Filter by start date (from)
  startDateFrom?: Date;

  // Фильтр по дате начала (до) / Filter by start date (to)
  startDateTo?: Date;

  // Фильтр по городу / Filter by location
  location?: string;

  // Открыта ли регистрация / Registration open
  registrationOpen?: boolean;
}

/**
 * Сервис для работы с соревнованиями
 * Service for competition operations
 */
export class CompetitionService {
  // Репозиторий для работы с соревнованиями в БД
  // Repository for competition database operations
  private competitionRepository: Repository<Competition>;

  // Репозиторий для работы с пользователями в БД
  // Repository for user database operations
  private userRepository: Repository<User>;

  // Репозиторий для работы со спортсменами в БД
  // Repository for athlete database operations
  private athleteRepository: Repository<Athlete>;

  /**
   * Конструктор сервиса
   * Service constructor
   */
  constructor() {
    // Получаем репозиторий Competition из DataSource
    // Get Competition repository from DataSource
    this.competitionRepository = AppDataSource.getRepository(Competition);

    // Получаем репозиторий User из DataSource
    // Get User repository from DataSource
    this.userRepository = AppDataSource.getRepository(User);

    // Получаем репозиторий Athlete из DataSource
    // Get Athlete repository from DataSource
    this.athleteRepository = AppDataSource.getRepository(Athlete);
  }

  /**
   * Создание нового соревнования
   * Create new competition
   *
   * @param data - данные для создания соревнования / competition creation data
   * @returns Promise с созданным соревнованием / Promise with created competition
   * @throws Error если организатор не найден / if organizer not found
   */
  async createCompetition(data: CreateCompetitionData): Promise<Competition> {
    try {
      // Проверяем существование организатора
      // Check organizer existence
      const organizer = await this.userRepository.findOne({
        where: { id: data.organizerId }
      });

      // Если организатор не найден, выбрасываем ошибку
      // If organizer not found, throw error
      if (!organizer) {
        throw new Error('Организатор не найден');
      }

      // Проверяем, что у организатора правильная роль
      // Check that organizer has correct role
      if (organizer.role !== UserRole.ADMIN && organizer.role !== UserRole.ORGANIZER) {
        throw new Error('Пользователь не является организатором');
      }

      // Если указан главный судья, проверяем его существование
      // If chief judge is specified, check existence
      if (data.chiefJudgeId) {
        // Ищем главного судью в БД
        // Find chief judge in database
        const chiefJudge = await this.userRepository.findOne({
          where: { id: data.chiefJudgeId }
        });

        // Если главный судья не найден, выбрасываем ошибку
        // If chief judge not found, throw error
        if (!chiefJudge) {
          throw new Error('Главный судья не найден');
        }

        // Проверяем роль главного судьи
        // Check chief judge role
        if (chiefJudge.role !== UserRole.CHIEF_JUDGE && chiefJudge.role !== UserRole.ADMIN) {
          throw new Error('Указанный пользователь не является главным судьей');
        }
      }

      // Валидация дат - дата окончания должна быть после даты начала
      // Date validation - end date must be after start date
      if (data.endDate <= data.startDate) {
        throw new Error('Дата окончания должна быть позже даты начала');
      }

      // Валидация дат регистрации
      // Registration dates validation
      if (data.registrationStartDate && data.registrationEndDate) {
        // Дата окончания регистрации должна быть после даты начала
        // Registration end date must be after start date
        if (data.registrationEndDate <= data.registrationStartDate) {
          throw new Error('Дата окончания регистрации должна быть позже даты начала');
        }

        // Дата окончания регистрации должна быть до начала соревнования
        // Registration end date must be before competition start
        if (data.registrationEndDate > data.startDate) {
          throw new Error('Регистрация должна закончиться до начала соревнования');
        }
      }

      // Создаем объект нового соревнования
      // Create new competition object
      const newCompetition = this.competitionRepository.create({
        name: data.name,
        fullName: data.fullName,
        description: data.description,
        type: data.type,
        status: CompetitionStatus.DRAFT, // Новое соревнование в черновике / New competition in draft
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        venue: data.venue,
        organizerId: data.organizerId,
        chiefJudgeId: data.chiefJudgeId,
        registrationOpen: false, // По умолчанию регистрация закрыта / Registration closed by default
        registrationStartDate: data.registrationStartDate,
        registrationEndDate: data.registrationEndDate,
        maxParticipants: data.maxParticipants,
        entryFee: data.entryFee
      });

      // Сохраняем соревнование в БД
      // Save competition to database
      const savedCompetition = await this.competitionRepository.save(newCompetition);

      // Логируем создание соревнования
      // Log competition creation
      console.log(`Создано соревнование: ${savedCompetition.name} (ID: ${savedCompetition.id})`);

      // Возвращаем созданное соревнование
      // Return created competition
      return savedCompetition;
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при создании соревнования:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }

  /**
   * Получение соревнования по ID
   * Get competition by ID
   *
   * @param competitionId - ID соревнования / competition ID
   * @param includeRelations - включать ли связанные данные / include related data
   * @returns Promise с соревнованием / Promise with competition
   * @throws Error если соревнование не найдено / if competition not found
   */
  async getCompetitionById(competitionId: string, includeRelations: boolean = false): Promise<Competition> {
    try {
      // Формируем опции для запроса
      // Form query options
      const findOptions: any = {
        where: { id: competitionId }
      };

      // Если нужно включить связанные данные
      // If need to include related data
      if (includeRelations) {
        // Добавляем relations для загрузки организатора и главного судьи
        // Add relations to load organizer and chief judge
        findOptions.relations = ['organizer', 'chiefJudge'];
      }

      // Ищем соревнование по ID
      // Find competition by ID
      const competition = await this.competitionRepository.findOne(findOptions);

      // Если соревнование не найдено, выбрасываем ошибку
      // If competition not found, throw error
      if (!competition) {
        throw new Error('Соревнование не найдено');
      }

      // Возвращаем соревнование
      // Return competition
      return competition;
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при получении соревнования по ID:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }

  /**
   * Получение списка соревнований с фильтрацией
   * Get list of competitions with filtering
   *
   * @param filter - параметры фильтрации / filter parameters
   * @returns Promise со списком соревнований / Promise with list of competitions
   */
  async getCompetitions(filter?: CompetitionFilter): Promise<Competition[]> {
    try {
      // Создаем query builder для построения запроса
      // Create query builder for building query
      const queryBuilder = this.competitionRepository.createQueryBuilder('competition');

      // Добавляем связанные данные (организатор, главный судья)
      // Add related data (organizer, chief judge)
      queryBuilder
        .leftJoinAndSelect('competition.organizer', 'organizer')
        .leftJoinAndSelect('competition.chiefJudge', 'chiefJudge');

      // Если есть фильтр, применяем условия
      // If filter exists, apply conditions
      if (filter) {
        // Фильтр по статусу
        // Filter by status
        if (filter.status) {
          queryBuilder.andWhere('competition.status = :status', { status: filter.status });
        }

        // Фильтр по типу
        // Filter by type
        if (filter.type) {
          queryBuilder.andWhere('competition.type = :type', { type: filter.type });
        }

        // Фильтр по организатору
        // Filter by organizer
        if (filter.organizerId) {
          queryBuilder.andWhere('competition.organizerId = :organizerId', {
            organizerId: filter.organizerId
          });
        }

        // Фильтр по дате начала (от)
        // Filter by start date (from)
        if (filter.startDateFrom) {
          queryBuilder.andWhere('competition.startDate >= :startDateFrom', {
            startDateFrom: filter.startDateFrom
          });
        }

        // Фильтр по дате начала (до)
        // Filter by start date (to)
        if (filter.startDateTo) {
          queryBuilder.andWhere('competition.startDate <= :startDateTo', {
            startDateTo: filter.startDateTo
          });
        }

        // Фильтр по местоположению (частичное совпадение)
        // Filter by location (partial match)
        if (filter.location) {
          queryBuilder.andWhere('competition.location ILIKE :location', {
            location: `%${filter.location}%`
          });
        }

        // Фильтр по открытой регистрации
        // Filter by open registration
        if (filter.registrationOpen !== undefined) {
          queryBuilder.andWhere('competition.registrationOpen = :registrationOpen', {
            registrationOpen: filter.registrationOpen
          });
        }
      }

      // Сортируем по дате начала (ближайшие первыми)
      // Sort by start date (upcoming first)
      queryBuilder.orderBy('competition.startDate', 'ASC');

      // Выполняем запрос
      // Execute query
      const competitions = await queryBuilder.getMany();

      // Возвращаем список соревнований
      // Return list of competitions
      return competitions;
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при получении списка соревнований:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }

  /**
   * Обновление соревнования
   * Update competition
   *
   * @param competitionId - ID соревнования / competition ID
   * @param data - данные для обновления / update data
   * @returns Promise с обновленным соревнованием / Promise with updated competition
   * @throws Error если соревнование не найдено / if competition not found
   */
  async updateCompetition(competitionId: string, data: UpdateCompetitionData): Promise<Competition> {
    try {
      // Получаем соревнование по ID
      // Get competition by ID
      const competition = await this.competitionRepository.findOne({
        where: { id: competitionId }
      });

      // Если соревнование не найдено, выбрасываем ошибку
      // If competition not found, throw error
      if (!competition) {
        throw new Error('Соревнование не найдено');
      }

      // Если обновляется главный судья, проверяем его существование
      // If updating chief judge, check existence
      if (data.chiefJudgeId !== undefined) {
        // Если ID не null, проверяем судью
        // If ID is not null, check judge
        if (data.chiefJudgeId) {
          const chiefJudge = await this.userRepository.findOne({
            where: { id: data.chiefJudgeId }
          });

          // Если главный судья не найден, выбрасываем ошибку
          // If chief judge not found, throw error
          if (!chiefJudge) {
            throw new Error('Главный судья не найден');
          }

          // Проверяем роль
          // Check role
          if (chiefJudge.role !== UserRole.CHIEF_JUDGE && chiefJudge.role !== UserRole.ADMIN) {
            throw new Error('Указанный пользователь не является главным судьей');
          }
        }

        // Обновляем ID главного судьи
        // Update chief judge ID
        competition.chiefJudgeId = data.chiefJudgeId;
      }

      // Обновляем остальные поля, если они предоставлены
      // Update other fields if provided
      if (data.name !== undefined) {
        competition.name = data.name;
      }

      if (data.fullName !== undefined) {
        competition.fullName = data.fullName;
      }

      if (data.description !== undefined) {
        competition.description = data.description;
      }

      if (data.type !== undefined) {
        competition.type = data.type;
      }

      if (data.status !== undefined) {
        competition.status = data.status;
      }

      if (data.startDate !== undefined) {
        competition.startDate = data.startDate;
      }

      if (data.endDate !== undefined) {
        competition.endDate = data.endDate;
      }

      if (data.location !== undefined) {
        competition.location = data.location;
      }

      if (data.venue !== undefined) {
        competition.venue = data.venue;
      }

      if (data.registrationOpen !== undefined) {
        competition.registrationOpen = data.registrationOpen;
      }

      if (data.registrationStartDate !== undefined) {
        competition.registrationStartDate = data.registrationStartDate;
      }

      if (data.registrationEndDate !== undefined) {
        competition.registrationEndDate = data.registrationEndDate;
      }

      if (data.maxParticipants !== undefined) {
        competition.maxParticipants = data.maxParticipants;
      }

      if (data.entryFee !== undefined) {
        competition.entryFee = data.entryFee;
      }

      // Валидация дат после обновления
      // Date validation after update
      if (competition.endDate <= competition.startDate) {
        throw new Error('Дата окончания должна быть позже даты начала');
      }

      // Сохраняем изменения в БД
      // Save changes to database
      const updatedCompetition = await this.competitionRepository.save(competition);

      // Логируем обновление
      // Log update
      console.log(`Соревнование обновлено: ${updatedCompetition.name} (ID: ${updatedCompetition.id})`);

      // Возвращаем обновленное соревнование
      // Return updated competition
      return updatedCompetition;
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при обновлении соревнования:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }

  /**
   * Публикация соревнования (перевод из черновика в опубликованное)
   * Publish competition (move from draft to published)
   *
   * @param competitionId - ID соревнования / competition ID
   * @returns Promise с обновленным соревнованием / Promise with updated competition
   * @throws Error если соревнование не готово к публикации / if competition not ready for publishing
   */
  async publishCompetition(competitionId: string): Promise<Competition> {
    try {
      // Получаем соревнование по ID
      // Get competition by ID
      const competition = await this.getCompetitionById(competitionId);

      // Проверяем, что соревнование в статусе черновика
      // Check that competition is in draft status
      if (competition.status !== CompetitionStatus.DRAFT) {
        throw new Error('Можно публиковать только соревнования в статусе "черновик"');
      }

      // Проверяем, что назначен главный судья
      // Check that chief judge is assigned
      if (!competition.chiefJudgeId) {
        throw new Error('Для публикации необходимо назначить главного судью');
      }

      // Обновляем статус на "опубликовано"
      // Update status to "published"
      competition.status = CompetitionStatus.PUBLISHED;

      // Открываем регистрацию, если указаны даты
      // Open registration if dates are specified
      if (competition.registrationStartDate && competition.registrationEndDate) {
        // Проверяем, наступила ли дата начала регистрации
        // Check if registration start date has arrived
        const now = new Date();
        if (now >= competition.registrationStartDate && now <= competition.registrationEndDate) {
          competition.registrationOpen = true;
        }
      }

      // Сохраняем изменения
      // Save changes
      const publishedCompetition = await this.competitionRepository.save(competition);

      // Логируем публикацию
      // Log publication
      console.log(`Соревнование опубликовано: ${publishedCompetition.name}`);

      // Возвращаем опубликованное соревнование
      // Return published competition
      return publishedCompetition;
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при публикации соревнования:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }

  /**
   * Отмена соревнования
   * Cancel competition
   *
   * @param competitionId - ID соревнования / competition ID
   * @param reason - причина отмены / cancellation reason
   * @returns Promise с обновленным соревнованием / Promise with updated competition
   */
  async cancelCompetition(competitionId: string, reason?: string): Promise<Competition> {
    try {
      // Получаем соревнование по ID
      // Get competition by ID
      const competition = await this.getCompetitionById(competitionId);

      // Проверяем, что соревнование еще не завершено
      // Check that competition is not finished yet
      if (competition.status === CompetitionStatus.FINISHED) {
        throw new Error('Нельзя отменить уже завершенное соревнование');
      }

      // Обновляем статус на "отменено"
      // Update status to "cancelled"
      competition.status = CompetitionStatus.CANCELLED;

      // Закрываем регистрацию
      // Close registration
      competition.registrationOpen = false;

      // Сохраняем изменения
      // Save changes
      const cancelledCompetition = await this.competitionRepository.save(competition);

      // Логируем отмену
      // Log cancellation
      console.log(`Соревнование отменено: ${cancelledCompetition.name}. Причина: ${reason || 'не указана'}`);

      // Возвращаем отмененное соревнование
      // Return cancelled competition
      return cancelledCompetition;
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при отмене соревнования:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }

  /**
   * Удаление соревнования (только черновики)
   * Delete competition (drafts only)
   *
   * @param competitionId - ID соревнования / competition ID
   * @returns Promise<void>
   * @throws Error если соревнование не в статусе черновика / if competition not in draft status
   */
  async deleteCompetition(competitionId: string): Promise<void> {
    try {
      // Получаем соревнование по ID
      // Get competition by ID
      const competition = await this.getCompetitionById(competitionId);

      // Проверяем, что соревнование в статусе черновика
      // Check that competition is in draft status
      if (competition.status !== CompetitionStatus.DRAFT) {
        throw new Error('Можно удалять только соревнования в статусе "черновик"');
      }

      // Удаляем соревнование из БД
      // Delete competition from database
      await this.competitionRepository.remove(competition);

      // Логируем удаление
      // Log deletion
      console.log(`Соревнование удалено: ${competition.name} (ID: ${competitionId})`);
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при удалении соревнования:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }

  /**
   * Получение статистики соревнования
   * Get competition statistics
   *
   * @param competitionId - ID соревнования / competition ID
   * @returns Promise с объектом статистики / Promise with statistics object
   */
  async getCompetitionStatistics(competitionId: string): Promise<{
    totalParticipants: number;
    totalPerformances: number;
    completedPerformances: number;
    pendingPerformances: number;
  }> {
    try {
      // Получаем соревнование для проверки существования
      // Get competition to check existence
      await this.getCompetitionById(competitionId);

      // Здесь будет логика подсчета статистики из таблиц performances и athletes
      // Here will be logic for calculating statistics from performances and athletes tables
      // Пока возвращаем заглушку с нулевыми значениями
      // For now return stub with zero values

      // TODO: Добавить реальные запросы к БД когда создадим PerformanceService
      // TODO: Add real database queries when we create PerformanceService

      return {
        totalParticipants: 0,
        totalPerformances: 0,
        completedPerformances: 0,
        pendingPerformances: 0
      };
    } catch (error) {
      // Логируем ошибку для отладки
      // Log error for debugging
      console.error('Ошибка при получении статистики соревнования:', error);

      // Пробрасываем ошибку дальше
      // Re-throw error
      throw error;
    }
  }
}

/**
 * Экспорт экземпляра сервиса (Singleton pattern)
 * Export service instance (Singleton pattern)
 */
export const competitionService = new CompetitionService();

/**
 * ТЕСТЫ для competition.service.ts
 *
 * Тест 1: Успешное создание соревнования
 * - Создать организатора (role = ORGANIZER)
 * - Вызвать competitionService.createCompetition() с валидными данными
 * - Проверить, что соревнование создано с status = DRAFT
 * - Проверить, что registrationOpen = false
 *
 * Тест 2: Создание соревнования с несуществующим организатором
 * - Вызвать competitionService.createCompetition() с несуществующим organizerId
 * - Ожидать ошибку "Организатор не найден"
 *
 * Тест 3: Создание соревнования с неправильной ролью организатора
 * - Создать пользователя с role = SPECTATOR
 * - Попытаться создать соревнование с этим пользователем
 * - Ожидать ошибку "Пользователь не является организатором"
 *
 * Тест 4: Создание соревнования с неправильными датами
 * - Попытаться создать соревнование где endDate <= startDate
 * - Ожидать ошибку "Дата окончания должна быть позже даты начала"
 *
 * Тест 5: Получение соревнования по ID
 * - Создать соревнование
 * - Вызвать competitionService.getCompetitionById()
 * - Проверить, что возвращается правильное соревнование
 *
 * Тест 6: Получение соревнования по ID с relations
 * - Создать соревнование с организатором
 * - Вызвать getCompetitionById(id, true)
 * - Проверить, что объект organizer загружен
 *
 * Тест 7: Получение списка соревнований без фильтра
 * - Создать 3 соревнования
 * - Вызвать competitionService.getCompetitions()
 * - Проверить, что возвращаются все 3 соревнования
 *
 * Тест 8: Фильтрация соревнований по статусу
 * - Создать 2 соревнования DRAFT и 1 PUBLISHED
 * - Вызвать getCompetitions({ status: CompetitionStatus.DRAFT })
 * - Проверить, что возвращается 2 соревнования
 *
 * Тест 9: Фильтрация соревнований по типу
 * - Создать INDIVIDUAL и GROUP соревнования
 * - Вызвать getCompetitions({ type: CompetitionType.INDIVIDUAL })
 * - Проверить, что возвращаются только INDIVIDUAL
 *
 * Тест 10: Фильтрация по дате начала
 * - Создать соревнования с разными датами
 * - Вызвать getCompetitions({ startDateFrom: Date, startDateTo: Date })
 * - Проверить, что возвращаются только соревнования в диапазоне
 *
 * Тест 11: Обновление соревнования
 * - Создать соревнование
 * - Вызвать updateCompetition() с новым названием
 * - Проверить, что название обновилось
 *
 * Тест 12: Публикация соревнования
 * - Создать соревнование в статусе DRAFT с главным судьей
 * - Вызвать publishCompetition()
 * - Проверить, что status = PUBLISHED
 *
 * Тест 13: Публикация соревнования без главного судьи
 * - Создать соревнование в статусе DRAFT без chiefJudgeId
 * - Попытаться опубликовать
 * - Ожидать ошибку "Для публикации необходимо назначить главного судью"
 *
 * Тест 14: Публикация уже опубликованного соревнования
 * - Создать и опубликовать соревнование
 * - Попытаться опубликовать снова
 * - Ожидать ошибку о неправильном статусе
 *
 * Тест 15: Отмена соревнования
 * - Создать и опубликовать соревнование
 * - Вызвать cancelCompetition()
 * - Проверить, что status = CANCELLED
 * - Проверить, что registrationOpen = false
 *
 * Тест 16: Удаление соревнования в статусе DRAFT
 * - Создать соревнование в статусе DRAFT
 * - Вызвать deleteCompetition()
 * - Проверить, что соревнование удалено из БД
 *
 * Тест 17: Удаление опубликованного соревнования
 * - Создать и опубликовать соревнование
 * - Попытаться удалить
 * - Ожидать ошибку "Можно удалять только соревнования в статусе черновик"
 */
