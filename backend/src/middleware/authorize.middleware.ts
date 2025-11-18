/**
 * Файл: middleware/authorize.middleware.ts
 * Описание: Middleware для авторизации (проверки прав доступа на основе ролей)
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: express, types/common.types.ts
 */

// Импорт типов Express
import { Request, Response, NextFunction } from 'express';

// Импорт типов
import { UserRole } from '../types/common.types';

/**
 * Фабрика middleware для проверки роли пользователя
 * Создает middleware, который проверяет, имеет ли пользователь одну из указанных ролей
 * ВАЖНО: Должен использоваться ПОСЛЕ authenticate middleware!
 *
 * @param allowedRoles - массив ролей, которым разрешен доступ
 * @returns Middleware функция для проверки авторизации
 *
 * @example
 * ```typescript
 * // Только для администраторов
 * router.get('/admin', authenticate, authorize([UserRole.ADMIN]), handler);
 *
 * // Для организаторов и главных судей
 * router.post('/competition', authenticate, authorize([UserRole.ORGANIZER, UserRole.CHIEF_JUDGE]), handler);
 * ```
 */
export const authorize = (allowedRoles: UserRole[]) => {
  // Возвращаем middleware функцию
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Проверяем, что пользователь аутентифицирован (req.user должен быть заполнен)
      if (!req.user) {
        // Если req.user не заполнен, значит authenticate middleware не был вызван
        res.status(401).json({
          success: false,
          message: 'Необходима аутентификация',
          errorCode: 'NOT_AUTHENTICATED'
        });
        return;
      }

      // Получаем роль пользователя из токена
      const userRole = req.user.role;

      // Проверяем, есть ли роль пользователя в списке разрешенных
      const hasPermission = allowedRoles.includes(userRole);

      // Если нет разрешения, возвращаем ошибку 403 Forbidden
      if (!hasPermission) {
        res.status(403).json({
          success: false,
          message: 'Недостаточно прав для выполнения этого действия',
          errorCode: 'FORBIDDEN',
          requiredRoles: allowedRoles, // Для отладки показываем, какие роли нужны
          userRole: userRole // И какая роль у пользователя
        });
        return;
      }

      // Если все проверки пройдены, передаем управление следующему middleware
      next();
    } catch (error) {
      // Логируем ошибку
      console.error('Ошибка в middleware авторизации:', error);

      // Возвращаем ошибку 500
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера при проверке прав доступа',
        errorCode: 'AUTHORIZATION_ERROR'
      });
    }
  };
};

/**
 * Middleware для проверки, что пользователь - администратор
 * Удобная обертка для часто используемой проверки
 */
export const requireAdmin = authorize([UserRole.ADMIN]);

/**
 * Middleware для проверки, что пользователь - организатор или администратор
 * Организаторы могут управлять соревнованиями
 */
export const requireOrganizer = authorize([UserRole.ADMIN, UserRole.ORGANIZER]);

/**
 * Middleware для проверки, что пользователь - главный судья, организатор или администратор
 * Доступ к функциям управления судейством
 */
export const requireChiefJudge = authorize([
  UserRole.ADMIN,
  UserRole.ORGANIZER,
  UserRole.CHIEF_JUDGE
]);

/**
 * Middleware для проверки, что пользователь - главный секретарь или выше
 * Доступ к управлению участниками и протоколами
 */
export const requireChiefSecretary = authorize([
  UserRole.ADMIN,
  UserRole.ORGANIZER,
  UserRole.CHIEF_JUDGE,
  UserRole.CHIEF_SECRETARY
]);

/**
 * Middleware для проверки, что пользователь - любой судья
 * Доступ к функциям судейства
 */
export const requireJudge = authorize([
  UserRole.ADMIN,
  UserRole.CHIEF_JUDGE,
  UserRole.JUDGE_D,
  UserRole.JUDGE_E,
  UserRole.JUDGE_A,
  UserRole.TIMEKEEPER,
  UserRole.LINE_JUDGE,
  UserRole.BRIGADE_SECRETARY
]);

/**
 * Middleware для проверки, что пользователь - судья D-бригады
 */
export const requireDJudge = authorize([UserRole.ADMIN, UserRole.CHIEF_JUDGE, UserRole.JUDGE_D]);

/**
 * Middleware для проверки, что пользователь - судья E-бригады
 */
