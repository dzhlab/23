/**
 * Файл: entities/index.ts
 * Описание: Центральная точка экспорта всех TypeORM entities
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: все entities проекта
 */

// Экспорт User entity
export { User } from './User.entity';

// Экспорт Competition entity
export { Competition } from './Competition.entity';

// Экспорт Athlete entity
export { Athlete } from './Athlete.entity';

// Экспорт Performance entity
export { Performance } from './Performance.entity';

// Экспорт Score entity
export { Score } from './Score.entity';

/**
 * Массив всех entities для использования в TypeORM config
 * Используется в ormconfig.ts или app.module.ts
 */
export const entities = [
  User, // Пользователи системы
  Competition, // Соревнования
  Athlete, // Спортсмены
  Performance, // Выступления
  Score // Оценки судей
];

/**
 * Пример использования в TypeORM config:
 *
 * import { entities } from './entities';
 *
 * const dataSource = new DataSource({
 *   type: 'postgres',
 *   host: 'localhost',
 *   port: 5432,
 *   username: 'postgres',
 *   password: 'password',
 *   database: 'gymnastics_db',
 *   entities: entities,
 *   synchronize: false, // В production всегда false!
 *   logging: true
 * });
 */
