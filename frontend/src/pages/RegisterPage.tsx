/**
 * Файл: pages/RegisterPage.tsx
 * Описание: Страница регистрации нового пользователя
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
  CircularProgress,
  Grid
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
 * Схема валидации формы регистрации
 * Registration form validation schema
 */
const registerSchema = z.object({
  // Email (обязательно, валидный email) / Email (required, valid email)
  email: z.string().min(1, 'Введите email').email('Введите корректный email'),

  // Имя пользователя (3-30 символов, только буквы и цифры) / Username (3-30 chars, letters and numbers only)
  username: z
    .string()
    .min(3, 'Минимум 3 символа')
    .max(30, 'Максимум 30 символов')
    .regex(/^[a-zA-Z0-9]+$/, 'Только латинские буквы и цифры'),

  // Пароль (минимум 8 символов) / Password (minimum 8 characters)
  password: z.string().min(8, 'Минимум 8 символов'),

  // Имя (обязательно) / First name (required)
  firstName: z.string().min(1, 'Введите имя'),

  // Фамилия (обязательно) / Last name (required)
  lastName: z.string().min(1, 'Введите фамилию'),

  // Отчество (опционально) / Middle name (optional)
  middleName: z.string().optional(),

  // Страна (опционально) / Country (optional)
  country: z.string().optional(),

  // Город (опционально) / City (optional)
  city: z.string().optional(),

  // Организация (опционально) / Organization (optional)
  organization: z.string().optional()
});

/**
 * Тип данных формы регистрации
 * Registration form data type
 */
type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * RegisterPage - страница регистрации
 * RegisterPage - registration page
 */
function RegisterPage() {
  // Получаем navigate для перенаправления
  // Get navigate for redirection
  const navigate = useNavigate();

  // Получаем состояние и действия из store
  // Get state and actions from store
  const { user, register: registerUser, isLoading, error, clearError } = useAuthStore();

  // Настройка react-hook-form с валидацией zod
  // Setup react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
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
  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Вызываем action регистрации
      // Call register action
      await registerUser(data);

      // Показываем успешное уведомление
      // Show success notification
      toast.success('Регистрация выполнена успешно!');

      // Перенаправляем на главную страницу
      // Redirect to home page
      navigate('/', { replace: true });
    } catch (err) {
      // Ошибка уже обработана в store, просто показываем toast
      // Error already handled in store, just show toast
      toast.error(error || 'Ошибка регистрации. Проверьте данные и попробуйте снова.');
    }
  };

  return (
    // Контейнер страницы / Page container
    <Container component="main" maxWidth="md">
      {/* Вертикальное выравнивание */}
      {/* Vertical alignment */}
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Карточка с формой регистрации */}
        {/* Registration form card */}
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
          <Typography component="h1" variant="h4" sx={{ mb: 1 }}>
            Регистрация
          </Typography>

          {/* Подзаголовок */}
          {/* Subtitle */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Создайте аккаунт для доступа к системе
          </Typography>

          {/* Показываем ошибку если есть */}
          {/* Show error if exists */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Форма регистрации */}
          {/* Registration form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            {/* Сетка для полей формы */}
            {/* Grid for form fields */}
            <Grid container spacing={2}>
              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email"
                  autoComplete="email"
                  autoFocus
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                />
              </Grid>

              {/* Имя пользователя */}
              {/* Username */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="username"
                  label="Имя пользователя"
                  autoComplete="username"
                  {...register('username')}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  disabled={isLoading}
                />
              </Grid>

              {/* Пароль */}
              {/* Password */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="password"
                  label="Пароль"
                  type="password"
                  autoComplete="new-password"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isLoading}
                />
              </Grid>

              {/* Имя */}
              {/* First name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  label="Имя"
                  autoComplete="given-name"
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  disabled={isLoading}
                />
              </Grid>

              {/* Фамилия */}
              {/* Last name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Фамилия"
                  autoComplete="family-name"
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  disabled={isLoading}
                />
              </Grid>

              {/* Отчество */}
              {/* Middle name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="middleName"
                  label="Отчество (опционально)"
                  autoComplete="additional-name"
                  {...register('middleName')}
                  error={!!errors.middleName}
                  helperText={errors.middleName?.message}
                  disabled={isLoading}
                />
              </Grid>

              {/* Страна */}
              {/* Country */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="country"
                  label="Страна (опционально)"
                  autoComplete="country-name"
                  {...register('country')}
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  disabled={isLoading}
                />
              </Grid>

              {/* Город */}
              {/* City */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="city"
                  label="Город (опционально)"
                  autoComplete="address-level2"
                  {...register('city')}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                  disabled={isLoading}
                />
              </Grid>

              {/* Организация */}
              {/* Organization */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="organization"
                  label="Организация (опционально)"
                  autoComplete="organization"
                  {...register('organization')}
                  error={!!errors.organization}
                  helperText={errors.organization?.message}
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            {/* Кнопка регистрации */}
            {/* Register button */}
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
              {isLoading ? <CircularProgress size={24} /> : 'Зарегистрироваться'}
            </Button>

            {/* Ссылка на вход */}
            {/* Link to login */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Уже есть аккаунт?{' '}
                <Link component={RouterLink} to="/login" underline="hover">
                  Войти
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
export default RegisterPage;

/**
 * ТЕСТЫ для RegisterPage.tsx
 *
 * Тест 1: RegisterPage рендерится без ошибок
 * - Создать тестовый рендер RegisterPage
 * - Проверить отсутствие ошибок
 *
 * Тест 2: Форма содержит все необходимые поля
 * - Проверить наличие всех 9 полей
 *
 * Тест 3: Валидация email работает
 * - Ввести невалидный email
 * - Проверить ошибку валидации
 *
 * Тест 4: Валидация username работает
 * - Ввести username < 3 символов
 * - Проверить ошибку валидации
 *
 * Тест 5: Валидация пароля работает
 * - Ввести пароль < 8 символов
 * - Проверить ошибку валидации
 *
 * Тест 6: Отправка формы вызывает register
 * - Заполнить форму валидными данными
 * - Отправить форму
 * - Проверить что register вызван
 *
 * Тест 7: Опциональные поля не обязательны
 * - Заполнить только обязательные поля
 * - Отправить форму
 * - Проверить что форма валидна
 *
 * Тест 8: Показывается индикатор загрузки
 * - Установить isLoading = true
 * - Проверить CircularProgress
 *
 * Тест 9: Перенаправление после успешной регистрации
 * - Успешно зарегистрироваться
 * - Проверить navigate вызван с '/'
 *
 * Тест 10: Ссылка на вход работает
 * - Проверить наличие ссылки на /login
 */
