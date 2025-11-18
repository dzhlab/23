/**
 * Файл: types/judge.types.ts
 * Описание: TypeScript типы и интерфейсы для судей и судейских бригад
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: common.types.ts
 */

// Импорт общих типов
import { UUID, Timestamp, UserRole, BrigadeType, JudgeInterfaceType } from './common.types';

/**
 * Интерфейс для судьи
 * Содержит информацию о судье и его квалификации
 */
export interface Judge {
  // Уникальный идентификатор судьи
  id: UUID;

  // ID пользователя (связь с User)
  userId: UUID;

  // Фамилия
  lastName: string;

  // Имя
  firstName: string;

  // Отчество
  middleName?: string;

  // Категория судьи (международная, всероссийская, первая и т.д.)
  category: JudgeCategory;

  // Номер судейского удостоверения
  licenseNumber?: string;

  // Дата выдачи удостоверения
  licenseIssueDate?: Timestamp;

  // Срок действия удостоверения
  licenseExpiryDate?: Timestamp;

  // Бриз FIG (для международных судей)
  figBrevet?: string;

  // Страна
  country: string;

  // Регион
  region?: string;

  // Специализация судьи (какую бригаду предпочитает)
  specialization?: BrigadeType[];

  // Опыт работы (количество лет)
  yearsOfExperience?: number;

  // Количество судейств на соревнованиях
  competitionsJudged?: number;

  // Email
  email: string;

  // Телефон
  phone?: string;

  // Фото
  photo?: string;

  // Предпочитаемый тип интерфейса
  preferredInterface: JudgeInterfaceType;

  // Статус (active, inactive, suspended)
  status: 'active' | 'inactive' | 'suspended';

  // Биография
  biography?: string;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Перечисление категорий судей
 * Иерархия квалификации судей
 */
export enum JudgeCategory {
  // Международная категория FIG
  INTERNATIONAL = 'international',

  // Всероссийская категория
  NATIONAL = 'national',

  // Первая категория
  FIRST = 'first',

  // Вторая категория
  SECOND = 'second',

  // Третья категория
  THIRD = 'third',

  // Юный судья (стажер)
  JUNIOR = 'junior'
}

/**
 * Интерфейс для создания судьи
 */
export interface CreateJudgeDto {
  // ID пользователя
  userId: UUID;

  // ФИО
  lastName: string;
  firstName: string;
  middleName?: string;

  // Категория
  category: JudgeCategory;

  // Лицензия
  licenseNumber?: string;
  licenseIssueDate?: Timestamp;
  licenseExpiryDate?: Timestamp;
  figBrevet?: string;

  // География
  country: string;
  region?: string;

  // Специализация
  specialization?: BrigadeType[];

  // Опыт
  yearsOfExperience?: number;

  // Контакты
  email: string;
  phone?: string;

  // Предпочтения
  preferredInterface: JudgeInterfaceType;
}

/**
 * Интерфейс для обновления данных судьи
 */
export interface UpdateJudgeDto {
  lastName?: string;
  firstName?: string;
  middleName?: string;
  category?: JudgeCategory;
  licenseNumber?: string;
  licenseIssueDate?: Timestamp;
  licenseExpiryDate?: Timestamp;
  figBrevet?: string;
  country?: string;
  region?: string;
  specialization?: BrigadeType[];
  yearsOfExperience?: number;
  email?: string;
  phone?: string;
  photo?: string;
  preferredInterface?: JudgeInterfaceType;
  status?: 'active' | 'inactive' | 'suspended';
  biography?: string;
}

/**
 * Интерфейс для судейской бригады
 * Группа судей для оценки выступлений
 */
export interface JudgingBrigade {
  // Уникальный идентификатор бригады
  id: UUID;

  // ID соревнования
  competitionId: UUID;

  // ID события (если бригада назначена на конкретное событие)
  eventId?: UUID;

  // Тип бригады (D, E, A, T, L)
  brigadeType: BrigadeType;

  // Название бригады
  name: string;

  // ID руководителя бригады (для D, E, A бригад)
  leadJudgeId?: UUID;

  // Массив ID судей в бригаде
  judgeIds: UUID[];

  // Статус бригады (active, inactive)
  status: 'active' | 'inactive';

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для назначения судьи
 * Связывает судью с конкретной бригадой и позицией
 */
export interface JudgeAssignment {
  // Уникальный идентификатор назначения
  id: UUID;

  // ID судьи
  judgeId: UUID;

  // ID бригады
  brigadeId: UUID;

  // ID соревнования
  competitionId: UUID;

  // ID события (если назначение на конкретное событие)
  eventId?: UUID;

  // Роль судьи (role в бригаде)
  role: UserRole;

  // Позиция в бригаде (для D: D1, D2, D3, D4; для E: E1-E4; для A: A1-A4)
  position: string;

  // Главный судья бригады (да/нет)
  isLeadJudge: boolean;

  // Дата начала назначения
  startDate: Timestamp;

  // Дата окончания назначения
  endDate?: Timestamp;

  // Статус назначения (active, completed, cancelled)
  status: 'active' | 'completed' | 'cancelled';

