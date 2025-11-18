/**
 * Файл: services/index.ts
 * Описание: Центральный экспорт всех сервисов
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: api.service, user.service, competition.service
 */

// Экспорт API сервиса
// Export API service
export { apiService } from './api.service';

// Экспорт сервиса пользователей
// Export user service
export { userService } from './user.service';

// Экспорт сервиса соревнований
// Export competition service
export { competitionService } from './competition.service';
