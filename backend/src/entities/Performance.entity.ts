/**
 * Файл: entities/Performance.entity.ts
 * Описание: TypeORM Entity для выступления спортсмена
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: typeorm, types/athlete.types.ts
 */

// Импорт декораторов TypeORM
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';

// Импорт типов
import { CompetitionType, ApparatusType } from '../types/common.types';

// Импорт связанных entities
import { Competition } from './Competition.entity';
import { Athlete } from './Athlete.entity';

/**
 * Entity для выступления
 * Представляет таблицу performances в базе данных
 */
@Entity('performances') // Имя таблицы
@Index(['competitionId', 'eventId']) // Индекс для поиска выступлений по событию
@Index(['participantId']) // Индекс для поиска выступлений участника
@Index(['status']) // Индекс для фильтрации по статусу
@Index(['rank']) // Индекс для сортировки по месту
export class Performance {
  /**
   * Первичный ключ - UUID
   * Автоматически генерируется БД
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * ID соревнования
   * Внешний ключ на таблицу competitions
   */
  @Column({ type: 'uuid' })
  competitionId: string;

  /**
   * Связь с соревнованием
   * Many-to-One: много выступлений на одном соревновании
   */
  @ManyToOne(() => Competition, { nullable: false })
  @JoinColumn({ name: 'competitionId' })
  competition: Competition;

  /**
   * ID события (CompetitionEvent)
   * Внешний ключ на таблицу competition_events
   */
  @Column({ type: 'uuid' })
  eventId: string;

  /**
   * ID участника (спортсмена или команды)
   * Внешний ключ на таблицу athletes или teams
   */
  @Column({ type: 'uuid' })
  participantId: string;

  /**
   * Связь с участником (Athlete)
   * Many-to-One: много выступлений у одного спортсмена
   */
  @ManyToOne(() => Athlete, { nullable: false })
  @JoinColumn({ name: 'participantId' })
  participant: Athlete;

  /**
   * Тип участника
   * individual - индивидуальное выступление
   * group - групповое выступление
   */
  @Column({
    type: 'enum',
    enum: CompetitionType
  })
  participantType: CompetitionType;

  /**
   * Предмет
   * Enum: no_apparatus, rope, hoop, ball, clubs, ribbon
   */
  @Column({
    type: 'enum',
    enum: ApparatusType
  })
  apparatus: ApparatusType;

  /**
   * Порядковый номер выступления
   * Определяет последовательность выступлений
   */
  @Column({ type: 'int' })
  performanceOrder: number;

  /**
   * Время начала выступления
   * Опциональное поле (заполняется когда начинается выступление)
   */
  @Column({ type: 'timestamp', nullable: true })
  startTime?: Date;

  /**
   * Время окончания выступления
   * Опциональное поле (заполняется когда заканчивается выступление)
   */
  @Column({ type: 'timestamp', nullable: true })
  endTime?: Date;

  /**
   * Продолжительность упражнения (в секундах)
   * Рассчитывается автоматически или вводится хронометристом
   */
  @Column({ type: 'int', nullable: true })
  duration?: number;

  /**
   * Итоговая D-оценка (Difficulty)
   * Рассчитывается после получения оценок от всех D-судей
   */
  @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
  dScore?: number;

  /**
   * Итоговая E-оценка (Execution)
   * Рассчитывается после получения оценок от всех E-судей
   */
  @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
  eScore?: number;

