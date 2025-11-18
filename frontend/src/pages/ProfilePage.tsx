/**
 * Файл: pages/ProfilePage.tsx
 * Описание: Страница профиля пользователя
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: @mui/material, store
 */

// Импорт компонентов MUI
// Import MUI components
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Divider,
  Button
} from '@mui/material';

// Импорт иконок MUI
// Import MUI icons
import {
  Edit as EditIcon,
  Lock as LockIcon
} from '@mui/icons-material';

// Импорт auth store
// Import auth store
import { useAuthStore } from '../store';

// Импорт функции форматирования даты
// Import date formatting function
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

/**
 * ProfilePage - страница профиля пользователя
 * ProfilePage - user profile page
 */
function ProfilePage() {
  // Получаем пользователя из store
  // Get user from store
  const { user } = useAuthStore();

  // Если пользователя нет (не должно произойти), показываем заглушку
  // If no user (shouldn't happen), show placeholder
  if (!user) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5">Пользователь не найден</Typography>
      </Container>
    );
  }

  /**
   * Функция форматирования даты
   * Date formatting function
   */
  const formatDate = (date?: Date | string) => {
    if (!date) return 'Не указано';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'd MMMM yyyy', { locale: ru });
  };

  return (
    // Контейнер страницы / Page container
    <Container maxWidth="md">
      {/* Заголовок страницы */}
      {/* Page header */}
      <Typography variant="h4" component="h1" gutterBottom>
        Профиль пользователя
      </Typography>

      {/* Карточка с основной информацией */}
      {/* Main information card */}
      <Paper elevation={2} sx={{ padding: 4, mb: 3 }}>
        {/* Верхняя часть с аватаром и кнопками */}
        {/* Top section with avatar and buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3
          }}
        >
          {/* Аватар и основная информация */}
          {/* Avatar and basic information */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Большой аватар */}
            {/* Large avatar */}
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: '2.5rem',
                bgcolor: 'primary.main'
              }}
            >
              {user.firstName[0]}{user.lastName[0]}
            </Avatar>

            {/* Имя и роль */}
            {/* Name and role */}
            <Box>
              <Typography variant="h5" gutterBottom>
                {user.firstName} {user.middleName} {user.lastName}
              </Typography>

              {/* Чип с ролью */}
              {/* Role chip */}
              <Chip
                label={user.role}
                color="primary"
                size="small"
              />

              {/* Чип статуса блокировки */}
              {/* Block status chip */}
              {user.isBlocked && (
                <Chip
                  label="Заблокирован"
                  color="error"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
          </Box>

          {/* Кнопки действий */}
          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              disabled
            >
              Редактировать
            </Button>
            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              disabled
            >
              Сменить пароль
            </Button>
          </Box>
        </Box>

        {/* Разделитель */}
        {/* Divider */}
        <Divider sx={{ my: 3 }} />

        {/* Детальная информация */}
        {/* Detailed information */}
        <Typography variant="h6" gutterBottom>
          Личная информация
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Email */}
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">
              {user.email}
            </Typography>
          </Grid>

          {/* Username */}
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Имя пользователя
            </Typography>
            <Typography variant="body1">
              {user.username}
            </Typography>
          </Grid>

          {/* Дата рождения */}
          {/* Date of birth */}
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Дата рождения
            </Typography>
            <Typography variant="body1">
              {formatDate(user.dateOfBirth)}
            </Typography>
          </Grid>

          {/* Страна */}
          {/* Country */}
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Страна
            </Typography>
            <Typography variant="body1">
              {user.country || 'Не указано'}
            </Typography>
          </Grid>

          {/* Город */}
          {/* City */}
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Город
            </Typography>
            <Typography variant="body1">
              {user.city || 'Не указано'}
            </Typography>
          </Grid>

          {/* Организация */}
          {/* Organization */}
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Организация
            </Typography>
            <Typography variant="body1">
              {user.organization || 'Не указано'}
            </Typography>
          </Grid>
        </Grid>

        {/* Разделитель */}
        {/* Divider */}
        <Divider sx={{ my: 3 }} />

        {/* Системная информация */}
        {/* System information */}
        <Typography variant="h6" gutterBottom>
          Системная информация
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Дата создания */}
          {/* Creation date */}
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Дата регистрации
            </Typography>
            <Typography variant="body1">
              {formatDate(user.createdAt)}
            </Typography>
          </Grid>

          {/* Последнее обновление */}
          {/* Last update */}
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Последнее обновление
            </Typography>
            <Typography variant="body1">
              {formatDate(user.updatedAt)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Информационное сообщение */}
      {/* Information message */}
      <Paper elevation={1} sx={{ padding: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Примечание:</strong> Функции редактирования профиля и смены пароля будут
          доступны в следующих этапах разработки.
        </Typography>
      </Paper>
    </Container>
  );
}

// Экспорт компонента по умолчанию
// Export component as default
export default ProfilePage;

/**
 * ТЕСТЫ для ProfilePage.tsx
 *
 * Тест 1: ProfilePage рендерится без ошибок
 * - Создать тестовый рендер ProfilePage
 * - Проверить отсутствие ошибок
 *
 * Тест 2: Отображается аватар с инициалами
 * - Установить user в store
 * - Проверить наличие аватара с правильными инициалами
 *
 * Тест 3: Отображается полное имя пользователя
 * - Проверить наличие firstName, middleName, lastName
 *
 * Тест 4: Отображается роль пользователя
 * - Проверить наличие Chip с ролью
 *
 * Тест 5: Отображается статус блокировки
 * - Установить user.isBlocked = true
 * - Проверить наличие Chip "Заблокирован"
 *
 * Тест 6: Личная информация отображается корректно
 * - Проверить отображение всех полей личной информации
 *
 * Тест 7: Системная информация отображается
 * - Проверить отображение даты регистрации и обновления
 *
 * Тест 8: Кнопки действий disabled
 * - Проверить что кнопки "Редактировать" и "Сменить пароль" disabled
 *
 * Тест 9: Форматирование дат работает
 * - Проверить что даты отображаются в читаемом формате
 *
 * Тест 10: Опциональные поля показывают "Не указано"
 * - Установить опциональные поля в undefined
 * - Проверить отображение "Не указано"
 */
