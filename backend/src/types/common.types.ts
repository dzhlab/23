/**
 * Файл: types/common.types.ts
 * Описание: Общие TypeScript типы и интерфейсы, используемые во всем приложении
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: нет
 */

/**
 * Тип для UUID идентификатора
 * Используется для первичных ключей всех сущностей
 */
export type UUID = string;

/**
 * Тип для временной метки в формате ISO 8601
 * Пример: "2025-11-18T10:30:00.000Z"
 */
export type Timestamp = string;

/**
 * Перечисление ролей пользователей в системе
 * Определяет уровень доступа к функциям системы
 */
export enum UserRole {
  // Полный доступ ко всем функциям системы
  ADMIN = 'admin',

  // Создание и управление соревнованиями
  ORGANIZER = 'organizer',

  // Контроль судейства, утверждение результатов
  CHIEF_JUDGE = 'chief_judge',

  // Управление участниками, потоками, протоколами
  CHIEF_SECRETARY = 'chief_secretary',

  // Оценка трудности (D)
  JUDGE_D = 'judge_D',

  // Оценка исполнения (E)
  JUDGE_E = 'judge_E',

  // Оценка артистизма (A)
  JUDGE_A = 'judge_A',

  // Хронометраж
  TIMEKEEPER = 'timekeeper',

  // Судья на линии
  LINE_JUDGE = 'line_judge',

  // Секретарь бригады
  BRIGADE_SECRETARY = 'brigade_secretary',

  // Управление текущим потоком
  STREAM_COORDINATOR = 'stream_coordinator',

  // Просмотр результатов своих участников
  COACH = 'coach',

  // Просмотр публичного табло
  SPECTATOR = 'spectator'
}

/**
 * Перечисление типов судейских бригад
 * Соответствует правилам FIG 2025-2028
 */
export enum BrigadeType {
  // Бригада оценки трудности (Difficulty)
  // 4 судьи: D1, D2 (DB), D3, D4 (DA)
  D = 'D',

  // Бригада оценки исполнения (Execution)
  // 4 судьи: E1, E2, E3, E4
  E = 'E',

  // Бригада оценки артистизма (Artistry)
  // 4 судьи: A1, A2, A3, A4
  A = 'A',

  // Хронометраж (Time)
  T = 'T',

  // Судьи на линии (Line)
  L = 'L'
}

/**
 * Перечисление типов соревнований
 * Определяет формат проведения
 */
export enum CompetitionType {
  // Индивидуальные выступления
  INDIVIDUAL = 'individual',

  // Групповые выступления (команды из 5 человек)
  GROUP = 'group',

  // Общая физическая подготовка
  GENERAL_PHYSICAL = 'general_physical'
}

/**
 * Перечисление статусов соревнования
 * Жизненный цикл соревнования
 */
export enum CompetitionStatus {
  // Черновик - создано но не опубликовано
  DRAFT = 'draft',

  // Опубликовано - открыта регистрация
  PUBLISHED = 'published',

  // Идет сейчас - соревнование началось
  IN_PROGRESS = 'in_progress',

  // Завершено - все выступления закончены
  COMPLETED = 'completed',

  // Отменено
  CANCELLED = 'cancelled'
}

/**
 * Перечисление предметов для выступлений
 * Согласно правилам художественной гимнастики
 */
export enum ApparatusType {
  // Без предмета
  NO_APPARATUS = 'no_apparatus',

  // Скакалка
  ROPE = 'rope',

  // Обруч
  HOOP = 'hoop',

  // Мяч
  BALL = 'ball',

  // Булавы
  CLUBS = 'clubs',

  // Лента
  RIBBON = 'ribbon'
}

/**
 * Перечисление методов расчета D-оценки
 * Два официальных метода
 */
export enum DScoreCalculationMethod {
  // Российский метод - среднее арифметическое всех судей
  RUSSIAN = 'russian',

  // Международный FIG - среднее подгрупп (D1+D2)/2 и (D3+D4)/2
  FIG = 'fig'
}

/**
 * Перечисление методов ранжирования при равенстве оценок
 * Три варианта обработки тай-брейков
 */
export enum RankingMethod {
  // Деление места (1-1-2)
  // При равенстве оба получают одно место
  SIMPLE_DIVISION = 'simple_division',