  /**
   * Итоговая A-оценка (Artistry)
   * Рассчитывается после получения оценок от всех A-судей
   */
  @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true })
  aScore?: number;

  /**
   * Нейтральные сбавки
   * Штрафы от хронометристов и линейных судей
   */
  @Column({ type: 'decimal', precision: 4, scale: 2, default: 0 })
  neutralDeductions: number;

  /**
   * Дополнительные штрафы
   * Например: за нарушение правил, костюм и т.д.
   */
  @Column({ type: 'decimal', precision: 4, scale: 2, default: 0 })
  penalties: number;

  /**
   * Финальная итоговая оценка
   * Рассчитывается как: D + E + A - neutralDeductions - penalties
   */
  @Column({ type: 'decimal', precision: 6, scale: 3, nullable: true })
  finalScore?: number;

  /**
   * Ранг/место
   * Определяется после завершения всех выступлений
   */
  @Column({ type: 'int', nullable: true })
  rank?: number;

  /**
   * Статус выступления
   * scheduled - запланировано
   * in_progress - в процессе
   * completed - завершено
   * dns - не вышел на старт (Did Not Start)
   * dnf - не завершил (Did Not Finish)
   * dq - дисквалифицирован (Disqualified)
   */
  @Column({
    type: 'enum',
    enum: ['scheduled', 'in_progress', 'completed', 'dns', 'dnf', 'dq'],
    default: 'scheduled'
  })
  status: 'scheduled' | 'in_progress' | 'completed' | 'dns' | 'dnf' | 'dq';

  /**
   * Причина DNS/DNF/DQ
   * Опциональное поле, заполняется при статусе dns, dnf или dq
   */
  @Column({ type: 'text', nullable: true })
  statusReason?: string;

  /**
   * URL видеозаписи выступления
   * Опциональное поле
   */
  @Column({ type: 'text', nullable: true })
  videoUrl?: string;

  /**
   * Комментарии
   * Опциональное поле для дополнительных заметок
   */
  @Column({ type: 'text', nullable: true })
  comments?: string;

  /**
   * Дата создания записи
   * Автоматически устанавливается при создании
   */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  /**
   * Дата последнего обновления записи
   * Автоматически обновляется при изменении
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  /**
   * Метод для расчета финальной оценки
   * @returns Финальная оценка
   */
  calculateFinalScore(): number {
    // Если нет всех оценок, возвращаем 0
    if (this.dScore === null || this.eScore === null || this.aScore === null) {
      return 0;
    }
    // Рассчитываем: D + E + A - нейтральные сбавки - штрафы
    const score =
      Number(this.dScore) +
      Number(this.eScore) +
      Number(this.aScore) -
      Number(this.neutralDeductions) -
      Number(this.penalties);
    // Возвращаем результат, округленный до 3 знаков
    return Math.round(score * 1000) / 1000;
  }

  /**
   * Метод для проверки, завершено ли выступление
   * @returns true если статус completed
   */
  isCompleted(): boolean {
    // Проверяем статус
    return this.status === 'completed';
  }

  /**
   * Метод для проверки, идет ли выступление сейчас
   * @returns true если статус in_progress
   */
  isInProgress(): boolean {
    // Проверяем статус
    return this.status === 'in_progress';
  }

  /**
   * Метод для проверки, есть ли все оценки
   * @returns true если есть D, E и A оценки
   */
  hasAllScores(): boolean {
    // Проверяем наличие всех оценок
    return this.dScore !== null && this.eScore !== null && this.aScore !== null;
  }

  /**
   * Метод для получения продолжительности выступления
   * @returns Продолжительность в секундах или null
   */
  getDuration(): number | null {
    // Если есть сохраненная продолжительность, возвращаем ее
    if (this.duration !== null && this.duration !== undefined) {
      return this.duration;
    }
    // Если есть время начала и окончания, рассчитываем
    if (this.startTime && this.endTime) {
      const diffMs = this.endTime.getTime() - this.startTime.getTime();
      return Math.floor(diffMs / 1000);
    }
    // Иначе возвращаем null
    return null;
  }

  /**
   * Метод для проверки валидности выступления
   * @returns true если выступление валидно (не dns, dnf, dq)
   */
  isValid(): boolean {
    // Проверяем, что статус не является недействительным
    return !['dns', 'dnf', 'dq'].includes(this.status);
  }
}

/**
 * ТЕСТЫ для Performance.entity.ts
 *
 * Тест 1: Создание выступления
 * - Создать Competition и Athlete
 * - Создать Performance с связями
 * - Сохранить в БД
 * - Проверить автогенерацию UUID и значение по умолчанию status='scheduled'
 *
 * Тест 2: Метод calculateFinalScore
 * - Создать Performance с dScore=5.5, eScore=8.2, aScore=7.8
 * - Установить neutralDeductions=0.3, penalties=0.1
 * - Вызвать calculateFinalScore()
 * - Ожидать 5.5 + 8.2 + 7.8 - 0.3 - 0.1 = 21.1
 *
 * Тест 3: Метод hasAllScores
 * - Создать Performance с dScore=5.5, eScore=8.2, aScore=null
 * - Вызвать hasAllScores()
 * - Ожидать false
 * - Установить aScore=7.8
 * - Ожидать true
 *
 * Тест 4: Метод getDuration
 * - Создать Performance с startTime и endTime (разница 90 секунд)
 * - Вызвать getDuration()
 * - Ожидать 90
 *
 * Тест 5: Метод isValid
 * - Создать Performance со status='completed'
 * - Вызвать isValid()
 * - Ожидать true
 * - Установить status='dq'
 * - Ожидать false
 *
 * Тест 6: Связи с Competition и Athlete
 * - Создать Competition, Athlete и Performance
 * - Загрузить Performance с relations ['competition', 'participant']
 * - Проверить, что связи правильно загружены
 *
 * Тест 7: Индексация для поиска
 * - Создать 1000 выступлений
 * - Выполнить запрос поиска по competitionId и eventId
 * - Проверить, что запрос выполняется быстро (использует составной индекс)
 */
