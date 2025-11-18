/**
 * Файл: types/index.ts
 * Описание: Центральная точка экспорта всех типов и интерфейсов
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: все типы проекта
 */

// Экспорт всех типов из common.types.ts
export * from './common.types';

// Экспорт всех типов из competition.types.ts
export * from './competition.types';

// Экспорт всех типов из athlete.types.ts
export * from './athlete.types';

// Экспорт всех типов из judge.types.ts
export * from './judge.types';

// Экспорт всех типов из score.types.ts
export * from './score.types';

// Экспорт всех типов из user.types.ts
export * from './user.types';

/**
 * Пример использования:
 *
 * import { Competition, CreateCompetitionDto, UserRole, BrigadeType } from '@/types';
 *
 * const competition: Competition = {
 *   id: '123',
 *   name: 'Чемпионат России 2025',
 *   type: CompetitionType.INDIVIDUAL,
 *   status: CompetitionStatus.DRAFT,
 *   // ... остальные поля
 * };
 */
