/**
 * Файл: types/competition.types.ts
 * Описание: TypeScript типы и интерфейсы для соревнований
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: common.types.ts
 */

// Импорт общих типов из common.types
import {
  UUID,
  Timestamp,
  CompetitionType,
  CompetitionStatus,
  ApparatusType,
  DScoreCalculationMethod,
  RankingMethod,
  JudgeInterfaceType
} from './common.types';

/**
 * Интерфейс для основной информации о соревновании
 * Содержит все метаданные и настройки соревнования
 */
export interface Competition {
  // Уникальный идентификатор соревнования
  id: UUID;

  // Название соревнования (например: "Чемпионат России 2025")
  name: string;

  // Полное официальное название
  fullName?: string;

  // Описание соревнования
  description?: string;

  // Тип соревнования (индивидуальное, групповое, ОФП)
  type: CompetitionType;

  // Текущий статус соревнования
  status: CompetitionStatus;

  // Дата начала соревнования
  startDate: Timestamp;

  // Дата окончания соревнования
  endDate: Timestamp;

  // Место проведения (город)
  location: string;

  // Адрес места проведения
  venue: string;

  // ID организатора (ссылка на User)
  organizerId: UUID;

  // ID главного судьи соревнования
  chiefJudgeId?: UUID;

  // ID главного секретаря
  chiefSecretaryId?: UUID;

  // Метод расчета D-оценки (российский или FIG)
  dScoreMethod: DScoreCalculationMethod;

  // Метод ранжирования при равенстве оценок
  rankingMethod: RankingMethod;

  // Тип интерфейса судьи по умолчанию
  defaultJudgeInterface: JudgeInterfaceType;

  // Логотип соревнования (URL или путь к файлу)
  logo?: string;

  // Спонсоры соревнования
  sponsors?: string[];

  // Регламент соревнования (URL к файлу)
  regulations?: string;

  // Максимальное количество участников
  maxParticipants?: number;

  // Открыта ли регистрация
  registrationOpen: boolean;

  // Дата начала регистрации
  registrationStartDate?: Timestamp;

  // Дата окончания регистрации
  registrationEndDate?: Timestamp;

  // Стоимость участия (в рублях)
  entryFee?: number;

  // Временная метка создания
  createdAt: Timestamp;

  // Временная метка последнего обновления
  updatedAt: Timestamp;
}

/**
 * Интерфейс для создания нового соревнования
 * Содержит только необходимые поля (без id, timestamps)
 */
export interface CreateCompetitionDto {
  // Название соревнования
  name: string;

  // Полное официальное название
  fullName?: string;

  // Описание соревнования
  description?: string;

  // Тип соревнования
  type: CompetitionType;

  // Дата начала
  startDate: Timestamp;

  // Дата окончания
  endDate: Timestamp;

  // Место проведения
  location: string;

  // Адрес места проведения
  venue: string;

  // Метод расчета D-оценки
  dScoreMethod: DScoreCalculationMethod;

  // Метод ранжирования
  rankingMethod: RankingMethod;

  // Тип интерфейса судьи
  defaultJudgeInterface: JudgeInterfaceType;

  // Логотип соревнования
  logo?: string;

  // Спонсоры
  sponsors?: string[];

  // Регламент
  regulations?: string;

  // Максимальное количество участников
  maxParticipants?: number;

  // Стоимость участия
  entryFee?: number;

  // Даты регистрации
  registrationStartDate?: Timestamp;
  registrationEndDate?: Timestamp;
}

/**
 * Интерфейс для обновления соревнования
 * Все поля опциональны для частичного обновления
 */
export interface UpdateCompetitionDto {
  // Название соревнования
  name?: string;

  // Полное название
  fullName?: string;

  // Описание
  description?: string;

  // Статус
  status?: CompetitionStatus;

  // Даты
  startDate?: Timestamp;
  endDate?: Timestamp;

  // Место
  location?: string;
  venue?: string;

  // Настройки оценивания
  dScoreMethod?: DScoreCalculationMethod;
  rankingMethod?: RankingMethod;
  defaultJudgeInterface?: JudgeInterfaceType;

  // Медиа
  logo?: string;
  sponsors?: string[];
  regulations?: string;

  // Регистрация
  maxParticipants?: number;
  registrationOpen?: boolean;
  registrationStartDate?: Timestamp;
  registrationEndDate?: Timestamp;
  entryFee?: number;
}

/**
 * Интерфейс для дня соревнований
 * Один день может содержать несколько событий
 */
export interface CompetitionDay {
  // Уникальный идентификатор дня
  id: UUID;

  // ID соревнования
  competitionId: UUID;

  // Дата проведения
  date: Timestamp;

  // Название дня (например: "День 1 - Квалификация")
  name: string;

  // Порядковый номер дня (1, 2, 3...)
  dayNumber: number;

  // Время начала
  startTime: string;

  // Время окончания
  endTime: string;

  // События этого дня
  events?: CompetitionEvent[];

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для события соревнования
 * Событие - это конкретный вид программы (например: мяч, обруч)
 */
export interface CompetitionEvent {
  // Уникальный идентификатор события
  id: UUID;

  // ID соревнования
  competitionId: UUID;

  // ID дня соревнования
  dayId: UUID;

  // Название события (например: "Квалификация - Мяч")
  name: string;

