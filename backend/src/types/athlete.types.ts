/**
 * Файл: types/athlete.types.ts
 * Описание: TypeScript типы и интерфейсы для спортсменов и выступлений
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: common.types.ts
 */

// Импорт общих типов
import { UUID, Timestamp, CompetitionType, ApparatusType } from './common.types';

/**
 * Интерфейс для спортсмена
 * Содержит всю информацию об атлете
 */
export interface Athlete {
  // Уникальный идентификатор спортсмена
  id: UUID;

  // Фамилия
  lastName: string;

  // Имя
  firstName: string;

  // Отчество
  middleName?: string;

  // Дата рождения
  dateOfBirth: Timestamp;

  // Пол (М/Ж)
  gender: 'M' | 'F';

  // Страна (ISO код, например: RUS, USA)
  country: string;

  // Регион/область
  region?: string;

  // Город
  city?: string;

  // ID клуба/школы
  clubId?: UUID;

  // Название клуба/школы
  clubName: string;

  // ID основного тренера
  coachId?: UUID;

  // ФИО основного тренера
  coachName: string;

  // Разряд/квалификация (МС, КМС, I разряд и т.д.)
  qualification?: string;

  // Номер лицензии FIG (для международных соревнований)
  figLicense?: string;

  // Email для связи
  email?: string;

  // Телефон для связи
  phone?: string;

  // Фото спортсмена (URL)
  photo?: string;

  // Медицинский допуск действителен до
  medicalClearanceUntil?: Timestamp;

  // Страховка действительна до
  insuranceValidUntil?: Timestamp;

  // Биография/достижения
  biography?: string;

  // Статус (active - активен, retired - завершил карьеру, suspended - дисквалификация)
  status: 'active' | 'retired' | 'suspended';

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для создания нового спортсмена
 * Только необходимые поля
 */
export interface CreateAthleteDto {
  // Фамилия, имя, отчество
  lastName: string;
  firstName: string;
  middleName?: string;

  // Дата рождения
  dateOfBirth: Timestamp;

  // Пол
  gender: 'M' | 'F';

  // География
  country: string;
  region?: string;
  city?: string;

  // Клуб и тренер
  clubName: string;
  coachName: string;

  // Квалификация
  qualification?: string;
  figLicense?: string;

  // Контакты
  email?: string;
  phone?: string;

  // Документы
  medicalClearanceUntil?: Timestamp;
  insuranceValidUntil?: Timestamp;
}

/**
 * Интерфейс для обновления данных спортсмена
 * Все поля опциональны
 */
export interface UpdateAthleteDto {
  lastName?: string;
  firstName?: string;
  middleName?: string;
  dateOfBirth?: Timestamp;
  country?: string;
  region?: string;
  city?: string;
  clubName?: string;
  coachName?: string;
  qualification?: string;
  figLicense?: string;
  email?: string;
  phone?: string;
  photo?: string;
  medicalClearanceUntil?: Timestamp;
  insuranceValidUntil?: Timestamp;
  biography?: string;
  status?: 'active' | 'retired' | 'suspended';
}

/**
 * Интерфейс для регистрации на соревнование
 * Связывает спортсмена с конкретным соревнованием
 */
export interface CompetitionRegistration {
  // Уникальный идентификатор регистрации
  id: UUID;

  // ID соревнования
  competitionId: UUID;

  // ID спортсмена
  athleteId: UUID;

  // Номер участника на соревновании (стартовый номер)
  bib: string;

  // Тип участия (individual, group)
  participationType: CompetitionType;

  // ID команды (если групповое выступление)
  teamId?: UUID;

  // События, в которых участвует спортсмен (массив ID событий)
  eventIds: UUID[];

  // Статус регистрации
  status: 'pending' | 'confirmed' | 'cancelled' | 'withdrawn';

  // Дата регистрации
  registrationDate: Timestamp;

  // Подтверждена ли оплата
  paymentConfirmed: boolean;

  // Сумма оплаты
  paymentAmount?: number;

  // Дата оплаты
  paymentDate?: Timestamp;

  // Примечания
  notes?: string;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для выступления спортсмена
 * Связывает спортсмена с конкретным событием и его оценками
 */
export interface Performance {
  // Уникальный идентификатор выступления
  id: UUID;

  // ID соревнования
  competitionId: UUID;

  // ID события
  eventId: UUID;

  // ID спортсмена (или команды)
  participantId: UUID;

  // Тип участника (individual или group)
  participantType: CompetitionType;

  // Предмет
  apparatus: ApparatusType;

  // Порядковый номер выступления
  performanceOrder: number;

  // Время начала выступления
  startTime?: Timestamp;

