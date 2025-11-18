/**
 * Файл: pages/HomePage.tsx
 * Описание: Главная страница приложения
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
  Card,
  CardContent,
  CardActions,
  Button
} from '@mui/material';

// Импорт иконок MUI
// Import MUI icons
import {
  EmojiEvents as CompetitionsIcon,
  People as AthletesIcon,
  Assessment as StatsIcon
} from '@mui/icons-material';

// Импорт компонента Link
// Import Link component
import { Link as RouterLink } from 'react-router-dom';

// Импорт auth store
// Import auth store
import { useAuthStore } from '../store';

/**
 * HomePage - главная страница приложения
 * HomePage - application home page
 */
function HomePage() {
  // Получаем пользователя из store
  // Get user from store
  const { user } = useAuthStore();

  return (
    // Контейнер страницы / Page container
    <Container maxWidth="lg">
      {/* Приветствие пользователя */}
      {/* User greeting */}
      <Paper
        elevation={2}
        sx={{
          padding: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Добро пожаловать, {user?.firstName}!
        </Typography>
        <Typography variant="h6">
          Система управления соревнованиями по художественной гимнастике
        </Typography>
      </Paper>

      {/* Сетка с карточками быстрого доступа */}
      {/* Grid with quick access cards */}
      <Grid container spacing={3}>
        {/* Карточка "Соревнования" */}
        {/* "Competitions" card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              {/* Иконка */}
              {/* Icon */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CompetitionsIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>

              {/* Заголовок */}
              {/* Title */}
              <Typography gutterBottom variant="h5" component="h2" align="center">
                Соревнования
              </Typography>

              {/* Описание */}
              {/* Description */}
              <Typography align="center" color="text.secondary">
                Просмотр, создание и управление соревнованиями
              </Typography>
            </CardContent>

            {/* Действия */}
            {/* Actions */}
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button
                component={RouterLink}
                to="/competitions"
                variant="contained"
                size="large"
              >
                Перейти
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Карточка "Спортсменки" */}
        {/* "Athletes" card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              {/* Иконка */}
              {/* Icon */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <AthletesIcon sx={{ fontSize: 60, color: 'secondary.main' }} />
              </Box>

              {/* Заголовок */}
              {/* Title */}
              <Typography gutterBottom variant="h5" component="h2" align="center">
                Спортсменки
              </Typography>

              {/* Описание */}
              {/* Description */}
              <Typography align="center" color="text.secondary">
                Управление профилями спортсменок
              </Typography>
            </CardContent>

            {/* Действия */}
            {/* Actions */}
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button variant="outlined" size="large" disabled>
                Скоро
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Карточка "Статистика" */}
        {/* "Statistics" card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              {/* Иконка */}
              {/* Icon */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <StatsIcon sx={{ fontSize: 60, color: 'success.main' }} />
              </Box>

              {/* Заголовок */}
              {/* Title */}
              <Typography gutterBottom variant="h5" component="h2" align="center">
                Статистика
              </Typography>

              {/* Описание */}
              {/* Description */}
              <Typography align="center" color="text.secondary">
                Аналитика и отчеты по соревнованиям
              </Typography>
            </CardContent>

            {/* Действия */}
            {/* Actions */}
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button variant="outlined" size="large" disabled>
                Скоро
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Информация о роли пользователя */}
      {/* User role information */}
      <Paper elevation={1} sx={{ padding: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Информация о пользователе
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Имя:</strong> {user?.firstName} {user?.lastName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Email:</strong> {user?.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Роль:</strong> {user?.role}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Организация:</strong> {user?.organization || 'Не указана'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

// Экспорт компонента по умолчанию
// Export component as default
export default HomePage;

/**
 * ТЕСТЫ для HomePage.tsx
 *
 * Тест 1: HomePage рендерится без ошибок
 * - Создать тестовый рендер HomePage
 * - Проверить отсутствие ошибок
 *
 * Тест 2: Отображается приветствие с именем пользователя
 * - Установить user в store
 * - Проверить что имя отображается в приветствии
 *
 * Тест 3: Все три карточки отображаются
 * - Проверить наличие карточек Соревнования, Спортсменки, Статистика
 *
 * Тест 4: Кнопка "Соревнования" ведет на /competitions
 * - Проверить что кнопка имеет правильный путь
 *
 * Тест 5: Информация о пользователе отображается
 * - Проверить отображение имени, email, роли
 *
 * Тест 6: Недоступные функции помечены как "Скоро"
 * - Проверить что кнопки Спортсменки и Статистика disabled
 */
