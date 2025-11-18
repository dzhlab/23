/**
 * Файл: types/score.types.ts
 * Описание: TypeScript типы и интерфейсы для системы оценивания
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: common.types.ts
 */

// Импорт общих типов
import {
  UUID,
  Timestamp,
  BrigadeType,
  ScoreStatus,
  BodyDifficultyType,
  ApparatusType
} from './common.types';

/**
 * Интерфейс для оценки судьи
 * Базовая оценка от одного судьи
 */
export interface Score {
  // Уникальный идентификатор оценки
  id: UUID;

  // ID выступления
  performanceId: UUID;

  // ID судьи
  judgeId: UUID;

  // Тип бригады судьи
  brigadeType: BrigadeType;

  // Позиция судьи в бригаде (D1, D2, E1, E2, etc.)
  judgePosition: string;

  // Итоговая оценка судьи (после всех расчетов)
  totalScore: number;

  // Статус оценки
  status: ScoreStatus;

  // Время начала оценивания
  startTime?: Timestamp;

  // Время завершения оценивания (отправки)
  submitTime?: Timestamp;

  // Продолжительность оценивания (секунды)
  judgingDuration?: number;

  // Комментарий судьи
  comment?: string;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для D-оценки (Difficulty)
 * Оценка трудности выступления
 */
export interface DifficultyScore {
  // ID оценки (связь со Score)
  scoreId: UUID;

  // ID выступления
  performanceId: UUID;

  // ID судьи
  judgeId: UUID;

  // Оценка трудности тела (Body Difficulty) - DB
  bodyDifficulty: number;

  // Оценка трудности предмета (Apparatus Difficulty) - DA
  apparatusDifficulty: number;

  // Итоговая D-оценка (DB + DA)
  totalDScore: number;

  // Детализация элементов трудности тела
  bodyElements?: BodyDifficultyElement[];

  // Детализация элементов трудности предмета
  apparatusElements?: ApparatusDifficultyElement[];

  // Количество засчитанных элементов тела
  bodyElementsCount: number;

  // Количество засчитанных элементов предмета
  apparatusElementsCount: number;

  // Использован ли бонус за уникальные элементы
  uniqueElementBonus?: number;

  // Комментарий
  notes?: string;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для элемента трудности тела (Body Difficulty)
 * Отдельный элемент в выступлении
 */
export interface BodyDifficultyElement {
  // Уникальный идентификатор элемента
  id: UUID;

  // ID D-оценки
  difficultyScoreId: UUID;

  // Тип элемента (J - прыжок, B - равновесие, R - поворот, F - гибкость)
  elementType: BodyDifficultyType;

  // Код элемента по FIG (например: "J.1.2.3")
  elementCode: string;

  // Уровень сложности (A=0.1, B=0.2, C=0.3, D=0.4, E=0.5, F=0.6, G=0.7, H=0.8, I=0.9, J=1.0)
  difficultyLevel: string;

  // Стоимость элемента (в баллах)
  value: number;

  // Засчитан ли элемент (да/нет)
  counted: boolean;

  // Причина незачета (если не засчитан)
  rejectionReason?: string;

  // Порядковый номер в упражнении
  sequenceNumber: number;

  // Описание элемента
  description?: string;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для элемента трудности предмета (Apparatus Difficulty)
 * Сложность работы с предметом
 */
export interface ApparatusDifficultyElement {
  // Уникальный идентификатор
  id: UUID;

  // ID D-оценки
  difficultyScoreId: UUID;

  // Код элемента (например: "AD.1.2.3")
  elementCode: string;

  // Уровень сложности
  difficultyLevel: string;

  // Стоимость элемента
  value: number;

  // Засчитан ли элемент
  counted: boolean;

  // Причина незачета
  rejectionReason?: string;

  // Порядковый номер
  sequenceNumber: number;

  // Тип предмета
  apparatusType: ApparatusType;

  // Описание элемента
  description?: string;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для E-оценки (Execution)
 * Оценка исполнения (сбавки за технические ошибки)
 */
export interface ExecutionScore {
  // ID оценки (связь со Score)
  scoreId: UUID;

  // ID выступления
  performanceId: UUID;

  // ID судьи
  judgeId: UUID;

  // Начальная оценка (обычно 10.0)
  startingScore: number;

  // Общая сумма сбавок
  totalDeductions: number;

  // Итоговая E-оценка (startingScore - totalDeductions)
  totalEScore: number;

  // Детализация сбавок
  deductions?: ExecutionDeduction[];

  // Комментарий
  notes?: string;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для сбавки исполнения
 * Отдельная ошибка в технике
 */
export interface ExecutionDeduction {
  // Уникальный идентификатор
  id: UUID;

  // ID E-оценки
  executionScoreId: UUID;

  // Тип ошибки (по категориям FIG)
  deductionType: ExecutionDeductionType;

  // Описание ошибки
  description: string;