  // Время окончания выступления
  endTime?: Timestamp;

  // Продолжительность упражнения (в секундах)
  duration?: number;

  // Итоговая D-оценка (после расчета)
  dScore?: number;

  // Итоговая E-оценка (после расчета)
  eScore?: number;

  // Итоговая A-оценка (после расчета)
  aScore?: number;

  // Нейтральные сбавки
  neutralDeductions?: number;

  // Штрафы (выход за время, выход за ковер и т.д.)
  penalties?: number;

  // Финальная итоговая оценка (D + E + A - penalties)
  finalScore?: number;

  // Ранг/место
  rank?: number;

  // Статус выступления
  status: 'scheduled' | 'in_progress' | 'completed' | 'dns' | 'dnf' | 'dq';

  // Причина DNS/DNF/DQ
  statusReason?: string;

  // Видеозапись выступления (URL)
  videoUrl?: string;

  // Комментарии
  comments?: string;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для команды (группового выступления)
 * Команда из 5 гимнасток
 */
export interface Team {
  // Уникальный идентификатор команды
  id: UUID;

  // Название команды
  name: string;

  // ID клуба
  clubId?: UUID;

  // Название клуба
  clubName: string;

  // ID тренера
  coachId?: UUID;

  // ФИО тренера
  coachName: string;

  // Страна
  country: string;

  // Регион
  region?: string;

  // Массив ID спортсменов (5 человек)
  athleteIds: UUID[];

  // Запасные участники
  reserveAthleteIds?: UUID[];

  // Статус команды
  status: 'active' | 'disbanded';

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для состава команды
 * Связывает команду со спортсменами и их ролями
 */
export interface TeamMember {
  // Уникальный идентификатор
  id: UUID;

  // ID команды
  teamId: UUID;

  // ID спортсмена
  athleteId: UUID;

  // Роль в команде (captain - капитан, member - участник, reserve - запасной)
  role: 'captain' | 'member' | 'reserve';

  // Позиция в команде (1-5)
  position?: number;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для личных достижений спортсмена
 * История результатов и рекордов
 */
export interface AthleteAchievement {
  // Уникальный идентификатор
  id: UUID;

  // ID спортсмена
  athleteId: UUID;

  // Название соревнования
  competitionName: string;

  // Дата соревнования
  competitionDate: Timestamp;

  // Место/ранг
  rank: number;

  // Оценка
  score: number;

  // Предмет
  apparatus?: ApparatusType;

  // Уровень соревнования (international, national, regional, club)
  level: 'international' | 'national' | 'regional' | 'club';

  // Описание достижения
  description?: string;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для статистики спортсмена
 * Агрегированные данные о выступлениях
 */
export interface AthleteStatistics {
  // ID спортсмена
  athleteId: UUID;

  // Общее количество соревнований
  totalCompetitions: number;

  // Общее количество выступлений
  totalPerformances: number;

  // Количество медалей по типам
  goldMedals: number;
  silverMedals: number;
  bronzeMedals: number;

  // Лучшая оценка за всю карьеру
  bestScore?: number;

  // Соревнование с лучшей оценкой
  bestScoreCompetition?: string;

  // Дата лучшей оценки
  bestScoreDate?: Timestamp;

  // Средняя оценка за карьеру
  averageScore?: number;

  // Любимый предмет (с наибольшим количеством выступлений)
  favoriteApparatus?: ApparatusType;

  // Статистика по предметам (средние оценки)
  apparatusAverages?: {
    [key in ApparatusType]?: number;
  };

  // Время последнего обновления статистики
  lastUpdated: Timestamp;
}

/**
 * ТЕСТЫ для athlete.types.ts
 *
 * Тест 1: Создание спортсмена
 * - Создать Athlete через CreateAthleteDto
 * - Проверить обязательные поля (lastName, firstName, dateOfBirth, gender)
 * - Проверить формат даты рождения
 *
 * Тест 2: Регистрация на соревнование
 * - Создать CompetitionRegistration
 * - Проверить связь спортсмена с соревнованием
 * - Проверить статусы регистрации
 *
 * Тест 3: Выступление спортсмена
 * - Создать Performance с оценками
 * - Рассчитать finalScore = dScore + eScore + aScore - penalties
 * - Проверить корректность расчета
 *
 * Тест 4: Команда для группового выступления
 * - Создать Team с 5 спортсменами
 * - Проверить, что athleteIds.length === 5
 * - Проверить связи через TeamMember
 *
 * Тест 5: Статистика спортсмена
 * - Создать несколько Performance для одного спортсмена
 * - Рассчитать AthleteStatistics
 * - Проверить корректность averageScore и bestScore
 */