  // Тип предмета
  apparatus: ApparatusType;

  // Возрастная группа (например: "Мастера", "КМС", "Юниоры")
  ageGroup: string;

  // Минимальный год рождения
  minBirthYear?: number;

  // Максимальный год рождения
  maxBirthYear?: number;

  // Порядковый номер события в дне
  eventOrder: number;

  // Запланированное время начала
  scheduledTime: string;

  // Фактическое время начала
  actualStartTime?: Timestamp;

  // Фактическое время окончания
  actualEndTime?: Timestamp;

  // Количество потоков (параллельных площадок)
  numberOfStreams: number;

  // Статус события (scheduled, in_progress, completed, cancelled)
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для потока (площадки)
 * Поток - это параллельное проведение выступлений на разных площадках
 */
export interface Stream {
  // Уникальный идентификатор потока
  id: UUID;

  // ID события
  eventId: UUID;

  // Название потока (например: "Поток 1", "Площадка А")
  name: string;

  // Номер потока
  streamNumber: number;

  // Координатор потока (Stream Coordinator)
  coordinatorId?: UUID;

  // Статус потока
  status: 'idle' | 'active' | 'paused' | 'completed';

  // Текущий выступающий участник
  currentParticipantId?: UUID;

  // Очередь участников (массив ID)
  participantQueue: UUID[];

  // Количество завершенных выступлений
  completedPerformances: number;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для группы участников
 * Группа объединяет участников одной категории
 */
export interface ParticipantGroup {
  // Уникальный идентификатор группы
  id: UUID;

  // ID события
  eventId: UUID;

  // Название группы (например: "Группа А - Мастера")
  name: string;

  // Номер группы
  groupNumber: number;

  // Минимальный год рождения
  minBirthYear?: number;

  // Максимальный год рождения
  maxBirthYear?: number;

  // Уровень квалификации (МС, КМС, I разряд и т.д.)
  qualificationLevel?: string;

  // ID участников группы
  participantIds: UUID[];

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для расписания выступлений
 * Определяет порядок и время выступлений
 */
export interface PerformanceSchedule {
  // Уникальный идентификатор
  id: UUID;

  // ID события
  eventId: UUID;

  // ID потока
  streamId: UUID;

  // ID участника (атлета или команды)
  participantId: UUID;

  // Порядковый номер выступления
  performanceOrder: number;

  // Запланированное время
  scheduledTime?: Timestamp;

  // Фактическое время начала
  actualStartTime?: Timestamp;

  // Фактическое время окончания
  actualEndTime?: Timestamp;

  // Статус выступления
  status: 'scheduled' | 'ready' | 'in_progress' | 'completed' | 'skipped' | 'disqualified';

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для настроек судейства
 * Конфигурация судейских бригад для события
 */
export interface JudgingConfiguration {
  // Уникальный идентификатор
  id: UUID;

  // ID события
  eventId: UUID;

  // Количество судей D-бригады
  dJudgesCount: number;

  // Количество судей E-бригады
  eJudgesCount: number;

  // Количество судей A-бригады
  aJudgesCount: number;

  // Количество хронометристов
  timekeepersCount: number;

  // Количество судей на линии
  lineJudgesCount: number;

  // Использовать ли автоматическое вычисление консенсуса
  useAutoConsensus: boolean;

  // Порог расхождения для консенсуса (в баллах)
  consensusThreshold: number;

  // Разрешить судьям видеть оценки друг друга
  allowJudgesToSeeOtherScores: boolean;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для статистики соревнования
 * Агрегированная информация о соревновании
 */
export interface CompetitionStatistics {
  // ID соревнования
  competitionId: UUID;

  // Общее количество участников
  totalParticipants: number;

  // Количество завершенных выступлений
  completedPerformances: number;

  // Количество запланированных выступлений
  scheduledPerformances: number;

  // Количество судей
  totalJudges: number;

  // Количество событий
  totalEvents: number;

  // Средняя продолжительность выступления (в секундах)
  averagePerformanceDuration: number;

  // Самая высокая оценка
  highestScore?: number;

  // Самая низкая оценка
  lowestScore?: number;

  // Средняя оценка
  averageScore?: number;

  // Время последнего обновления статистики
  lastUpdated: Timestamp;
}

/**
 * ТЕСТЫ для competition.types.ts
 *
 * Тест 1: Создание соревнования через DTO
 * - Создать объект CreateCompetitionDto с валидными данными
 * - Проверить, что все обязательные поля присутствуют
 * - Проверить типы полей
 *
 * Тест 2: Обновление соревнования
 * - Создать объект UpdateCompetitionDto с частичными данными
 * - Проверить, что все поля опциональны
 * - Применить обновление к существующему Competition
 *
 * Тест 3: Структура дня соревнований
 * - Создать CompetitionDay с несколькими событиями
 * - Проверить правильность связей между днем и событиями
 * - Проверить корректность временных интервалов
 *
 * Тест 4: Расписание выступлений
 * - Создать PerformanceSchedule для нескольких участников
 * - Проверить уникальность порядковых номеров
 * - Проверить последовательность времени выступлений
 *
 * Тест 5: Конфигурация судейства
 * - Создать JudgingConfiguration с минимальными требованиями FIG
 * - Проверить, что количество судей соответствует правилам (D=4, E=4, A=4)
 * - Проверить валидность порога консенсуса
 */
