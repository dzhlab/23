/**
 * Файл: entities/Competition.entity.ts
 * Описание: TypeORM Entity для соревнования
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: typeorm, types/competition.types.ts
 */

// Импорт декораторов TypeORM
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index
} from 'typeorm';

// Импорт типов
import {
  CompetitionType,
  CompetitionStatus,
  DScoreCalculationMethod,
  RankingMethod,
  JudgeInterfaceType
} from '../types/common.types';

// Импорт связанных entities
import { User } from './User.entity';

/**
 * Entity для соревнования
 * Представляет таблицу competitions в базе данных
 */
@Entity('competitions') // Имя таблицы
@Index(['status']) // Индекс для быстрого поиска по статусу
@Index(['startDate']) // Индекс для сортировки по дате
export class Competition {
  /**
   * Первичный ключ - UUID
   * Автоматически генерируется БД
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Название соревнования
   * Обязательное поле
   */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /**
   * Полное официальное название
   * Опциональное поле
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  fullName?: string;

  /**
   * Описание соревнования
   * Опциональное поле, может быть длинным текстом
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Тип соревнования
   * Enum: individual, group, general_physical
   */
  @Column({
    type: 'enum',
    enum: CompetitionType
  })
  type: CompetitionType;

  /**
   * Статус соревнования
   * Enum: draft, published, in_progress, completed, cancelled
   * По умолчанию draft
   */
  @Column({
    type: 'enum',
    enum: CompetitionStatus,
    default: CompetitionStatus.DRAFT
  })
  status: CompetitionStatus;

  /**
   * Дата начала соревнования
   * Обязательное поле
   */
  @Column({ type: 'timestamp' })
  startDate: Date;

  /**
   * Дата окончания соревнования
   * Обязательное поле
   */
  @Column({ type: 'timestamp' })
  endDate: Date;

  /**
   * Место проведения (город)
   * Обязательное поле
   */
  @Column({ type: 'varchar', length: 200 })
  location: string;

  /**
   * Адрес места проведения (полный адрес)
   * Обязательное поле
   */
  @Column({ type: 'varchar', length: 500 })
  venue: string;

  /**
   * ID организатора
   * Внешний ключ на таблицу users
   */
  @Column({ type: 'uuid' })
  organizerId: string;

  /**
   * Связь с организатором (User)
   * Many-to-One: много соревнований у одного организатора
   */
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  /**
   * ID главного судьи
   * Внешний ключ на таблицу users
   * Опциональное поле
   */
  @Column({ type: 'uuid', nullable: true })
  chiefJudgeId?: string;