  // Деление места с пропуском (1-1-3)
  // При равенстве пропускается следующее место
  DIVISION_WITH_SKIP = 'division_with_skip',

  // Тай-брейк по компонентам (E → A → D)
  // При равенстве смотрим E, потом A, потом D
  TIEBREAK_BY_COMPONENTS = 'tiebreak_by_components'
}

/**
 * Перечисление типов интерфейса судьи
 * Три варианта с разной детализацией
 */
export enum JudgeInterfaceType {
  // Расширенный функционал (2-3 минуты на оценку)
  // Детальный ввод элементов с полным контролем
  EXTENDED = 'extended',

  // С минимизацией ошибок (30-60 секунд)
  // Автоматические проверки и подсказки
  BALANCED = 'balanced',

  // Упрощенный (10-20 секунд)
  // Быстрый ввод итоговых оценок
  SIMPLIFIED = 'simplified'
}

/**
 * Перечисление статусов оценки
 * Жизненный цикл оценки судьи
 */
export enum ScoreStatus {
  // Черновик - оценка еще редактируется
  DRAFT = 'draft',

  // Отправлена - судья подтвердил
  SUBMITTED = 'submitted',

  // Утверждена - проверена главным судьей
  APPROVED = 'approved',

  // Требуется консенсус - расхождение с другими судьями
  CONSENSUS_REQUIRED = 'consensus_required',

  // Отклонена - найдена ошибка
  REJECTED = 'rejected'
}

/**
 * Перечисление типов элементов трудности тела (Body Difficulty)
 * Классификация по правилам FIG
 */
export enum BodyDifficultyType {
  // Прыжки (Jumps)
  J = 'J',

  // Равновесия (Balances)
  B = 'B',

  // Повороты (Rotations)
  R = 'R',

  // Гибкость и волны
  F = 'F'
}

/**
 * Интерфейс для пагинации запросов
 * Стандартный формат для всех списковых запросов
 */
export interface PaginationParams {
  // Номер страницы (начиная с 1)
  page: number;

  // Количество элементов на странице
  limit: number;

  // Поле для сортировки
  sortBy?: string;

  // Направление сортировки (asc - по возрастанию, desc - по убыванию)
  sortOrder?: 'asc' | 'desc';
}

/**
 * Интерфейс для ответа с пагинацией
 * Единообразный формат ответов API
 */
export interface PaginatedResponse<T> {
  // Массив данных текущей страницы
  data: T[];

  // Метаданные пагинации
  meta: {
    // Текущая страница
    currentPage: number;

    // Количество элементов на странице
    itemsPerPage: number;

    // Общее количество элементов
    totalItems: number;

    // Общее количество страниц
    totalPages: number;

    // Есть ли следующая страница
    hasNextPage: boolean;

    // Есть ли предыдущая страница
    hasPreviousPage: boolean;
  };
}

/**
 * Интерфейс для стандартного ответа API
 * Используется для единообразия всех ответов
 */
export interface ApiResponse<T = any> {
  // Флаг успешности операции
  success: boolean;

  // Данные ответа (если есть)
  data?: T;

  // Сообщение (особенно важно при ошибках)
  message?: string;

  // Код ошибки (если есть)
  errorCode?: string;

  // Временная метка ответа
  timestamp: Timestamp;
}

/**
 * Интерфейс для фильтров поиска
 * Общие параметры фильтрации
 */
export interface SearchFilters {
  // Поисковый запрос (текст)
  query?: string;

  // Дата начала периода
  dateFrom?: Timestamp;

  // Дата окончания периода
  dateTo?: Timestamp;

  // Дополнительные фильтры (key-value пары)
  [key: string]: any;
}

/**
 * ТЕСТЫ для common.types.ts
 *
 * Тест 1: Перечисления должны иметь правильные значения
 * - Проверить, что UserRole.ADMIN === 'admin'
 * - Проверить, что BrigadeType.D === 'D'
 *
 * Тест 2: PaginatedResponse должен содержать все поля
 * - Создать mock ответ
 * - Проверить наличие data и meta
 *
 * Тест 3: ApiResponse должен быть типизирован правильно
 * - Создать ApiResponse<Competition>
 * - Проверить типы полей
 */