  // Примечания
  notes?: string;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для расписания работы судьи
 * Определяет, когда судья работает
 */
export interface JudgeSchedule {
  // Уникальный идентификатор
  id: UUID;

  // ID судьи
  judgeId: UUID;

  // ID соревнования
  competitionId: UUID;

  // ID события
  eventId: UUID;

  // Время начала работы
  startTime: Timestamp;

  // Время окончания работы
  endTime: Timestamp;

  // Тип смены (morning, afternoon, evening)
  shift?: 'morning' | 'afternoon' | 'evening';

  // Доступен ли судья
  available: boolean;

  // Причина недоступности
  unavailabilityReason?: string;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для конфликта интересов
 * Определяет, когда судья не может судить конкретного спортсмена
 */
export interface ConflictOfInterest {
  // Уникальный идентификатор
  id: UUID;

  // ID судьи
  judgeId: UUID;

  // ID спортсмена или команды
  participantId: UUID;

  // Тип конфликта (coach, family, club, other)
  conflictType: 'coach' | 'family' | 'club' | 'other';

  // Описание конфликта
  description: string;

  // Одобрено ли главным судьей (можно судить несмотря на конфликт)
  approved: boolean;

  // ID одобрившего (Chief Judge)
  approvedBy?: UUID;

  // Дата одобрения
  approvalDate?: Timestamp;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для протокола консенсуса
 * Запись о разрешении расхождений между судьями
 */
export interface ConsensusProtocol {
  // Уникальный идентификатор
  id: UUID;

  // ID выступления
  performanceId: UUID;

  // ID бригады
  brigadeId: UUID;

  // Тип бригады
  brigadeType: BrigadeType;

  // ID судей, чьи оценки расходятся
  conflictingJudgeIds: UUID[];

  // Исходные оценки судей (массив)
  originalScores: number[];

  // Максимальное расхождение
  maxDeviation: number;

  // Причина расхождения
  reason?: string;

  // Решение (accepted - принято как есть, adjusted - скорректировано, resubmitted - пересудить)
  resolution: 'accepted' | 'adjusted' | 'resubmitted';

  // Финальная оценка после консенсуса
  finalScore?: number;

  // ID главного судьи, принявшего решение
  resolvedBy?: UUID;

  // Дата и время разрешения
  resolvedAt?: Timestamp;

  // Комментарии
  comments?: string;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для статистики судьи
 * Агрегированные данные о работе судьи
 */
export interface JudgeStatistics {
  // ID судьи
  judgeId: UUID;

  // Общее количество судейств на соревнованиях
  totalCompetitions: number;

  // Общее количество оцененных выступлений
  totalPerformancesJudged: number;

  // Средняя оценка, выставленная судьей
  averageScoreGiven?: number;

  // Количество консенсусов (расхождений)
  consensusCount: number;

  // Процент консенсусов от общего числа оценок
  consensusRate?: number;

  // Средняя скорость оценивания (секунды на оценку)
  averageJudgingSpeed?: number;

  // Количество отклоненных оценок
  rejectedScoresCount: number;

  // Рейтинг судьи (вычисляется на основе качества работы)
  rating?: number;

  // Последнее соревнование
  lastCompetitionDate?: Timestamp;

  // Время последнего обновления статистики
  lastUpdated: Timestamp;
}

/**
 * Интерфейс для отзыва о работе судьи
 * Оценка работы судьи от главного судьи
 */
export interface JudgeFeedback {
  // Уникальный идентификатор
  id: UUID;

  // ID судьи
  judgeId: UUID;

  // ID соревнования
  competitionId: UUID;

  // ID главного судьи, оставившего отзыв
  chiefJudgeId: UUID;

  // Оценка работы (1-5)
  rating: number;

  // Комментарий
  comment?: string;

  // Положительные аспекты
  strengths?: string[];

  // Области для улучшения
  areasForImprovement?: string[];

  // Дата отзыва
  feedbackDate: Timestamp;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * ТЕСТЫ для judge.types.ts
 *
 * Тест 1: Создание судьи
 * - Создать Judge через CreateJudgeDto
 * - Проверить категорию судьи
 * - Проверить срок действия лицензии
 *
 * Тест 2: Формирование бригады
 * - Создать JudgingBrigade с 4 судьями для D-бригады
 * - Проверить, что judgeIds.length === 4 для D, E, A бригад
 * - Проверить назначение руководителя бригады
 *
 * Тест 3: Назначение судьи
 * - Создать JudgeAssignment с позицией D1
 * - Проверить соответствие роли и позиции
 * - Проверить отсутствие конфликтов интересов
 *
 * Тест 4: Конфликт интересов
 * - Создать ConflictOfInterest между судьей и спортсменом
 * - Проверить, что судья не может судить этого спортсмена
 * - Проверить процесс одобрения главным судьей
 *
 * Тест 5: Протокол консенсуса
 * - Создать ConsensusProtocol с расхождением оценок > 0.3
 * - Рассчитать maxDeviation из originalScores
 * - Проверить процесс разрешения консенсуса
 *
 * Тест 6: Статистика судьи
 * - Создать несколько оценок от одного судьи
 * - Рассчитать JudgeStatistics
 * - Проверить consensusRate и averageScoreGiven
 */