  // Величина сбавки (0.1, 0.3, 0.5)
  deductionValue: number;

  // Количество повторений ошибки
  count: number;

  // Общая сумма сбавки за эту ошибку (deductionValue * count)
  totalDeduction: number;

  // Временная метка в выступлении (секунды)
  timestamp?: number;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Перечисление типов сбавок исполнения
 * Категории технических ошибок
 */
export enum ExecutionDeductionType {
  // Технические ошибки тела
  BODY_TECHNIQUE = 'body_technique',

  // Ошибки работы с предметом
  APPARATUS_HANDLING = 'apparatus_handling',

  // Потеря равновесия
  BALANCE_LOSS = 'balance_loss',

  // Падение
  FALL = 'fall',

  // Ошибки осанки
  POSTURE = 'posture',

  // Недокруты/перекруты
  ROTATION = 'rotation',

  // Ошибки приземления
  LANDING = 'landing',

  // Асинхронность (для групповых)
  SYNCHRONIZATION = 'synchronization',

  // Другие ошибки
  OTHER = 'other'
}

/**
 * Интерфейс для A-оценки (Artistry)
 * Оценка артистизма и композиции
 */
export interface ArtistryScore {
  // ID оценки (связь со Score)
  scoreId: UUID;

  // ID выступления
  performanceId: UUID;

  // ID судьи
  judgeId: UUID;

  // Начальная оценка (обычно 10.0)
  startingScore: number;

  // Общая сумма сбавок
  totalDeductions: number;

  // Итоговая A-оценка (startingScore - totalDeductions)
  totalAScore: number;

  // Оценка музыки и движения (0-2.0)
  musicAndMovement?: number;

  // Оценка хореографии (0-2.0)
  choreography?: number;

  // Оценка использования пространства (0-2.0)
  spaceUtilization?: number;

  // Оценка выразительности (0-2.0)
  expressiveness?: number;

  // Оценка соответствия музыке (0-2.0)
  musicalAccompaniment?: number;

  // Детализация сбавок
  deductions?: ArtistryDeduction[];

  // Комментарий
  notes?: string;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для сбавки артистизма
 * Недочеты в композиции и артистизме
 */
export interface ArtistryDeduction {
  // Уникальный идентификатор
  id: UUID;

  // ID A-оценки
  artistryScoreId: UUID;

  // Тип сбавки
  deductionType: ArtistryDeductionType;

  // Описание
  description: string;

  // Величина сбавки
  deductionValue: number;

  // Количество
  count: number;

  // Общая сбавка
  totalDeduction: number;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Перечисление типов сбавок артистизма
 * Категории артистических недочетов
 */
export enum ArtistryDeductionType {
  // Несоответствие музыке
  MUSIC_MISMATCH = 'music_mismatch',

  // Недостаточное использование пространства
  SPACE_UTILIZATION = 'space_utilization',

  // Отсутствие выразительности
  LACK_OF_EXPRESSION = 'lack_of_expression',

  // Монотонность композиции
  MONOTONY = 'monotony',

  // Недостаточное разнообразие
  LACK_OF_VARIETY = 'lack_of_variety',

  // Прерывистость композиции
  FRAGMENTATION = 'fragmentation',

  // Недостаточная связь между элементами
  POOR_CONNECTION = 'poor_connection',

  // Другое
  OTHER = 'other'
}

/**
 * Интерфейс для нейтральных сбавок
 * Сбавки, не зависящие от судей (время, выход за ковер и т.д.)
 */
export interface NeutralDeduction {
  // Уникальный идентификатор
  id: UUID;

  // ID выступления
  performanceId: UUID;

  // Тип сбавки
  deductionType: NeutralDeductionType;

  // Величина сбавки
  deductionValue: number;

  // Описание
  description: string;

  // ID судьи/секретаря, зафиксировавшего сбавку
  recordedBy: UUID;

  // Время фиксации
  recordedAt: Timestamp;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Перечисление типов нейтральных сбавок
 * Объективные штрафы
 */
export enum NeutralDeductionType {
  // Превышение времени
  TIME_EXCEEDED = 'time_exceeded',

  // Недостаточное время
  TIME_TOO_SHORT = 'time_too_short',

  // Выход за границу ковра
  OUT_OF_BOUNDS = 'out_of_bounds',

  // Потеря предмета за ковер
  APPARATUS_OUT = 'apparatus_out',

  // Неправильный костюм
  COSTUME_VIOLATION = 'costume_violation',

  // Запрещенные движения
  FORBIDDEN_MOVEMENTS = 'forbidden_movements',

  // Другое
  OTHER = 'other'
}

/**
 * Интерфейс для хронометража
 * Измерение времени выступления
 */
export interface TimeKeeping {
  // Уникальный идентификатор
  id: UUID;

  // ID выступления
  performanceId: UUID;

  // ID хронометриста
  timekeeperId: UUID;

  // Время начала музыки
  musicStartTime: Timestamp;

