/**
 * Файл: entities/Athlete.entity.ts
 * Описание: TypeORM Entity для спортсмена
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
  Index,
  ManyToOne,
  JoinColumn
} from 'typeorm';

// Импорт связанных entities
import { User } from './User.entity';

/**
 * Entity для спортсмена
 * Представляет таблицу athletes в базе данных
 */
@Entity('athletes') // Имя таблицы
@Index(['lastName', 'firstName']) // Индекс для поиска по имени
@Index(['clubName']) // Индекс для поиска по клубу
@Index(['dateOfBirth']) // Индекс для фильтрации по возрасту
export class Athlete {
  /**
   * Первичный ключ - UUID
   * Автоматически генерируется БД
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Фамилия
   * Обязательное поле
   */
  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  /**
   * Имя
   * Обязательное поле
   */
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  /**
   * Отчество
   * Опциональное поле
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  middleName?: string;

  /**
   * Дата рождения
   * Обязательное поле
   * Используется для определения возрастной категории
   */
  @Column({ type: 'date' })
  dateOfBirth: Date;

  /**
   * Пол
   * M - мужской, F - женский
   * Обязательное поле
   */
  @Column({ type: 'char', length: 1 })
  gender: 'M' | 'F';

  /**
   * Страна (ISO код)
   * Например: RUS, USA, GER
   * Обязательное поле
   */
  @Column({ type: 'varchar', length: 3 })
  country: string;

  /**
   * Регион/область
   * Опциональное поле
   */
  @Column({ type: 'varchar', length: 200, nullable: true })
  region?: string;

  /**
   * Город
   * Опциональное поле
   */
  @Column({ type: 'varchar', length: 200, nullable: true })
  city?: string;

  /**
   * ID клуба/школы
   * Внешний ключ (пока просто UUID, можно создать отдельную таблицу clubs)
   * Опциональное поле
   */
  @Column({ type: 'uuid', nullable: true })
  clubId?: string;

  /**
   * Название клуба/школы
   * Обязательное поле
   */
  @Column({ type: 'varchar', length: 255 })
  clubName: string;

  /**
   * ID тренера
   * Внешний ключ на таблицу users (user с ролью COACH)
   * Опциональное поле
   */
  @Column({ type: 'uuid', nullable: true })
  coachId?: string;

