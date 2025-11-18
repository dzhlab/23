/**
 * Файл: utils/theme.ts
 * Описание: Настройка темы Material-UI для приложения
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: @mui/material
 */

// Импорт функции создания темы из MUI
// Import theme creation function from MUI
import { createTheme } from '@mui/material/styles';

/**
 * Создание кастомной темы приложения
 * Create custom application theme
 */
export const theme = createTheme({
  // Палитра цветов / Color palette
  palette: {
    // Режим темы (light/dark) / Theme mode (light/dark)
    mode: 'light',

    // Основной цвет (для кнопок, ссылок и т.д.) / Primary color (for buttons, links, etc.)
    primary: {
      main: '#1976d2',                   // Основной синий / Main blue
      light: '#42a5f5',                  // Светлый синий / Light blue
      dark: '#1565c0',                   // Темный синий / Dark blue
      contrastText: '#fff'               // Белый текст на основном цвете / White text on primary
    },

    // Вторичный цвет (для акцентов) / Secondary color (for accents)
    secondary: {
      main: '#9c27b0',                   // Основной фиолетовый / Main purple
      light: '#ba68c8',                  // Светлый фиолетовый / Light purple
      dark: '#7b1fa2',                   // Темный фиолетовый / Dark purple
      contrastText: '#fff'               // Белый текст на вторичном цвете / White text on secondary
    },

    // Цвет ошибки / Error color
    error: {
      main: '#d32f2f',                   // Красный / Red
      light: '#ef5350',
      dark: '#c62828'
    },

    // Цвет предупреждения / Warning color
    warning: {
      main: '#ed6c02',                   // Оранжевый / Orange
      light: '#ff9800',
      dark: '#e65100'
    },

    // Цвет информации / Info color
    info: {
      main: '#0288d1',                   // Голубой / Light blue
      light: '#03a9f4',
      dark: '#01579b'
    },

    // Цвет успеха / Success color
    success: {
      main: '#2e7d32',                   // Зеленый / Green
      light: '#4caf50',
      dark: '#1b5e20'
    },

    // Фоновые цвета / Background colors
    background: {
      default: '#f5f5f5',                // Основной фон / Main background
      paper: '#ffffff'                   // Фон для карточек / Background for cards
    },

    // Цвета текста / Text colors
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',    // Основной текст / Primary text
      secondary: 'rgba(0, 0, 0, 0.6)',   // Вторичный текст / Secondary text
      disabled: 'rgba(0, 0, 0, 0.38)'    // Отключенный текст / Disabled text
    }
  },

  // Типография / Typography
  typography: {
    // Семейство шрифтов / Font family
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),

    // Заголовок h1 / Heading h1
    h1: {
      fontSize: '2.5rem',                // 40px
      fontWeight: 500,
      lineHeight: 1.2
    },

    // Заголовок h2 / Heading h2
    h2: {
      fontSize: '2rem',                  // 32px
      fontWeight: 500,
      lineHeight: 1.3
    },

    // Заголовок h3 / Heading h3
    h3: {
      fontSize: '1.75rem',               // 28px
      fontWeight: 500,
      lineHeight: 1.4
    },

    // Заголовок h4 / Heading h4
    h4: {
      fontSize: '1.5rem',                // 24px
      fontWeight: 500,
      lineHeight: 1.4
    },

    // Заголовок h5 / Heading h5
    h5: {
      fontSize: '1.25rem',               // 20px
      fontWeight: 500,
      lineHeight: 1.5
    },

    // Заголовок h6 / Heading h6
    h6: {
      fontSize: '1rem',                  // 16px
      fontWeight: 500,
      lineHeight: 1.6
    },

    // Основной текст / Body text
    body1: {
      fontSize: '1rem',                  // 16px
      lineHeight: 1.5
    },

    // Вторичный текст / Secondary body text
    body2: {
      fontSize: '0.875rem',              // 14px
      lineHeight: 1.43
    },

    // Текст кнопки / Button text
    button: {
      fontSize: '0.875rem',              // 14px
      fontWeight: 500,
      textTransform: 'none'              // Не делать uppercase / Don't make uppercase
    }
  },

  // Форма компонентов / Component shape
  shape: {
    borderRadius: 8                      // Радиус скругления углов / Border radius
  },

  // Настройки компонентов / Component settings
  components: {
    // Настройки кнопок / Button settings
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,               // Скругление углов / Border radius
          textTransform: 'none',         // Не делать uppercase / Don't make uppercase
          fontWeight: 500,
          padding: '8px 16px'            // Отступы / Padding
        }
      }
    },

    // Настройки текстовых полей / TextField settings
    MuiTextField: {
      defaultProps: {
        variant: 'outlined'              // Вариант по умолчанию / Default variant
      }
    },

    // Настройки карточек / Card settings
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,              // Скругление углов / Border radius
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' // Тень / Shadow
        }
      }
    },

    // Настройки AppBar / AppBar settings
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)' // Более мягкая тень / Softer shadow
        }
      }
    }
  }
});

/**
 * ТЕСТЫ для theme.ts
 *
 * Тест 1: Тема создается без ошибок
 * - Проверить что createTheme не выбрасывает ошибку
 * - Проверить что theme объект существует
 *
 * Тест 2: Основные цвета настроены
 * - theme.palette.primary.main === '#1976d2'
 * - theme.palette.secondary.main === '#9c27b0'
 *
 * Тест 3: Типография настроена
 * - Проверить наличие всех уровней заголовков (h1-h6)
 * - Проверить button.textTransform === 'none'
 *
 * Тест 4: Компоненты кастомизированы
 * - MuiButton имеет styleOverrides
 * - MuiCard имеет borderRadius: 12
 */
