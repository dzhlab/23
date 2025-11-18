/**
 * Файл: pages/LoginPage.tsx
 * Описание: Страница входа в систему
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: react, react-router-dom, @mui/material, react-hook-form, zod, store
 */

// Импорт React и хуков
// Import React and hooks
import { useEffect } from 'react';

// Импорт компонентов маршрутизации
// Import routing components
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// Импорт компонентов MUI
// Import MUI components
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';

// Импорт react-hook-form для работы с формами
// Import react-hook-form for form handling
import { useForm } from 'react-hook-form';

// Импорт zod для валидации
// Import zod for validation
import { z } from 'zod';

// Импорт резолвера zod для react-hook-form
// Import zod resolver for react-hook-form
import { zodResolver } from '@hookform/resolvers/zod';

// Импорт toast для уведомлений
// Import toast for notifications
import { toast } from 'react-toastify';

// Импорт auth store
// Import auth store
import { useAuthStore } from '../store';

/**
 * Схема валидации формы входа
 * Login form validation schema
 */
const loginSchema = z.object({
  // Email или username (обязательно) / Email or username (required)
  emailOrUsername: z.string().min(1, 'Введите email или имя пользователя'),

  // Пароль (обязательно) / Password (required)
  password: z.string().min(1, 'Введите пароль')
});

/**
 * Тип данных формы входа
 * Login form data type
 */
type LoginFormData = z.infer<typeof loginSchema>;

/**
 * LoginPage - страница входа в систему
 * LoginPage - login page
 */
function LoginPage() {
  // Получаем navigate для перенаправления
  // Get navigate for redirection
  const navigate = useNavigate();

  // Получаем состояние и действия из store
  // Get state and actions from store
  const { user, login, isLoading, error, clearError } = useAuthStore();

  // Настройка react-hook-form с валидацией zod
  // Setup react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  // Перенаправление на главную если пользователь уже вошел
  // Redirect to home if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Очистка ошибки при размонтировании
  // Clear error on unmount
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  /**
   * Обработчик отправки формы
   * Form submit handler
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      // Вызываем action входа
      // Call login action
      await login(data);

      // Показываем успешное уведомление
      // Show success notification
      toast.success('Вход выполнен успешно!');

      // Перенаправляем на главную страницу
      // Redirect to home page
      navigate('/', { replace: true });
    } catch (err) {
      // Ошибка уже обработана в store, просто показываем toast
      // Error already handled in store, just show toast
      toast.error(error || 'Ошибка входа. Проверьте данные и попробуйте снова.');
    }
  };

  return (
    // Контейнер страницы / Page container
    <Container component="main" maxWidth="xs">
      {/* Вертикальное выравнивание по центру */}
      {/* Vertical centering */}
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        {/* Карточка с формой входа */}
        {/* Login form card */}
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          {/* Заголовок */}
          {/* Title */}
          <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
            Вход в систему
          </Typography>

          {/* Подзаголовок */}
          {/* Subtitle */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Система управления соревнованиями по художественной гимнастике
          </Typography>

          {/* Показываем ошибку если есть */}
          {/* Show error if exists */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Форма входа */}
          {/* Login form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            {/* Поле email или username */}
            {/* Email or username field */}
            <TextField
              margin="normal"
              fullWidth
              id="emailOrUsername"
              label="Email или имя пользователя"
              autoComplete="username"
              autoFocus
              {...register('emailOrUsername')}
              error={!!errors.emailOrUsername}
              helperText={errors.emailOrUsername?.message}
              disabled={isLoading}
            />

            {/* Поле пароля */}
            {/* Password field */}
            <TextField
              margin="normal"
              fullWidth
              id="password"
              label="Пароль"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
            />

            {/* Кнопка входа */}
            {/* Login button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {/* Показываем индикатор загрузки или текст кнопки */}
              {/* Show loading indicator or button text */}
              {isLoading ? <CircularProgress size={24} /> : 'Войти'}
            </Button>

            {/* Ссылка на регистрацию */}
            {/* Link to registration */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Нет аккаунта?{' '}
                <Link component={RouterLink} to="/register" underline="hover">
                  Зарегистрироваться
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Информация о приложении */}
        {/* Application info */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          © 2025 Система управления соревнованиями по художественной гимнастике
        </Typography>
      </Box>
    </Container>
  );
}

// Экспорт компонента по умолчанию
// Export component as default
export default LoginPage;

/**
 * ТЕСТЫ для LoginPage.tsx
 *
 * Тест 1: LoginPage рендерится без ошибок
 * - Создать тестовый рендер LoginPage
 * - Проверить отсутствие ошибок
 *
 * Тест 2: Форма содержит все необходимые поля
 * - Проверить наличие поля emailOrUsername
 * - Проверить наличие поля password
 * - Проверить наличие кнопки "Войти"
 *
 * Тест 3: Валидация работает корректно
 * - Отправить пустую форму
 * - Проверить появление ошибок валидации
 *
 * Тест 4: Отправка формы вызывает login
 * - Заполнить форму валидными данными
 * - Отправить форму
 * - Проверить что login вызван с правильными данными
 *
 * Тест 5: Показывается индикатор загрузки
 * - Установить isLoading = true
 * - Проверить наличие CircularProgress
 * - Проверить что поля disabled
 *
 * Тест 6: Показывается ошибка при неудаче
 * - Установить error в store
 * - Проверить наличие Alert с ошибкой
 *
 * Тест 7: Перенаправление после успешного входа
 * - Успешно войти
 * - Проверить navigate вызван с '/'
 *
 * Тест 8: Перенаправление если пользователь уже вошел
 * - Установить user в store
 * - Рендерить LoginPage
 * - Проверить navigate вызван
 *
 * Тест 9: Ссылка на регистрацию работает
 * - Проверить наличие ссылки на /register
 *
 * Тест 10: Очистка ошибки при размонтировании
 * - Размонтировать компонент
 * - Проверить что clearError вызван
 */
