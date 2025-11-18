/**
 * Файл: routes/index.ts
 * Описание: Центральный файл для экспорта всех маршрутов API
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: express, user.routes, competition.routes
 */

// Импорт Router из Express
// Import Router from Express
import { Router } from 'express';

// Импорт маршрутов пользователей
// Import user routes
import userRoutes from './user.routes';

// Импорт маршрутов соревнований
// Import competition routes
import competitionRoutes from './competition.routes';

// Создаем главный роутер API
// Create main API router
const router = Router();

/**
 * Монтируем маршруты пользователей
 * Mount user routes
 * Префикс: /api/users
 */
router.use('/users', userRoutes);

/**
 * Монтируем маршруты соревнований
 * Mount competition routes
 * Префикс: /api/competitions
 */
router.use('/competitions', competitionRoutes);

/**
 * Здоровьесберегающий endpoint для мониторинга
 * Health check endpoint for monitoring
 * GET /api/health
 */
router.get('/health', (req, res) => {
  // Отправляем успешный ответ с информацией о статусе API
  // Send success response with API status information
  res.status(200).json({
    success: true,
    message: 'API работает нормально',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * Экспортируем главный роутер
 * Export main router
 */
export default router;

/**
 * СТРУКТУРА API (API STRUCTURE)
 *
 * /api
 * ├── /health                          - Health check endpoint
 * ├── /users                           - Маршруты пользователей
 * │   ├── POST   /register             - Регистрация
 * │   ├── POST   /login                - Вход
 * │   ├── POST   /refresh-token        - Обновление токена
 * │   ├── GET    /me                   - Текущий пользователь (auth)
 * │   ├── PUT    /me                   - Обновление профиля (auth)
 * │   ├── PUT    /me/password          - Смена пароля (auth)
 * │   ├── GET    /:id                  - Пользователь по ID (auth)
 * │   ├── GET    /                     - Список пользователей (admin)
 * │   ├── POST   /:id/block            - Блокировка (admin)
 * │   └── POST   /:id/unblock          - Разблокировка (admin)
 * └── /competitions                    - Маршруты соревнований
 *     ├── GET    /                     - Список соревнований (public)
 *     ├── GET    /:id                  - Соревнование по ID (public)
 *     ├── GET    /:id/statistics       - Статистика (auth)
 *     ├── POST   /                     - Создание (organizer)
 *     ├── PUT    /:id                  - Обновление (organizer)
 *     ├── POST   /:id/publish          - Публикация (organizer)
 *     ├── POST   /:id/cancel           - Отмена (organizer)
 *     └── DELETE /:id                  - Удаление (organizer)
 *
 * БУДУЩИЕ МАРШРУТЫ (FUTURE ROUTES):
 * - /api/athletes                      - Управление спортсменами
 * - /api/performances                  - Управление выступлениями
 * - /api/scores                        - Управление оценками судей
 * - /api/judges                        - Назначение судей
 * - /api/reports                       - Генерация отчетов
 * - /api/ws                            - WebSocket для real-time обновлений
 */
