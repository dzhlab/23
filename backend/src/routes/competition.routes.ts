/**
 * Файл: routes/competition.routes.ts
 * Описание: Маршруты (routes) для API соревнований
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: express, controllers/competition.controller, middleware/auth, middleware/authorize
 */

// Импорт Router из Express для создания маршрутов
// Import Router from Express for creating routes
import { Router } from 'express';

// Импорт контроллера соревнований
// Import competition controller
import { competitionController } from '../controllers/competition.controller';

// Импорт middleware для аутентификации
// Import authentication middleware
import { authenticate } from '../middleware/auth.middleware';

// Импорт middleware для авторизации
// Import authorization middleware
import { requireOrganizer } from '../middleware/authorize.middleware';

// Создаем экземпляр роутера
// Create router instance
const router = Router();

/**
 * Публичные маршруты (доступны без аутентификации для просмотра)
 * Public routes (available without authentication for viewing)
 */

// GET /api/competitions - Получение списка соревнований с фильтрацией
// GET /api/competitions - Get list of competitions with filtering
router.get(
  '/',
  // Вызываем метод контроллера для получения списка соревнований
  // Call controller method to get competitions list
  competitionController.getCompetitions.bind(competitionController)
);

// GET /api/competitions/:id - Получение соревнования по ID
// GET /api/competitions/:id - Get competition by ID
router.get(
  '/:id',
  // Вызываем метод контроллера для получения соревнования
  // Call controller method to get competition
  competitionController.getCompetitionById.bind(competitionController)
);

/**
 * Защищенные маршруты (требуют аутентификации)
 * Protected routes (authentication required)
 */

// GET /api/competitions/:id/statistics - Получение статистики соревнования
// GET /api/competitions/:id/statistics - Get competition statistics
router.get(
  '/:id/statistics',
  // Применяем middleware аутентификации
  // Apply authentication middleware
  authenticate,
  // Вызываем метод контроллера для получения статистики
  // Call controller method to get statistics
  competitionController.getCompetitionStatistics.bind(competitionController)
);

/**
 * Маршруты для организаторов (требуют роль ADMIN или ORGANIZER)
 * Organizer routes (require ADMIN or ORGANIZER role)
 */

// POST /api/competitions - Создание нового соревнования
// POST /api/competitions - Create new competition
router.post(
  '/',
  // Применяем middleware аутентификации
  // Apply authentication middleware
  authenticate,
  // Применяем middleware авторизации (организаторы и администраторы)
  // Apply authorization middleware (organizers and admins)
  requireOrganizer,
  // Вызываем метод контроллера для создания соревнования
  // Call controller method to create competition
  competitionController.createCompetition.bind(competitionController)
);

// PUT /api/competitions/:id - Обновление соревнования
// PUT /api/competitions/:id - Update competition
router.put(
  '/:id',
  // Применяем middleware аутентификации
  // Apply authentication middleware
  authenticate,
  // Применяем middleware авторизации (организаторы и администраторы)
  // Apply authorization middleware (organizers and admins)
  requireOrganizer,
  // Вызываем метод контроллера для обновления соревнования
  // Call controller method to update competition
  competitionController.updateCompetition.bind(competitionController)
);

// POST /api/competitions/:id/publish - Публикация соревнования
// POST /api/competitions/:id/publish - Publish competition
router.post(
  '/:id/publish',
  // Применяем middleware аутентификации
  // Apply authentication middleware
  authenticate,
  // Применяем middleware авторизации (организаторы и администраторы)
  // Apply authorization middleware (organizers and admins)
  requireOrganizer,
  // Вызываем метод контроллера для публикации соревнования
  // Call controller method to publish competition
  competitionController.publishCompetition.bind(competitionController)
);

// POST /api/competitions/:id/cancel - Отмена соревнования
// POST /api/competitions/:id/cancel - Cancel competition
router.post(
  '/:id/cancel',
  // Применяем middleware аутентификации
  // Apply authentication middleware
  authenticate,
  // Применяем middleware авторизации (организаторы и администраторы)
  // Apply authorization middleware (organizers and admins)
  requireOrganizer,
  // Вызываем метод контроллера для отмены соревнования
  // Call controller method to cancel competition
  competitionController.cancelCompetition.bind(competitionController)
);

// DELETE /api/competitions/:id - Удаление соревнования (только черновики)
// DELETE /api/competitions/:id - Delete competition (drafts only)
router.delete(
  '/:id',
  // Применяем middleware аутентификации
  // Apply authentication middleware
  authenticate,
  // Применяем middleware авторизации (организаторы и администраторы)
  // Apply authorization middleware (organizers and admins)
  requireOrganizer,
  // Вызываем метод контроллера для удаления соревнования
  // Call controller method to delete competition
  competitionController.deleteCompetition.bind(competitionController)
);

/**
 * Экспортируем роутер
 * Export router
 */
export default router;

/**
 * СПИСОК МАРШРУТОВ (ROUTES LIST)
 *
 * Публичные маршруты / Public routes (без аутентификации):
 * - GET    /api/competitions           - Получение списка соревнований с фильтрацией
 *                                        Query параметры: status, type, organizerId,
 *                                        startDateFrom, startDateTo, location, registrationOpen
 * - GET    /api/competitions/:id       - Получение соревнования по ID
 *                                        Query параметры: includeRelations=true
 *
 * Защищенные маршруты / Protected routes (требуют аутентификации):
 * - GET    /api/competitions/:id/statistics - Получение статистики соревнования
 *
 * Маршруты организаторов / Organizer routes (требуют роль ADMIN или ORGANIZER):
 * - POST   /api/competitions           - Создание нового соревнования
 * - PUT    /api/competitions/:id       - Обновление соревнования
 * - POST   /api/competitions/:id/publish  - Публикация соревнования (DRAFT → PUBLISHED)
 * - POST   /api/competitions/:id/cancel   - Отмена соревнования
 * - DELETE /api/competitions/:id       - Удаление соревнования (только DRAFT)
 *
 * ПРИМЕЧАНИЯ / NOTES:
 * 1. Все маршруты монтируются в главном приложении с префиксом /api/competitions
 * 2. Middleware authenticate проверяет наличие и валидность JWT токена
 * 3. Middleware requireOrganizer проверяет роль (ADMIN или ORGANIZER)
 * 4. Публичные маршруты GET позволяют зрителям просматривать соревнования
 * 5. .bind(competitionController) сохраняет контекст this в методах класса
 * 6. Статистика доступна только аутентифицированным пользователям
 * 7. Создание, редактирование и управление - только для организаторов
 *
 * ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ / USAGE EXAMPLES:
 *
 * Получить все опубликованные соревнования:
 * GET /api/competitions?status=published
 *
 * Получить индивидуальные соревнования:
 * GET /api/competitions?type=individual
 *
 * Получить соревнования организатора:
 * GET /api/competitions?organizerId=uuid-here
 *
 * Получить соревнования с открытой регистрацией:
 * GET /api/competitions?registrationOpen=true
 *
 * Получить соревнования в диапазоне дат:
 * GET /api/competitions?startDateFrom=2025-12-01&startDateTo=2025-12-31
 *
 * Получить соревнование с организатором и главным судьей:
 * GET /api/competitions/:id?includeRelations=true
 */