  // Время окончания музыки
  musicEndTime: Timestamp;

  // Общая продолжительность (секунды)
  totalDuration: number;

  // Минимально допустимое время
  minAllowedTime: number;

  // Максимально допустимое время
  maxAllowedTime: number;

  // В пределах допустимого времени (да/нет)
  withinTimeLimit: boolean;

  // Сбавка за время (если есть)
  timeDeduction?: number;

  // Комментарий
  notes?: string;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для фиксации выходов за линию
 * Работа судьи на линии
 */
export interface LineJudging {
  // Уникальный идентификатор
  id: UUID;

  // ID выступления
  performanceId: UUID;

  // ID судьи на линии
  lineJudgeId: UUID;

  // Количество выходов гимнастки за линию
  athleteOutOfBoundsCount: number;

  // Количество выходов предмета за линию
  apparatusOutOfBoundsCount: number;

  // Детальная информация о выходах
  violations?: LineViolation[];

  // Общая сбавка за выходы
  totalDeduction: number;

  // Комментарий
  notes?: string;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для отдельного нарушения линии
 * Конкретный случай выхода за ковер
 */
export interface LineViolation {
  // Уникальный идентификатор
  id: UUID;

  // ID записи линейного судьи
  lineJudgingId: UUID;

  // Тип нарушения (athlete - гимнастка, apparatus - предмет)
  violationType: 'athlete' | 'apparatus';

  // Часть тела или предмет
  description: string;

  // Временная метка в выступлении (секунды)
  timestamp: number;

  // Сбавка за это нарушение
  deduction: number;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Интерфейс для итоговой оценки выступления
 * Агрегированная оценка от всех бригад
 */
export interface FinalPerformanceScore {
  // ID выступления
  performanceId: UUID;

  // Финальная D-оценка (после консенсуса и расчета)
  finalDScore: number;

  // Детали расчета D-оценки
  dScoreDetails?: {
    bodyDifficulty: number;
    apparatusDifficulty: number;
    judgeScores: number[];
    calculationMethod: string;
  };

  // Финальная E-оценка
  finalEScore: number;

  // Детали E-оценки
  eScoreDetails?: {
    judgeScores: number[];
    droppedScores?: number[];
    averageScore: number;
  };

  // Финальная A-оценка
  finalAScore: number;

  // Детали A-оценки
  aScoreDetails?: {
    judgeScores: number[];
    droppedScores?: number[];
    averageScore: number;
  };

  // Нейтральные сбавки
  neutralDeductions: number;

  // Штрафы
  penalties: number;

  // Итоговая финальная оценка
  totalScore: number;

  // Ранг/место
  rank?: number;

  // Утверждено главным судьей
  approvedByChiefJudge: boolean;

  // ID главного судьи
  chiefJudgeId?: UUID;

  // Время утверждения
  approvalTime?: Timestamp;

  // Временные метки
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * ТЕСТЫ для score.types.ts
 *
 * Тест 1: Расчет D-оценки (FIG метод)
 * - Создать 4 DifficultyScore от судей D1, D2, D3, D4
 * - Рассчитать среднее: ((D1+D2)/2 + (D3+D4)/2) / 2
 * - Проверить корректность расчета
 *
 * Тест 2: Расчет D-оценки (Российский метод)
 * - Создать 4 DifficultyScore
 * - Рассчитать среднее арифметическое: (D1+D2+D3+D4)/4
 * - Проверить корректность расчета
 *
 * Тест 3: Расчет E-оценки
 * - Создать 4 ExecutionScore от судей E1-E4
 * - Убрать максимальную и минимальную оценку
 * - Рассчитать среднее из оставшихся двух
 * - Проверить корректность
 *
 * Тест 4: Подсчет сбавок
 * - Создать ExecutionScore с несколькими ExecutionDeduction
 * - Рассчитать totalDeductions = sum(deduction.totalDeduction)
 * - Проверить totalEScore = 10.0 - totalDeductions
 *
 * Тест 5: Элементы трудности
 * - Создать DifficultyScore с 12 BodyDifficultyElement
 * - Отметить 9 как засчитанные (лучшие 9)
 * - Рассчитать bodyDifficulty = sum(counted elements values)
 *
 * Тест 6: Финальная оценка
 * - Создать FinalPerformanceScore
 * - Рассчитать totalScore = finalDScore + finalEScore + finalAScore - neutralDeductions - penalties
 * - Проверить корректность итоговой оценки
 *
 * Тест 7: Хронометраж
 * - Создать TimeKeeping с duration = 95 секунд (для программы 90±5 сек)
 * - Проверить withinTimeLimit = true
 * - Проверить timeDeduction = 0
 *
 * Тест 8: Нарушения линии
 * - Создать LineJudging с 2 выходами гимнастки и 1 выходом предмета
 * - Рассчитать totalDeduction = 2*0.05 + 1*0.3 = 0.4
 * - Проверить корректность
 */
