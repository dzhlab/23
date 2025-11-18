/**
 * Файл: App.tsx
 * Описание: Главный компонент приложения с маршрутизацией
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: react-router-dom, store, pages, components
 */

// Импорт React и хуков
// Import React and hooks
import { useEffect } from 'react';

// Импорт компонентов маршрутизации
// Import routing components
import { Routes, Route, Navigate } from 'react-router-dom';

// Импорт Box для layout из MUI
// Import Box for layout from MUI
import { Box, CircularProgress } from '@mui/material';

// Импорт auth store
// Import auth store
import { useAuthStore } from './store';

// Импорт страниц (будут созданы далее)
// Import pages (will be created next)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CompetitionsPage from './pages/CompetitionsPage';
import ProfilePage from './pages/ProfilePage';

// Импорт Layout компонента
// Import Layout component
import Layout from './components/Layout';

/**
 * Компонент для защищенных маршрутов (требуют аутентификации)
 * Component for protected routes (require authentication)
 *
 * @param children - дочерние компоненты / child components
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute - компонент для защиты маршрутов
 * ProtectedRoute - component for route protection
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Получаем пользователя из store
  // Get user from store
  const { user } = useAuthStore();

  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Если пользователь аутентифицирован, рендерим дочерние компоненты
  // If user is authenticated, render children
  return <>{children}</>;
};

/**
 * App - главный компонент приложения
 * App - main application component
 */
function App() {
  // Получаем состояние и действия из auth store
  // Get state and actions from auth store
  const { isInitialized, initialize } = useAuthStore();

  // Инициализация приложения при монтировании
  // Initialize application on mount
  useEffect(() => {
    // Вызываем инициализацию (проверка сохраненной сессии)
    // Call initialization (check saved session)
    initialize();
  }, []); // Пустой массив зависимостей - выполняется только при монтировании / Empty dependency array - runs only on mount

  // Показываем загрузчик пока приложение инициализируется
  // Show loader while application is initializing
  if (!isInitialized) {
    return (
      // Контейнер по центру экрана / Container centered on screen
      <Box
        display="flex"                    // Flexbox layout
        justifyContent="center"           // Центрирование по горизонтали / Horizontal centering
        alignItems="center"               // Центрирование по вертикали / Vertical centering
        minHeight="100vh"                 // Минимальная высота 100% viewport / Min height 100% viewport
      >
        {/* Индикатор загрузки / Loading indicator */}
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Рендерим приложение с маршрутизацией
  // Render application with routing
  return (
    // Routes - контейнер для всех маршрутов / Routes - container for all routes
    <Routes>
      {/* Публичные маршруты (не требуют аутентификации) */}
      {/* Public routes (don't require authentication) */}

      {/* Маршрут входа / Login route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Маршрут регистрации / Registration route */}
      <Route path="/register" element={<RegisterPage />} />

      {/* Защищенные маршруты с общим Layout */}
      {/* Protected routes with common Layout */}
      <Route
        path="/"
        element={
          // Защищаем весь Layout / Protect entire Layout
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Главная страница / Home page */}
        <Route index element={<HomePage />} />

        {/* Страница соревнований / Competitions page */}
        <Route path="competitions" element={<CompetitionsPage />} />

        {/* Страница профиля / Profile page */}
        <Route path="profile" element={<ProfilePage />} />

        {/* Можно добавить больше маршрутов здесь */}
        {/* Can add more routes here */}
        {/* <Route path="competition/:id" element={<CompetitionDetailsPage />} /> */}
        {/* <Route path="admin" element={<AdminPage />} /> */}
      </Route>

      {/* Fallback маршрут - перенаправление на главную */}
      {/* Fallback route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Экспорт компонента по умолчанию
// Export component as default
export default App;

/**
 * ТЕСТЫ для App.tsx
 *
 * Тест 1: App рендерится без ошибок
 * - Создать тестовый рендер App
 * - Проверить отсутствие ошибок
 *
 * Тест 2: Показывает загрузчик при инициализации
 * - Установить isInitialized = false
 * - Проверить наличие CircularProgress
 *
 * Тест 3: Инициализация вызывается при монтировании
 * - Замокать initialize
 * - Проверить что initialize вызван один раз
 *
 * Тест 4: ProtectedRoute перенаправляет неаутентифицированных
 * - Установить user = null
 * - Попытаться перейти на защищенный маршрут
 * - Проверить перенаправление на /login
 *
 * Тест 5: ProtectedRoute разрешает доступ аутентифицированным
 * - Установить user = { id: '1', ... }
 * - Перейти на защищенный маршрут
 * - Проверить что компонент отрендерен
 *
 * Тест 6: Публичные маршруты доступны без аутентификации
 * - Перейти на /login
 * - Проверить что LoginPage отрендерена
 *
 * Тест 7: Fallback маршрут перенаправляет на главную
 * - Перейти на несуществующий маршрут /nonexistent
 * - Проверить перенаправление на /
 *
 * Тест 8: Все защищенные маршруты используют Layout
 * - Проверить что Layout компонент присутствует
 * - Проверить что все дочерние маршруты внутри Layout
 */
