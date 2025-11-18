/**
 * Файл: types/competition.types.ts
 * Описание: TypeScript типы для соревнований
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: user.types
 */

// Импорт типа User для связи с организатором
// Import User type for organizer relation
import { User } from './user.types';

/**
 * Перечисление типов соревнований
 * Enumeration of competition types
 */
export enum CompetitionType {
  INDIVIDUAL = 'individual',                     // Индивидуальные / Individual
  GROUP = 'group'                                // Групповые / Group
}

/**
 * Перечисление статусов соревнований
 * Enumeration of competition statuses
 */
export enum CompetitionStatus {
  DRAFT = 'draft',                               // Черновик / Draft
  PUBLISHED = 'published',                       // Опубликовано / Published
  IN_PROGRESS = 'in_progress',                   // В процессе / In progress
  FINISHED = 'finished',                         // Завершено / Finished
  CANCELLED = 'cancelled'                        // Отменено / Cancelled
}

/**
 * Перечисление уровней соревнований
 * Enumeration of competition levels
 */
export enum CompetitionLevel {
  LOCAL = 'local',                               // Местный / Local
  REGIONAL = 'regional',                         // Региональный / Regional
  NATIONAL = 'national',                         // Национальный / National
  INTERNATIONAL = 'international'                // Международный / International
}

/**
 * Интерфейс соревнования
 * Competition interface
 */
export interface Competition {
  // Уникальный идентификатор / Unique identifier
  id: string;

  // Название соревнования / Competition name
  name: string;

  // Описание / Description
  description?: string;

  // Тип соревнования / Competition type
  type: CompetitionType;

  // Статус / Status
  status: CompetitionStatus;

  // Уровень / Level
  level: CompetitionLevel;

  // Дата начала / Start date
  startDate: Date;

  // Дата окончания / End date
  endDate: Date;

  // Дата начала регистрации / Registration start date
  registrationStartDate?: Date;

  // Дата окончания регистрации / Registration end date
  registrationEndDate?: Date;

  // Место проведения / Venue
  venue?: string;

  // Город / City
  city?: string;

  // Страна / Country
  country?: string;

  // Максимальное количество участников / Maximum participants
  maxParticipants?: number;

  // Текущее количество зарегистрированных / Current registered count
  registeredParticipants: number;

  // Открыта ли регистрация / Is registration open
  isRegistrationOpen: boolean;

  // ID организатора / Organizer ID
  organizerId: string;

  // Объект организатора / Organizer object
  organizer?: User;

  // ID главного судьи / Chief judge ID
  chiefJudgeId?: string;

  // Объект главного судьи / Chief judge object
  chiefJudge?: User;

  // Дата создания / Creation date
  createdAt: Date;

  // Дата последнего обновления / Last update date
  updatedAt: Date;
}

/**
 * Данные для создания соревнования
 * Competition creation data
 */
export interface CreateCompetitionData {
  // Название (обязательно) / Name (required)
  name: string;

  // Описание (опционально) / Description (optional)
  description?: string;

  // Тип (обязательно) / Type (required)
  type: CompetitionType;

  // Уровень (обязательно) / Level (required)
  level: CompetitionLevel;

  // Дата начала (обязательно) / Start date (required)
  startDate: Date;

  // Дата окончания (обязательно) / End date (required)
  endDate: Date;

  // Дата начала регистрации / Registration start date
  registrationStartDate?: Date;

  // Дата окончания регистрации / Registration end date
  registrationEndDate?: Date;

  // Место проведения / Venue
  venue?: string;

  // Город / City
  city?: string;

  // Страна / Country
  country?: string;

  // Максимальное количество участников / Maximum participants
  maxParticipants?: number;

  // ID главного судьи / Chief judge ID
  chiefJudgeId?: string;
}

/**
 * Данные для обновления соревнования
 * Competition update data
 */
export interface UpdateCompetitionData {
  // Название / Name
  name?: string;

  // Описание / Description
  description?: string;

  // Тип / Type
  type?: CompetitionType;

  // Уровень / Level
  level?: CompetitionLevel;

  // Дата начала / Start date
  startDate?: Date;

  // Дата окончания / End date
  endDate?: Date;

  // Дата начала регистрации / Registration start date
  registrationStartDate?: Date;

  // Дата окончания регистрации / Registration end date
  registrationEndDate?: Date;

  // Место проведения / Venue
  venue?: string;

  // Город / City
  city?: string;

  // Страна / Country
  country?: string;

  // Максимальное количество участников / Maximum participants
  maxParticipants?: number;

  // ID главного судьи / Chief judge ID
  chiefJudgeId?: string;
}

/**
 * Параметры фильтрации соревнований
 * Competition filter parameters
 */
export interface CompetitionFilterParams {
  // Фильтр по статусу / Filter by status
  status?: CompetitionStatus;

  // Фильтр по типу / Filter by type
  type?: CompetitionType;

  // Фильтр по уровню / Filter by level
  level?: CompetitionLevel;

  // Фильтр по организатору / Filter by organizer
  organizerId?: string;

  // Фильтр по дате начала (от) / Filter by start date (from)
  startDateFrom?: Date;

  // Фильтр по дате начала (до) / Filter by start date (to)
  startDateTo?: Date;

  // Фильтр по открытой регистрации / Filter by open registration
  registrationOpen?: boolean;

  // Фильтр по городу / Filter by city
  city?: string;

  // Фильтр по стране / Filter by country
  country?: string;
}

/**
 * Статистика соревнования
 * Competition statistics
 */
export interface CompetitionStatistics {
  // ID соревнования / Competition ID
  competitionId: string;

  // Общее количество участников / Total participants
  totalParticipants: number;

  // Количество выступлений / Number of performances
  totalPerformances: number;

  // Количество судей / Number of judges
  totalJudges: number;

  // Средний балл / Average score
  averageScore?: number;

  // Максимальный балл / Maximum score
  maxScore?: number;

  // Минимальный балл / Minimum score
  minScore?: number;

  // Распределение по странам / Distribution by country
  participantsByCountry?: Record<string, number>;

  // Распределение по возрастным группам / Distribution by age group
  participantsByAgeGroup?: Record<string, number>;
}

/**
 * ТЕСТЫ для competition.types.ts
 *
 * Тест 1: CompetitionType содержит все типы
 * - Проверить наличие INDIVIDUAL и GROUP
 * - Проверить правильность значений
 *
 * Тест 2: CompetitionStatus содержит все статусы
 * - Проверить наличие всех 5 статусов
 * - Проверить переходы между статусами
 *
 * Тест 3: CompetitionLevel содержит все уровни
 * - Проверить наличие всех 4 уровней
 *
 * Тест 4: Competition интерфейс содержит обязательные поля
 * - id, name, type, status, level, startDate, endDate
 *
 * Тест 5: CreateCompetitionData требует минимальные поля
 * - name, type, level, startDate, endDate обязательны
 *
 * Тест 6: CompetitionFilterParams все поля опциональны
 * - Проверить что можно создать пустой объект фильтров
 */