  /**
   * Связь с тренером (User с ролью COACH)
   * Many-to-One: много спортсменов у одного тренера
   */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'coachId' })
  coach?: User;

  /**
   * ФИО тренера
   * Обязательное поле
   */
  @Column({ type: 'varchar', length: 255 })
  coachName: string;

  /**
   * Разряд/квалификация
   * Например: МС, КМС, I разряд, II разряд и т.д.
   * Опциональное поле
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  qualification?: string;

  /**
   * Номер лицензии FIG
   * Для международных соревнований
   * Опциональное поле
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  figLicense?: string;

  /**
   * Email для связи
   * Опциональное поле
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  /**
   * Телефон для связи
   * Опциональное поле
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  /**
   * URL фото спортсмена
   * Опциональное поле
   */
  @Column({ type: 'text', nullable: true })
  photo?: string;

  /**
   * Медицинский допуск действителен до
   * Опциональное поле
   */
  @Column({ type: 'date', nullable: true })
  medicalClearanceUntil?: Date;

  /**
   * Страховка действительна до
   * Опциональное поле
   */
  @Column({ type: 'date', nullable: true })
  insuranceValidUntil?: Date;

  /**
   * Биография/достижения
   * Опциональное поле, может быть длинным текстом
   */
  @Column({ type: 'text', nullable: true })
  biography?: string;

  /**
   * Статус спортсмена
   * active - активен, retired - завершил карьеру, suspended - дисквалификация
   * По умолчанию active
   */
  @Column({
    type: 'enum',
    enum: ['active', 'retired', 'suspended'],
    default: 'active'
  })
  status: 'active' | 'retired' | 'suspended';

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
   * Метод для получения полного имени
   * @returns Полное имя спортсмена
   */
  getFullName(): string {
    // Формируем полное имя из фамилии, имени и отчества
    const parts = [this.lastName, this.firstName, this.middleName];
    // Фильтруем пустые значения и объединяем через пробел
    return parts.filter((part) => part).join(' ');
  }

  /**
   * Метод для расчета возраста
   * @param atDate - дата, на которую рассчитывать возраст (по умолчанию текущая)
   * @returns Возраст в годах
   */
  getAge(atDate: Date = new Date()): number {
    // Год рождения
    const birthYear = this.dateOfBirth.getFullYear();
    // Текущий год или указанный
    const currentYear = atDate.getFullYear();
    // Вычисляем разницу лет
    let age = currentYear - birthYear;
    // Проверяем, был ли уже день рождения в этом году
    const birthMonth = this.dateOfBirth.getMonth();
    const birthDay = this.dateOfBirth.getDate();
    const currentMonth = atDate.getMonth();
    const currentDay = atDate.getDate();
    // Если месяц меньше или месяц равен но день меньше, вычитаем год
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
      age--;
    }
    // Возвращаем возраст
    return age;
  }

  /**
   * Метод для получения года рождения
   * @returns Год рождения
   */
  getBirthYear(): number {
    // Возвращаем год из даты рождения
    return this.dateOfBirth.getFullYear();
  }

  /**
   * Метод для проверки, активен ли спортсмен
   * @returns true если статус active
   */
  isActive(): boolean {
    // Проверяем статус
    return this.status === 'active';
  }

  /**
   * Метод для проверки валидности медицинского допуска
   * @returns true если медицинский допуск действителен
   */
  hasMedicalClearance(): boolean {
    // Если нет даты окончания допуска, считаем что нет допуска
    if (!this.medicalClearanceUntil) {
      return false;
    }
    // Проверяем, что текущая дата меньше даты окончания
    return new Date() < this.medicalClearanceUntil;
  }

  /**
   * Метод для проверки валидности страховки
   * @returns true если страховка действительна
   */
  hasInsurance(): boolean {
    // Если нет даты окончания страховки, считаем что нет страховки
    if (!this.insuranceValidUntil) {
      return false;
    }
    // Проверяем, что текущая дата меньше даты окончания
    return new Date() < this.insuranceValidUntil;
  }

  /**
   * Метод для проверки, может ли спортсмен участвовать
   * @returns true если спортсмен активен, есть допуск и страховка
   */
  canParticipate(): boolean {
    // Проверяем все условия
    return this.isActive() && this.hasMedicalClearance() && this.hasInsurance();
  }
}

/**
 * ТЕСТЫ для Athlete.entity.ts
 *
 * Тест 1: Создание спортсмена
 * - Создать экземпляр Athlete с обязательными полями
 * - Сохранить в БД
 * - Проверить автогенерацию UUID
 * - Проверить значение по умолчанию status='active'
 *
 * Тест 2: Метод getFullName
 * - Создать спортсмена с lastName="Иванова", firstName="Мария", middleName="Петровна"
 * - Вызвать getFullName()
 * - Ожидать "Иванова Мария Петровна"
 *
 * Тест 3: Метод getAge
 * - Создать спортсмена с dateOfBirth="2010-05-15"
 * - Вызвать getAge(new Date('2025-11-18'))
 * - Ожидать 15 лет
 *
 * Тест 4: Метод getBirthYear
 * - Создать спортсмена с dateOfBirth="2010-05-15"
 * - Вызвать getBirthYear()
 * - Ожидать 2010
 *
 * Тест 5: Метод hasMedicalClearance
 * - Создать спортсмена с medicalClearanceUntil на завтра
 * - Вызвать hasMedicalClearance()
 * - Ожидать true
 * - Установить medicalClearanceUntil на вчера
 * - Ожидать false
 *
 * Тест 6: Метод canParticipate
 * - Создать спортсмена со status='active'
 * - Установить medicalClearanceUntil и insuranceValidUntil на будущие даты
 * - Вызвать canParticipate()
 * - Ожидать true
 * - Установить status='suspended'
 * - Ожидать false
 *
 * Тест 7: Связь с тренером
 * - Создать User с ролью COACH
 * - Создать Athlete с coachId
 * - Загрузить Athlete с relation coach
 * - Проверить, что coach.id === coachId
 *
 * Тест 8: Индексация для поиска
 * - Создать 1000 спортсменов с разными фамилиями
 * - Выполнить запрос поиска по lastName="Иванова"
 * - Проверить, что запрос выполняется быстро (использует индекс)
 */