  /**
   * Связь с главным судьей (User)
   * Many-to-One
   */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'chiefJudgeId' })
  chiefJudge?: User;

  /**
   * ID главного секретаря
   * Внешний ключ на таблицу users
   * Опциональное поле
   */
  @Column({ type: 'uuid', nullable: true })
  chiefSecretaryId?: string;

  /**
   * Связь с главным секретарем (User)
   * Many-to-One
   */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'chiefSecretaryId' })
  chiefSecretary?: User;

  /**
   * Метод расчета D-оценки
   * Enum: russian, fig
   * По умолчанию fig
   */
  @Column({
    type: 'enum',
    enum: DScoreCalculationMethod,
    default: DScoreCalculationMethod.FIG
  })
  dScoreMethod: DScoreCalculationMethod;

  /**
   * Метод ранжирования при равенстве оценок
   * Enum: simple_division, division_with_skip, tiebreak_by_components
   * По умолчанию tiebreak_by_components
   */
  @Column({
    type: 'enum',
    enum: RankingMethod,
    default: RankingMethod.TIEBREAK_BY_COMPONENTS
  })
  rankingMethod: RankingMethod;

  /**
   * Тип интерфейса судьи по умолчанию
   * Enum: extended, balanced, simplified
   * По умолчанию balanced
   */
  @Column({
    type: 'enum',
    enum: JudgeInterfaceType,
    default: JudgeInterfaceType.BALANCED
  })
  defaultJudgeInterface: JudgeInterfaceType;

  /**
   * URL логотипа соревнования
   * Опциональное поле
   */
  @Column({ type: 'text', nullable: true })
  logo?: string;

  /**
   * Массив спонсоров
   * Хранится как JSON массив строк
   */
  @Column({ type: 'jsonb', nullable: true })
  sponsors?: string[];

  /**
   * URL регламента соревнования (PDF)
   * Опциональное поле
   */
  @Column({ type: 'text', nullable: true })
  regulations?: string;

  /**
   * Максимальное количество участников
   * Опциональное поле
   */
  @Column({ type: 'int', nullable: true })
  maxParticipants?: number;

  /**
   * Открыта ли регистрация
   * По умолчанию false
   */
  @Column({ type: 'boolean', default: false })
  registrationOpen: boolean;

  /**
   * Дата начала регистрации
   * Опциональное поле
   */
  @Column({ type: 'timestamp', nullable: true })
  registrationStartDate?: Date;

  /**
   * Дата окончания регистрации
   * Опциональное поле
   */
  @Column({ type: 'timestamp', nullable: true })
  registrationEndDate?: Date;

  /**
   * Стоимость участия (в рублях)
   * Опциональное поле
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  entryFee?: number;

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
   * Метод для проверки, идет ли соревнование сейчас
   * @returns true если соревнование в процессе
   */
  isInProgress(): boolean {
    // Проверяем статус
    return this.status === CompetitionStatus.IN_PROGRESS;
  }

  /**
   * Метод для проверки, открыта ли регистрация на данный момент
   * @returns true если регистрация открыта и в пределах дат
   */
  isRegistrationOpenNow(): boolean {
    // Если регистрация закрыта, возвращаем false
    if (!this.registrationOpen) {
      return false;
    }

    // Текущая дата
    const now = new Date();

    // Если есть дата начала, проверяем что уже началась
    if (this.registrationStartDate && now < this.registrationStartDate) {
      return false;
    }

    // Если есть дата окончания, проверяем что еще не закончилась
    if (this.registrationEndDate && now > this.registrationEndDate) {
      return false;
    }

    // Регистрация открыта
    return true;
  }

  /**
   * Метод для получения продолжительности соревнования в днях
   * @returns Количество дней
   */
  getDurationInDays(): number {
    // Вычисляем разницу в миллисекундах
    const diffMs = this.endDate.getTime() - this.startDate.getTime();
    // Конвертируем в дни (миллисекунды / (1000 * 60 * 60 * 24))
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    // Возвращаем количество дней
    return diffDays;
  }

  /**
   * Метод для проверки, можно ли редактировать соревнование
   * @returns true если соревнование в статусе draft
   */
  canBeEdited(): boolean {
    // Редактировать можно только черновики
    return this.status === CompetitionStatus.DRAFT;
  }

  /**
   * Метод для проверки, можно ли опубликовать соревнование
   * @returns true если соревнование можно опубликовать
   */
  canBePublished(): boolean {
    // Опубликовать можно только черновики
    // И только если заполнены основные поля
    return (
      this.status === CompetitionStatus.DRAFT &&
      !!this.name &&
      !!this.startDate &&
      !!this.endDate &&
      !!this.location &&
      !!this.venue
    );
  }
}

/**
 * ТЕСТЫ для Competition.entity.ts
 *
 * Тест 1: Создание соревнования
 * - Создать экземпляр Competition с обязательными полями
 * - Сохранить в БД
 * - Проверить автогенерацию UUID
 * - Проверить значения по умолчанию (status=draft, dScoreMethod=fig)
 *
 * Тест 2: Связь с организатором
 * - Создать User с ролью ORGANIZER
 * - Создать Competition с organizerId
 * - Загрузить Competition с relation organizer
 * - Проверить, что organizer.id === organizerId
 *
 * Тест 3: Метод getDurationInDays
 * - Создать Competition с startDate=01.01.2025, endDate=03.01.2025
 * - Вызвать getDurationInDays()
 * - Ожидать 2 дня
 *
 * Тест 4: Метод isRegistrationOpenNow
 * - Создать Competition с registrationOpen=true
 * - Установить registrationStartDate на вчера
 * - Установить registrationEndDate на завтра
 * - Вызвать isRegistrationOpenNow()
 * - Ожидать true
 *
 * Тест 5: Метод canBePublished
 * - Создать Competition в статусе DRAFT со всеми обязательными полями
 * - Вызвать canBePublished()
 * - Ожидать true
 * - Изменить status на PUBLISHED
 * - Ожидать false
 *
 * Тест 6: Индексация
 * - Создать 1000 соревнований с разными статусами
 * - Выполнить запрос поиска по status=IN_PROGRESS
 * - Проверить, что запрос выполняется быстро (использует индекс)
 */
