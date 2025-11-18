/**
 * Файл: vite.config.ts
 * Описание: Конфигурация Vite для frontend приложения
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: vite, @vitejs/plugin-react
 */

// Импорт функции defineConfig из Vite
import { defineConfig } from 'vite';

// Импорт плагина для поддержки React
import react from '@vitejs/plugin-react';

// Импорт модуля path для работы с путями
import path from 'path';

// Экспорт конфигурации Vite
// https://vitejs.dev/config/
export default defineConfig({
  // Плагины Vite
  plugins: [
    // Плагин React с поддержкой Fast Refresh
    react()
  ],

  // Настройки разрешения модулей
  resolve: {
    // Алиасы для упрощения импортов
    alias: {
      // @ указывает на src директорию
      '@': path.resolve(__dirname, './src'),

      // Алиасы для поддиректорий
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types')
    }
  },

  // Настройки dev сервера
  server: {
    // Порт для dev сервера
    port: 5173,

    // Автоматически открывать браузер
    open: false,

    // Strict port - не пытаться использовать другой порт если занят
    strictPort: true,

    // Host для доступа из локальной сети
    host: true,

    // Прокси для API запросов (для избежания CORS в development)
    proxy: {
      // Все запросы на /api будут проксированы на backend
      '/api': {
        // URL backend сервера
        target: 'http://localhost:3000',

        // Изменить origin на target URL
        changeOrigin: true,

        // Логировать прокси запросы
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxy request:', req.method, req.url);
          });
        }
      },

      // Прокси для WebSocket
      '/socket.io': {
        // URL WebSocket сервера
        target: 'http://localhost:3001',

        // Включить WebSocket
        ws: true,

        // Изменить origin
        changeOrigin: true
      }
    }
  },

  // Настройки сборки
  build: {
    // Директория для сборки
    outDir: 'dist',

    // Генерировать source maps
    sourcemap: true,

    // Минимальный размер чанка в KB перед предупреждением
    chunkSizeWarningLimit: 1000,

    // Rollup опции
    rollupOptions: {
      // Разделение кода на чанки
      output: {
        // Стратегия разделения чанков
        manualChunks: {
          // Вендорные библиотеки
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Material-UI
          'mui-vendor': ['@mui/material', '@mui/icons-material'],

          // Утилиты
          'utils-vendor': ['axios', 'date-fns', 'zod']
        }
      }
    }
  },

  // Оптимизация зависимостей
  optimizeDeps: {
    // Включить эти зависимости в предварительную сборку
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material'
    ]
  },

  // Переменные окружения
  define: {
    // Версия приложения из package.json
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },

  // Настройки тестирования (Vitest)
  test: {
    // Среда выполнения тестов (jsdom для React)
    environment: 'jsdom',

    // Глобальные переменные тестов
    globals: true,

    // Файлы setup для тестов
    setupFiles: './src/tests/setup.ts',

    // Coverage конфигурация
    coverage: {
      // Провайдер coverage
      provider: 'v8',

      // Форматы отчетов
      reporter: ['text', 'json', 'html'],

      // Исключить из coverage
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/'
      ]
    }
  }
});
