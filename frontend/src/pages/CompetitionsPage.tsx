/**
 * Файл: pages/CompetitionsPage.tsx
 * Описание: Страница списка соревнований
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: @mui/material, types
 */

// Импорт компонентов MUI
// Import MUI components
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';

// Импорт иконки Add
// Import Add icon
import { Add as AddIcon } from '@mui/icons-material';

/**
 * CompetitionsPage - страница соревнований
 * CompetitionsPage - competitions page
 */
function CompetitionsPage() {
  return (
    // Контейнер страницы / Page container
    <Container maxWidth="lg">
      {/* Заголовок страницы с кнопкой создания */}
      {/* Page header with create button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
      >
        {/* Заголовок */}
        {/* Title */}
        <Typography variant="h4" component="h1">
          Соревнования
        </Typography>

        {/* Кнопка создания нового соревнования */}
        {/* Create new competition button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
          disabled
        >
          Создать соревнование
        </Button>
      </Box>

      {/* Карточка с информацией */}
      {/* Information card */}
      <Paper
        elevation={2}
        sx={{
          padding: 4,
          textAlign: 'center',
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Заголовок */}
        {/* Title */}
        <Typography variant="h5" gutterBottom>
          Раздел находится в разработке
        </Typography>

        {/* Описание */}
        {/* Description */}
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
          Функционал управления соревнованиями будет доступен в следующих этапах разработки.
        </Typography>

        {/* Список планируемого функционала */}
        {/* List of planned features */}
        <Box sx={{ textAlign: 'left', maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Планируемый функционал:
          </Typography>
          <Typography component="ul" sx={{ pl: 2 }}>
            <li>Просмотр списка соревнований с фильтрацией</li>
            <li>Создание новых соревнований</li>
            <li>Редактирование и удаление соревнований</li>
            <li>Управление регистрацией участников</li>
            <li>Публикация и отмена соревнований</li>
            <li>Просмотр детальной информации</li>
            <li>Статистика и аналитика</li>
          </Typography>
        </Box>
      </Paper>

      {/* Дополнительная информация */}
      {/* Additional information */}
      <Paper elevation={1} sx={{ padding: 3, mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Примечание:</strong> На данном этапе реализована базовая инфраструктура приложения:
          типы данных, API сервисы, управление состоянием, аутентификация и маршрутизация.
          Интерфейс управления соревнованиями будет добавлен в следующих этапах разработки (Stage 5-8).
        </Typography>
      </Paper>
    </Container>
  );
}

// Экспорт компонента по умолчанию
// Export component as default
export default CompetitionsPage;

/**
 * ТЕСТЫ для CompetitionsPage.tsx
 *
 * Тест 1: CompetitionsPage рендерится без ошибок
 * - Создать тестовый рендер CompetitionsPage
 * - Проверить отсутствие ошибок
 *
 * Тест 2: Заголовок страницы отображается
 * - Проверить наличие текста "Соревнования"
 *
 * Тест 3: Кнопка создания отображается
 * - Проверить наличие кнопки "Создать соревнование"
 * - Проверить что кнопка disabled
 *
 * Тест 4: Сообщение о разработке отображается
 * - Проверить наличие текста "находится в разработке"
 *
 * Тест 5: Список планируемого функционала отображается
 * - Проверить наличие списка с функциями
 */
