/**
 * Файл: main.tsx
 * Описание: Точка входа в приложение React
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: react, react-dom, App, MUI theme
 */

// Импорт React
// Import React
import React from 'react';

// Импорт ReactDOM для рендера приложения
// Import ReactDOM for app rendering
import ReactDOM from 'react-dom/client';

// Импорт главного компонента App
// Import main App component
import App from './App';

// Импорт BrowserRouter для маршрутизации
// Import BrowserRouter for routing
import { BrowserRouter } from 'react-router-dom';

// Импорт ThemeProvider и CssBaseline из MUI
// Import ThemeProvider and CssBaseline from MUI
import { ThemeProvider, CssBaseline } from '@mui/material';

// Импорт темы приложения
// Import app theme
import { theme } from './utils/theme';

// Импорт ToastContainer для уведомлений
// Import ToastContainer for notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Получаем корневой элемент DOM
// Get root DOM element
const rootElement = document.getElementById('root');

// Проверяем что корневой элемент существует
// Check that root element exists
if (!rootElement) {
  // Если корневой элемент не найден, выбрасываем ошибку
  // If root element not found, throw error
  throw new Error('Failed to find the root element');
}

// Создаем корень React приложения
// Create React app root
const root = ReactDOM.createRoot(rootElement);

// Рендерим приложение
// Render application
root.render(
  // StrictMode для выявления потенциальных проблем
  // StrictMode for detecting potential problems
  <React.StrictMode>
    {/* BrowserRouter для поддержки маршрутизации */}
    {/* BrowserRouter for routing support */}
    <BrowserRouter>
      {/* ThemeProvider для применения темы MUI */}
      {/* ThemeProvider for applying MUI theme */}
      <ThemeProvider theme={theme}>
        {/* CssBaseline для нормализации стилей */}
        {/* CssBaseline for normalizing styles */}
        <CssBaseline />

        {/* Главный компонент приложения */}
        {/* Main application component */}
        <App />

        {/* Контейнер для toast уведомлений */}
        {/* Container for toast notifications */}
        <ToastContainer
          position="top-right"           // Позиция в правом верхнем углу / Position in top right corner
          autoClose={5000}                // Автозакрытие через 5 секунд / Auto close after 5 seconds
          hideProgressBar={false}         // Показывать прогресс-бар / Show progress bar
          newestOnTop                     // Новые уведомления сверху / New notifications on top
          closeOnClick                    // Закрывать по клику / Close on click
          rtl={false}                     // Не использовать RTL / Don't use RTL
          pauseOnFocusLoss                // Пауза при потере фокуса / Pause on focus loss
          draggable                       // Возможность перетаскивания / Draggable
          pauseOnHover                    // Пауза при наведении / Pause on hover
        />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

/**
 * ТЕСТЫ для main.tsx
 *
 * Тест 1: Приложение рендерится без ошибок
 * - Проверить что root.render вызывается
 * - Проверить отсутствие ошибок в консоли
 *
 * Тест 2: Корневой элемент найден
 * - Проверить что document.getElementById('root') возвращает элемент
 *
 * Тест 3: Все провайдеры подключены
 * - BrowserRouter обернут вокруг приложения
 * - ThemeProvider обернут вокруг приложения
 * - ToastContainer присутствует
 *
 * Тест 4: StrictMode активен
 * - Проверить что приложение обернуто в React.StrictMode
 */
