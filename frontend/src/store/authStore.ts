/**
 * Файл: store/authStore.ts
 * Описание: Zustand store для управления состоянием аутентификации
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: zustand, user.service, types
 */

// Импорт Zustand для создания store
// Import Zustand for store creation
import { create } from 'zustand';

// Импорт devtools middleware для отладки
// Import devtools middleware for debugging
import { devtools } from 'zustand/middleware';

// Импорт сервиса пользователей
// Import user service
import { userService } from '../services/user.service';

// Импорт типов
// Import types
import {
  User,
  RegisterUserData,
  LoginUserData,
  UpdateProfileData,
  ChangePasswordData
} from '../types';

/**
 * Интерфейс состояния аутентификации
 * Authentication state interface
 */
interface AuthState {
  // Текущий пользователь (null если не аутентифицирован) / Current user (null if not authenticated)
  user: User | null;

  // Флаг загрузки / Loading flag
  isLoading: boolean;

  // Сообщение об ошибке / Error message
  error: string | null;

  // Флаг инициализации (проверка сохраненной сессии) / Initialization flag (check saved session)
  isInitialized: boolean;

  // Действия / Actions
  // Регистрация / Register
  register: (data: RegisterUserData) => Promise<void>;

  // Вход / Login
  login: (data: LoginUserData) => Promise<void>;

  // Выход / Logout
  logout: () => void;

  // Получение текущего пользователя / Get current user
  fetchCurrentUser: () => Promise<void>;

  // Обновление профиля / Update profile
  updateProfile: (data: UpdateProfileData) => Promise<void>;

  // Смена пароля / Change password
  changePassword: (data: ChangePasswordData) => Promise<void>;

  // Очистка ошибки / Clear error
  clearError: () => void;

  // Инициализация store (проверка сохраненной сессии) / Initialize store (check saved session)
  initialize: () => Promise<void>;
}

/**
 * Создание Zustand store для аутентификации
 * Create Zustand store for authentication
 */
export const useAuthStore = create<AuthState>()(
  // Подключаем devtools middleware для отладки в браузере
  // Connect devtools middleware for browser debugging
  devtools(
    // Функция создания store
    // Store creation function
    (set, get) => ({
      // === НАЧАЛЬНОЕ СОСТОЯНИЕ / INITIAL STATE ===

      // Пользователь не установлен
      // User not set
      user: null,

      // Изначально не загружается
      // Initially not loading
      isLoading: false,

      // Нет ошибок
      // No errors
      error: null,

      // Не инициализирован
      // Not initialized
      isInitialized: false,

      // === ДЕЙСТВИЯ / ACTIONS ===

      /**
       * Регистрация нового пользователя
       * Register new user
       */
      register: async (data: RegisterUserData) => {
        // Устанавливаем флаг загрузки и очищаем ошибку
        // Set loading flag and clear error
        set({ isLoading: true, error: null });

        try {
          // Вызываем сервис регистрации
          // Call registration service
          const result = await userService.register(data);

          // Сохраняем пользователя в state
          // Save user to state
          set({ user: result.user, isLoading: false });
        } catch (error: any) {
          // В случае ошибки сохраняем сообщение
          // On error save message
          set({
            error: error.response?.data?.message || 'Ошибка регистрации',
            isLoading: false
          });

          // Пробрасываем ошибку дальше для обработки в компоненте
          // Re-throw error for component handling
          throw error;
        }
      },

      /**
       * Вход пользователя
       * User login
       */
      login: async (data: LoginUserData) => {
        // Устанавливаем флаг загрузки и очищаем ошибку
        // Set loading flag and clear error
        set({ isLoading: true, error: null });

        try {
          // Вызываем сервис входа
          // Call login service
          const result = await userService.login(data);

          // Сохраняем пользователя в state
          // Save user to state
          set({ user: result.user, isLoading: false });
        } catch (error: any) {
          // В случае ошибки сохраняем сообщение
          // On error save message
          set({
            error: error.response?.data?.message || 'Ошибка входа',
            isLoading: false
          });

          // Пробрасываем ошибку дальше для обработки в компоненте
          // Re-throw error for component handling
          throw error;
        }
      },

      /**
       * Выход пользователя
       * User logout
       */
      logout: () => {
        // Вызываем сервис выхода (очищает токены)
        // Call logout service (clears tokens)
        userService.logout();

        // Очищаем state
        // Clear state
        set({ user: null, error: null });
      },

      /**
       * Получение данных текущего пользователя
       * Fetch current user data
       */
      fetchCurrentUser: async () => {
        // Проверяем, есть ли токен
        // Check if token exists
        if (!userService.isAuthenticated()) {
          // Если токена нет, устанавливаем user как null
          // If no token, set user as null
          set({ user: null, isLoading: false });
          return;
        }

        // Устанавливаем флаг загрузки
        // Set loading flag
        set({ isLoading: true, error: null });

        try {
          // Получаем данные текущего пользователя
          // Get current user data
          const user = await userService.getMyProfile();

          // Сохраняем пользователя в state
          // Save user to state
          set({ user, isLoading: false });
        } catch (error: any) {
          // В случае ошибки (например, невалидный токен)
          // On error (e.g., invalid token)
          // Вызываем logout для очистки
          // Call logout to clear
          get().logout();

          // Сохраняем ошибку
          // Save error
          set({
            error: error.response?.data?.message || 'Ошибка получения данных пользователя',
            isLoading: false
          });
        }
      },

      /**
       * Обновление профиля пользователя
       * Update user profile
       */
      updateProfile: async (data: UpdateProfileData) => {
        // Устанавливаем флаг загрузки и очищаем ошибку
        // Set loading flag and clear error
        set({ isLoading: true, error: null });

        try {
          // Обновляем профиль через сервис
          // Update profile via service
          const updatedUser = await userService.updateMyProfile(data);

          // Сохраняем обновленные данные пользователя
          // Save updated user data
          set({ user: updatedUser, isLoading: false });
        } catch (error: any) {
          // В случае ошибки сохраняем сообщение
          // On error save message
          set({
            error: error.response?.data?.message || 'Ошибка обновления профиля',
            isLoading: false
          });

          // Пробрасываем ошибку дальше
          // Re-throw error
          throw error;
        }
      },

      /**
       * Смена пароля пользователя
       * Change user password
       */
      changePassword: async (data: ChangePasswordData) => {
        // Устанавливаем флаг загрузки и очищаем ошибку
        // Set loading flag and clear error
        set({ isLoading: true, error: null });

        try {
          // Меняем пароль через сервис
          // Change password via service
          await userService.changePassword(data);

          // Сбрасываем флаг загрузки
          // Reset loading flag
          set({ isLoading: false });
        } catch (error: any) {
          // В случае ошибки сохраняем сообщение
          // On error save message
          set({
            error: error.response?.data?.message || 'Ошибка смены пароля',
            isLoading: false
          });

          // Пробрасываем ошибку дальше
          // Re-throw error
          throw error;
        }
      },

      /**
       * Очистка ошибки
       * Clear error
       */
      clearError: () => {
        // Очищаем ошибку в state
        // Clear error in state
        set({ error: null });
      },

      /**
       * Инициализация store (проверка сохраненной сессии)
       * Initialize store (check saved session)
       */
      initialize: async () => {
        // Пытаемся получить текущего пользователя
        // Try to get current user
        await get().fetchCurrentUser();

        // Устанавливаем флаг инициализации
        // Set initialization flag
        set({ isInitialized: true });
      }
    }),
    // Название store в devtools
    // Store name in devtools
    { name: 'AuthStore' }
  )
);

