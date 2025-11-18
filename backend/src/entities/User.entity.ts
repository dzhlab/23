/**
 * Файл: entities/User.entity.ts
 * Описание: TypeORM Entity для пользователя системы
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: typeorm, types/user.types.ts
 */

// Импорт декораторов и типов из TypeORM
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany
} from 'typeorm';

// Импорт типов из types
import { UserRole } from '../types/common.types';
import { NotificationSettings } from '../types/user.types';

/**
 * Entity для пользователя
 * Представляет таблицу users в базе данных
 */
@Entity('users') // Имя таблицы в БД
@Index(['email'], { unique: true }) // Уникальный индекс по email
@Index(['username'], { unique: true }) // Уникальный индекс по username
export class User {
  /**
   * Первичный ключ - UUID
   * Автоматически генерируется БД
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Email пользователя
   * Обязательное поле, уникальное
   * Используется для входа в систему
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  /**
   * Хешированный пароль
   * Обязательное поле
   * Хешируется с помощью bcrypt перед сохранением
   */
  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  /**
   * Имя пользователя (username)
   * Обязательное поле, уникальное
   * Может использоваться для входа вместо email
   */
  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

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
   * Роль пользователя в системе
   * Enum из UserRole
   * По умолчанию 'spectator'
   */
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SPECTATOR
  })
  role: UserRole;

  /**
   * Номер телефона
   * Опциональное поле
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  /**
   * URL аватара пользователя
   * Опциональное поле
   */
  @Column({ type: 'text', nullable: true })
  avatar?: string;

  /**
   * Язык интерфейса
   * По умолчанию 'ru'
   */
  @Column({ type: 'varchar', length: 10, default: 'ru' })
  language: string;

  /**
   * Часовой пояс пользователя
   * По умолчанию 'Europe/Moscow'
   */
  @Column({ type: 'varchar', length: 50, default: 'Europe/Moscow' })
  timezone: string;

  /**
   * Email подтвержден
   * По умолчанию false
   */
  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  /**
   * Токен для подтверждения email
   * Опциональное поле
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  emailVerificationToken?: string;

  /**
   * Срок действия токена подтверждения email
   * Опциональное поле
   */
  @Column({ type: 'timestamp', nullable: true })
  emailVerificationExpires?: Date;

  /**
   * Телефон подтвержден
   * По умолчанию false
   */
  @Column({ type: 'boolean', default: false })
  phoneVerified: boolean;

  /**
   * Аккаунт активен
   * По умолчанию true
   */
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  /**
   * Аккаунт заблокирован
   * По умолчанию false
   */
  @Column({ type: 'boolean', default: false })
  isBlocked: boolean;

  /**
   * Причина блокировки
   * Опциональное поле
   */
  @Column({ type: 'text', nullable: true })
  blockReason?: string;

  /**
   * Дата последнего входа
   * Опциональное поле
   */
  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  /**
   * IP адрес последнего входа
   * Опциональное поле
   */
  @Column({ type: 'varchar', length: 45, nullable: true })
  lastLoginIp?: string;

  /**
   * Количество неудачных попыток входа
   * По умолчанию 0
   * Сбрасывается при успешном входе
   */
  @Column({ type: 'int', default: 0 })
  failedLoginAttempts: number;

  /**
   * Дата блокировки за неудачные попытки
   * Опциональное поле
   * Аккаунт блокируется на определенное время после N неудачных попыток
   */
  @Column({ type: 'timestamp', nullable: true })
  accountLockedUntil?: Date;

  /**
   * Настройки уведомлений
   * Хранится как JSON
   */
  @Column({
    type: 'jsonb',
    nullable: true,
    default: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      newCompetitions: true,
      scheduleChanges: true,
      results: true,
      performanceStart: true,
      systemNotifications: true
    }
  })
  notificationSettings?: NotificationSettings;

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
   * @returns Полное имя пользователя
   */
  getFullName(): string {
    // Формируем полное имя из фамилии, имени и отчества
    const parts = [this.lastName, this.firstName, this.middleName];
    // Фильтруем пустые значения и объединяем через пробел
    return parts.filter((part) => part).join(' ');
  }

  /**
   * Метод для проверки, активен ли аккаунт
   * @returns true если аккаунт активен и не заблокирован
   */
  isAccountActive(): boolean {
    // Проверяем, что аккаунт активен и не заблокирован
    return this.isActive && !this.isBlocked;
  }

  /**
   * Метод для проверки, заблокирован ли аккаунт временно
   * @returns true если аккаунт временно заблокирован
   */
  isAccountLocked(): boolean {
    // Если нет даты блокировки, аккаунт не заблокирован
    if (!this.accountLockedUntil) {
      return false;
    }
    // Проверяем, что текущее время меньше времени окончания блокировки
    return new Date() < this.accountLockedUntil;
  }

  /**
   * Метод для проверки прав доступа
   * @param requiredRole - необходимая роль
   * @returns true если у пользователя есть необходимая роль
   */
  hasRole(requiredRole: UserRole): boolean {
    // Проверяем, совпадает ли роль пользователя с требуемой
    return this.role === requiredRole;
  }

  /**
   * Метод для проверки, является ли пользователь администратором
   * @returns true если пользователь - администратор
   */
  isAdmin(): boolean {
    // Проверяем, что роль пользователя - admin
    return this.role === UserRole.ADMIN;
  }
}

/**
 * ТЕСТЫ для User.entity.ts
 *
 * Тест 1: Создание пользователя
 * - Создать экземпляр User
 * - Сохранить в БД
 * - Проверить автогенерацию UUID в поле id
 * - Проверить автоустановку createdAt и updatedAt
 *
 * Тест 2: Уникальность email
 * - Создать пользователя с email "test@example.com"
 * - Попытаться создать второго пользователя с тем же email
 * - Ожидать ошибку уникальности
 *
 * Тест 3: Уникальность username
 * - Создать пользователя с username "testuser"
 * - Попытаться создать второго пользователя с тем же username
 * - Ожидать ошибку уникальности
 *
 * Тест 4: Метод getFullName
 * - Создать пользователя с lastName="Иванов", firstName="Иван", middleName="Иванович"
 * - Вызвать getFullName()
 * - Ожидать "Иванов Иван Иванович"
 *
 * Тест 5: Метод isAccountActive
 * - Создать пользователя с isActive=true, isBlocked=false
 * - Вызвать isAccountActive()
 * - Ожидать true
 * - Установить isBlocked=true
 * - Ожидать false
 *
 * Тест 6: Метод isAccountLocked
 * - Установить accountLockedUntil на будущую дату
 * - Вызвать isAccountLocked()
 * - Ожидать true
 * - Установить accountLockedUntil на прошлую дату
 * - Ожидать false
 *
 * Тест 7: Значения по умолчанию
 * - Создать пользователя без указания role
 * - Проверить, что role === UserRole.SPECTATOR
 * - Проверить, что language === 'ru'
 * - Проверить, что timezone === 'Europe/Moscow'
 */
