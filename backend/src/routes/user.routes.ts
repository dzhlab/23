/**
 * Файл: routes/user.routes.ts
 * Описание: Маршруты (routes) для API пользователей
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: express, controllers/user.controller, middleware/auth, middleware/authorize
 */

// Импорт Router из Express для создания маршрутов
// Import Router from Express for creating routes
import { Router } from 'express';

// Импорт контроллера пользователей
// Import user controller
import { userController } from '../controllers/user.controller';

// Импорт middleware для аутентификации
// Import authentication middleware
import { authenticate } from '../middleware/auth.middleware';

// Импорт middleware для авторизации
// Import authorization middleware
import { requireAdmin } from '../middleware/authorize.middleware';

// Создаем экземпляр роутера
// Create router instance
const router = Router();

/**
 * Публичные маршруты (не требуют аутентификации)
 * Public routes (no authentication required)
 */

// POST /api/users/register - Регистрация нового пользователя
// POST /api/users/register - Register new user
router.post(
  '/register',
  // Вызываем метод контроллера для регистрации
  // Call controller method for registration
  userController.register.bind(userController)
);

// POST /api/users/login - Вход пользователя в систему
// POST /api/users/login - User login
router.post(
  '/login',
  // Вызываем метод контроллера для входа
  // Call controller method for login
  userController.login.bind(userController)
);

// POST /api/users/refresh-token - Обновление access токена
// POST /api/users/refresh-token - Refresh access token
router.post(
  '/refresh-token',
  // Вызываем метод контроллера для обновления токена
  // Call controller method for token refresh
  userController.refreshToken.bind(userController)
);

/**
 * Защищенные маршруты (требуют аутентификации)
 * Protected routes (authentication required)
 */

// GET /api/users/me - Получение профиля текущего пользователя
// GET /api/users/me - Get current user profile
router.get(
  '/me',
  // Применяем middleware аутентификации
  // Apply authentication middleware
  authenticate,
  // Вызываем метод контроллера для получения профиля
  // Call controller method to get profile
  userController.getMyProfile.bind(userController)
);

// PUT /api/users/me - Обновление профиля текущего пользователя
// PUT /api/users/me - Update current user profile
router.put(
  '/me',
  // Применяем middleware аутентификации
  // Apply authentication middleware
  authenticate,
  // Вызываем метод контроллера для обновления профиля
  // Call controller method to update profile
  userController.updateMyProfile.bind(userController)
);

// PUT /api/users/me/password - Изменение пароля текущего пользователя
// PUT /api/users/me/password - Change current user password
router.put(
  '/me/password',
  // Применяем middleware аутентификации
  // Apply authentication middleware
  authenticate,
  // Вызываем метод контроллера для изменения пароля
  // Call controller method to change password
  userController.changePassword.bind(userController)
);

// GET /api/users/:id - Получение пользователя по ID
// GET /api/users/:id - Get user by ID
router.get(
  '/:id',
  // Применяем middleware аутентификации
  // Apply authentication middleware
  authenticate,
  // Вызываем метод контроллера для получения пользователя
  // Call controller method to get user
  userController.getUserById.bind(userController)
);

/**
 * Администраторские маршруты (требуют роль ADMIN)
 * Administrator routes (require ADMIN role)
 */

// GET /api/users - Получение списка всех пользователей
// GET /api/users - Get list of all users
router.get(
  '/',
  // Применяем middleware аутентификации
  // Apply authentication middleware
  authenticate,
  // Применяем middleware авторизации (только администраторы)
  // Apply authorization middleware (admins only)
  requireAdmin,
  // Вызываем метод контроллера для получения списка пользователей
  // Call controller method to get users list
  userController.getAllUsers.bind(userController)
);

// POST /api/users/:id/block - Блокировка пользователя
// POST /api/users/:id/block - Block user
router.post(
  '/:id/block',
  // Применяем middleware аутентификации
  // Apply authentication middleware
  authenticate,
  // Применяем middleware авторизации (только администраторы)
  // Apply authorization middleware (admins only)
  requireAdmin,
  // Вызываем метод контроллера для блокировки пользователя
  // Call controller method to block user
  userController.blockUser.bind(userController)
);

// POST /api/users/:id/unblock - Разблокировка пользователя
// POST /api/users/:id/unblock - Unblock user
router.post(
  '/:id/unblock',
  // Применяем middleware аутентификации
  // Apply authentication middleware
  authenticate,
  // Применяем middleware авторизации (только администраторы)
  // Apply authorization middleware (admins only)
  requireAdmin,
  // Вызываем метод контроллера для разблокировки пользователя
  // Call controller method to unblock user
  userController.unblockUser.bind(userController)
);

/**
 * Экспортируем роутер
 * Export router
 */
export default router;

/**
 * СПИСОК МАРШРУТОВ (ROUTES LIST)
 *
 * Публичные маршруты / Public routes:
 * - POST   /api/users/register         - Регистрация нового пользователя
 * - POST   /api/users/login            - Вход пользователя в систему
 * - POST   /api/users/refresh-token    - Обновление access токена
 *
 * Защищенные маршруты / Protected routes (требуют аутентификации):
 * - GET    /api/users/me               - Получение профиля текущего пользователя
 * - PUT    /api/users/me               - Обновление профиля текущего пользователя
 * - PUT    /api/users/me/password      - Изменение пароля текущего пользователя
 * - GET    /api/users/:id              - Получение пользователя по ID
 *
 * Администраторские маршруты / Admin routes (требуют роль ADMIN):
 * - GET    /api/users                  - Получение списка всех пользователей
 * - POST   /api/users/:id/block        - Блокировка пользователя
 * - POST   /api/users/:id/unblock      - Разблокировка пользователя
 *
 * ПРИМЕЧАНИЯ / NOTES:
 * 1. Все маршруты монтируются в главном приложении с префиксом /api/users
 * 2. Middleware authenticate проверяет наличие и валидность JWT токена
 * 3. Middleware requireAdmin проверяет роль пользователя (только ADMIN)
 * 4. .bind(userController) используется для сохранения контекста this в методах класса
 * 5. NextFunction передается автоматически Express для обработки ошибок
 */
