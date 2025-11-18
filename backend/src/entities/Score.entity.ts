/**
 * Файл: entities/Score.entity.ts
 * Описание: TypeORM Entity для оценки судьи
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: typeorm, types/score.types.ts
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
import { BrigadeType, ScoreStatus } from '../types/common.types';

// Импорт связанных entities
import { Performance } from './Performance.entity';
import { User } from './User.entity';

/**
 * Entity для оценки судьи
 * Представляет таблицу scores в базе данных
 */
@Entity('scores') // Имя таблицы
@Index(['performanceId', 'judgeId'], { unique: true }) // Уникальный индекс: один судья - одна оценка на выступление
@Index(['brigadeType']) // Индекс для фильтрации по типу бригады
@Index(['status']) // Индекс для фильтрации по статусу
export class Score {
  /**
   * Первичный ключ - UUID
   * Автоматически генерируется БД
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * ID выступления
   * Внешний ключ на таблицу performances
   */
  @Column({ type: 'uuid' })
  performanceId: string;

  /**
   * Связь с выступлением
   * Many-to-One: много оценок для одного выступления
   */
  @ManyToOne(() => Performance, { nullable: false })
  @JoinColumn({ name: 'performanceId' })
  performance: Performance;

  /**
   * ID судьи
   * Внешний ключ на таблицу users
   */
  @Column({ type: 'uuid' })
  judgeId: string;

  /**
   * Связь с судьей (User с ролью JUDGE_*)
   * Many-to-One: много оценок от одного судьи
   */
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'judgeId' })
  judge: User;

  /**
   * Тип бригады судьи
   * Enum: D, E, A, T, L
   * Определяет, какую оценку выставляет судья
   */
  @Column({
    type: 'enum',
    enum: BrigadeType
  })
  brigadeType: BrigadeType;

  /**
   * Позиция судьи в бригаде
   * Например: D1, D2, E1, E2 и т.д.
   * Используется для расчета консенсуса
   */
  @Column({ type: 'varchar', length: 10 })
  judgePosition: string;

  /**
   * Итоговая оценка судьи
   * Для D-судей: DB + DA
   * Для E-судей: 10.0 - сбавки
   * Для A-судей: 10.0 - сбавки
   */
  @Column({ type: 'decimal', precision: 5, scale: 3 })
  totalScore: number;

  /**
   * Статус оценки
   * Enum: draft, submitted, approved, consensus_required, rejected
   * По умолчанию draft
   */
  @Column({
    type: 'enum',
    enum: ScoreStatus,
    default: ScoreStatus.DRAFT
  })
  status: ScoreStatus;

  /**
   * Время начала оценивания
   * Опциональное поле (когда судья начал оценивать)
   */
  @Column({ type: 'timestamp', nullable: true })
  startTime?: Date;

  /**
   * Время завершения оценивания (отправки)
   * Опциональное поле (когда судья отправил оценку)
   */
  @Column({ type: 'timestamp', nullable: true })
  submitTime?: Date;

  /**
   * Продолжительность оценивания (в секундах)
   * Рассчитывается автоматически из startTime и submitTime
   */
  @Column({ type: 'int', nullable: true })
  judgingDuration?: number;

  /**
   * Комментарий судьи
   * Опциональное поле для заметок
   */
  @Column({ type: 'text', nullable: true })
  comment?: string;

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
   * Метод для расчета продолжительности оценивания
   * @returns Продолжительность в секундах или null
   */
  calculateJudgingDuration(): number | null {
    // Если нет времени начала или окончания, возвращаем null
    if (!this.startTime || !this.submitTime) {
      return null;
    }
    // Вычисляем разницу в миллисекундах
    const diffMs = this.submitTime.getTime() - this.startTime.getTime();
    // Конвертируем в секунды
    return Math.floor(diffMs / 1000);
  }

  /**
   * Метод для проверки, отправлена ли оценка
   * @returns true если статус submitted, approved или consensus_required
   */
  isSubmitted(): boolean {
    // Проверяем статус
    return [ScoreStatus.SUBMITTED, ScoreStatus.APPROVED, ScoreStatus.CONSENSUS_REQUIRED].includes(
      this.status
    );
  }

  /**
   * Метод для проверки, утверждена ли оценка
   * @returns true если статус approved
   */
  isApproved(): boolean {
    // Проверяем статус
    return this.status === ScoreStatus.APPROVED;
  }

  /**
   * Метод для проверки, требуется ли консенсус
   * @returns true если статус consensus_required
   */
  needsConsensus(): boolean {
    // Проверяем статус
    return this.status === ScoreStatus.CONSENSUS_REQUIRED;
  }

  /**
   * Метод для проверки, отклонена ли оценка
   * @returns true если статус rejected
   */
  isRejected(): boolean {
    // Проверяем статус
    return this.status === ScoreStatus.REJECTED;
  }

  /**
   * Метод для проверки, можно ли редактировать оценку
   * @returns true если статус draft или rejected
   */
  canBeEdited(): boolean {
    // Редактировать можно только черновики и отклоненные оценки
    return [ScoreStatus.DRAFT, ScoreStatus.REJECTED].includes(this.status);
  }

  /**
   * Метод для получения номера судьи в бригаде
   * @returns Номер судьи (1, 2, 3, 4)
   */
  getJudgeNumber(): number {
    // Извлекаем номер из позиции (D1 -> 1, E2 -> 2 и т.д.)
    const match = this.judgePosition.match(/\d+/);
    // Если нашли число, возвращаем его
    if (match) {
      return parseInt(match[0], 10);
    }
    // Иначе возвращаем 0
    return 0;
  }
}

/**
 * ТЕСТЫ для Score.entity.ts
 *
 * Тест 1: Создание оценки
 * - Создать Performance и User (судью)
 * - Создать Score с brigadeType=D, judgePosition='D1'
 * - Сохранить в БД
 * - Проверить автогенерацию UUID и значение по умолчанию status='draft'
 *
 * Тест 2: Уникальность пары performanceId + judgeId
 * - Создать Score для performance1 и judge1
 * - Попытаться создать второй Score для того же performance1 и judge1
 * - Ожидать ошибку уникальности
 *
 * Тест 3: Метод calculateJudgingDuration
 * - Создать Score с startTime и submitTime (разница 120 секунд)
 * - Вызвать calculateJudgingDuration()
 * - Ожидать 120
 * - Установить judgingDuration = calculateJudgingDuration()
 * - Проверить, что judgingDuration === 120
 *
 * Тест 4: Метод isSubmitted
 * - Создать Score со status='draft'
 * - Вызвать isSubmitted()
 * - Ожидать false
 * - Установить status='submitted'
 * - Ожидать true
 *
 * Тест 5: Метод canBeEdited
 * - Создать Score со status='draft'
 * - Вызвать canBeEdited()
 * - Ожидать true
 * - Установить status='approved'
 * - Ожидать false
 * - Установить status='rejected'
 * - Ожидать true
 *
 * Тест 6: Метод getJudgeNumber
 * - Создать Score с judgePosition='D1'
 * - Вызвать getJudgeNumber()
 * - Ожидать 1
 * - Установить judgePosition='E3'
 * - Ожидать 3
 *
 * Тест 7: Связи с Performance и Judge
 * - Создать Performance, User (judge) и Score
 * - Загрузить Score с relations ['performance', 'judge']
 * - Проверить, что связи правильно загружены
 *
 * Тест 8: Индексация для поиска
 * - Создать 1000 оценок
 * - Выполнить запрос поиска по performanceId и brigadeType='D'
 * - Проверить, что запрос выполняется быстро (использует индексы)
 */