// Подписываемся на событие logout из API сервиса
// Subscribe to logout event from API service
window.addEventListener('auth:logout', () => {
  // Вызываем logout в store
  // Call logout in store
  useAuthStore.getState().logout();
});

/**
 * ТЕСТЫ для authStore.ts
 *
 * Тест 1: Начальное состояние store
 * - user === null
 * - isLoading === false
 * - error === null
 * - isInitialized === false
 *
 * Тест 2: register устанавливает пользователя при успехе
 * - Вызвать register с данными
 * - Проверить что user установлен
 * - Проверить что isLoading === false
 *
 * Тест 3: register устанавливает ошибку при неудаче
 * - Сымитировать ошибку регистрации
 * - Проверить что error установлена
 * - Проверить что user === null
 *
 * Тест 4: login устанавливает пользователя при успехе
 * - Вызвать login с данными
 * - Проверить что user установлен
 *
 * Тест 5: logout очищает пользователя
 * - Установить пользователя
 * - Вызвать logout
 * - Проверить что user === null
 *
 * Тест 6: fetchCurrentUser получает пользователя
 * - Установить токен
 * - Вызвать fetchCurrentUser
 * - Проверить что user установлен
 *
 * Тест 7: fetchCurrentUser вызывает logout при ошибке
 * - Сымитировать ошибку 401
 * - Проверить что logout вызван
 *
 * Тест 8: updateProfile обновляет данные пользователя
 * - Вызвать updateProfile с новыми данными
 * - Проверить что user обновлен
 *
 * Тест 9: changePassword не изменяет пользователя
 * - Вызвать changePassword
 * - Проверить что user остался прежним
 *
 * Тест 10: clearError очищает ошибку
 * - Установить ошибку
 * - Вызвать clearError
 * - Проверить что error === null
 *
 * Тест 11: initialize вызывает fetchCurrentUser
 * - Вызвать initialize
 * - Проверить что fetchCurrentUser вызван
 * - Проверить что isInitialized === true
 */