export const requireEJudge = authorize([UserRole.ADMIN, UserRole.CHIEF_JUDGE, UserRole.JUDGE_E]);

/**
 * Middleware для проверки, что пользователь - судья A-бригады
 */
export const requireAJudge = authorize([UserRole.ADMIN, UserRole.CHIEF_JUDGE, UserRole.JUDGE_A]);

/**
 * Middleware для проверки, что пользователь - тренер или выше
 * Доступ к управлению своими спортсменами
 */
export const requireCoach = authorize([
  UserRole.ADMIN,
  UserRole.ORGANIZER,
  UserRole.CHIEF_SECRETARY,
  UserRole.COACH
]);

/**
 * Проверка, является ли пользователь владельцем ресурса
 * Используется для проверки, что пользователь может редактировать только свои данные
 *
 * @param resourceUserId - ID владельца ресурса
 * @returns Middleware функция
 */
export const requireOwnershipOrAdmin = (resourceUserId: string) => {
  // Возвращаем middleware
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Проверяем аутентификацию
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Необходима аутентификация',
          errorCode: 'NOT_AUTHENTICATED'
        });
        return;
      }

      // Получаем ID текущего пользователя
      const currentUserId = req.user.userId;

      // Получаем роль пользователя
      const userRole = req.user.role;

      // Проверяем: либо пользователь - владелец, либо администратор
      const isOwner = currentUserId === resourceUserId;
      const isAdmin = userRole === UserRole.ADMIN;

      // Если ни владелец, ни админ - запрещаем доступ
      if (!isOwner && !isAdmin) {
        res.status(403).json({
          success: false,
          message: 'Вы можете изменять только свои данные',
          errorCode: 'NOT_OWNER'
        });
        return;
      }

      // Разрешаем доступ
      next();
    } catch (error) {
      // Логируем ошибку
      console.error('Ошибка в middleware проверки владения:', error);

      // Возвращаем ошибку
      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
        errorCode: 'OWNERSHIP_CHECK_ERROR'
      });
    }
  };
};

/**
 * ТЕСТЫ для authorize.middleware.ts
 *
 * Тест 1: Успешная авторизация с правильной ролью
 * - Создать req.user с role: UserRole.ADMIN
 * - Вызвать authorize([UserRole.ADMIN])
 * - Проверить, что next() был вызван
 * - Проверить, что ответ не был отправлен
 *
 * Тест 2: Отказ в доступе с неправильной ролью
 * - Создать req.user с role: UserRole.SPECTATOR
 * - Вызвать authorize([UserRole.ADMIN])
 * - Проверить, что вернулся статус 403
 * - Проверить, что errorCode === 'FORBIDDEN'
 * - Проверить, что next() НЕ был вызван
 *
 * Тест 3: Авторизация с несколькими разрешенными ролями
 * - Создать req.user с role: UserRole.ORGANIZER
 * - Вызвать authorize([UserRole.ADMIN, UserRole.ORGANIZER])
 * - Проверить, что next() был вызван
 *
 * Тест 4: Попытка авторизации без аутентификации
 * - Не заполнять req.user
 * - Вызвать authorize([UserRole.ADMIN])
 * - Проверить, что вернулся статус 401
 * - Проверить, что errorCode === 'NOT_AUTHENTICATED'
 *
 * Тест 5: requireAdmin middleware
 * - Создать req.user с role: UserRole.ADMIN
 * - Вызвать requireAdmin
 * - Проверить, что next() был вызван
 * - Попробовать с role: UserRole.COACH
 * - Ожидать статус 403
 *
 * Тест 6: requireOwnershipOrAdmin
 * - Создать req.user с userId: '123', role: UserRole.COACH
 * - Вызвать requireOwnershipOrAdmin('123')
 * - Проверить, что next() был вызван (владелец)
 * - Вызвать requireOwnershipOrAdmin('456')
 * - Ожидать статус 403 (не владелец)
 *
 * Тест 7: requireOwnershipOrAdmin для админа
 * - Создать req.user с userId: '123', role: UserRole.ADMIN
 * - Вызвать requireOwnershipOrAdmin('456')
 * - Проверить, что next() был вызван (админ может все)
 *
 * Тест 8: requireJudge
 * - Попробовать все роли судей (JUDGE_D, JUDGE_E, JUDGE_A, TIMEKEEPER)
 * - Проверить, что все проходят
 * - Попробовать роль SPECTATOR
 * - Ожидать отказ
 */
