/**
 * Файл: components/Layout.tsx
 * Описание: Основной layout компонент с навигацией и header
 * Автор: Claude Code
 * Дата создания: 18.11.2025
 * Последнее изменение: 18.11.2025
 * Зависимости: react-router-dom, @mui/material, store
 */

// Импорт React
// Import React
import { useState } from 'react';

// Импорт компонентов маршрутизации
// Import routing components
import { Outlet, useNavigate, Link } from 'react-router-dom';

// Импорт компонентов MUI
// Import MUI components
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Импорт иконок MUI
// Import MUI icons
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  EmojiEvents as CompetitionsIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

// Импорт auth store
// Import auth store
import { useAuthStore } from '../store';

/**
 * Ширина боковой панели / Drawer width
 */
const DRAWER_WIDTH = 240;

/**
 * Layout - основной компонент разметки приложения
 * Layout - main application layout component
 */
function Layout() {
  // Получаем тему и проверяем мобильное устройство
  // Get theme and check mobile device
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Получаем navigate для программной навигации
  // Get navigate for programmatic navigation
  const navigate = useNavigate();

  // Получаем пользователя и logout из store
  // Get user and logout from store
  const { user, logout } = useAuthStore();

  // Состояние открытия бокового меню (для мобильных)
  // State for drawer opening (for mobile)
  const [mobileOpen, setMobileOpen] = useState(false);

  // Состояние меню профиля
  // State for profile menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  /**
   * Переключение мобильного меню
   * Toggle mobile menu
   */
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /**
   * Открытие меню профиля
   * Open profile menu
   */
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Закрытие меню профиля
   * Close profile menu
   */
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Переход в профиль
   * Navigate to profile
   */
  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate('/profile');
  };

  /**
   * Обработчик выхода
   * Logout handler
   */
  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  /**
   * Пункты меню навигации
   * Navigation menu items
   */
  const menuItems = [
    { text: 'Главная', icon: <HomeIcon />, path: '/' },
    { text: 'Соревнования', icon: <CompetitionsIcon />, path: '/competitions' }
  ];

  /**
   * Содержимое бокового меню
   * Drawer content
   */
  const drawer = (
    <Box>
      {/* Заголовок бокового меню */}
      {/* Drawer header */}
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Gymnastics
        </Typography>
      </Toolbar>

      {/* Разделитель */}
      {/* Divider */}
      <Divider />

      {/* Список пунктов меню */}
      {/* Menu items list */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={() => isMobile && setMobileOpen(false)}
            >
              {/* Иконка пункта меню */}
              {/* Menu item icon */}
              <ListItemIcon>{item.icon}</ListItemIcon>

              {/* Текст пункта меню */}
              {/* Menu item text */}
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    // Контейнер для всего layout / Container for entire layout
    <Box sx={{ display: 'flex' }}>
      {/* Верхняя панель приложения */}
      {/* Application top bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` }
        }}
      >
        <Toolbar>
          {/* Кнопка меню для мобильных устройств */}
          {/* Menu button for mobile devices */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Заголовок приложения */}
          {/* Application title */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Система управления соревнованиями
          </Typography>

          {/* Имя пользователя */}
          {/* User name */}
          {user && (
            <Typography variant="body1" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
              {user.firstName} {user.lastName}
            </Typography>
          )}

          {/* Аватар пользователя с меню */}
          {/* User avatar with menu */}
          <IconButton
            onClick={handleProfileMenuOpen}
            size="small"
            aria-controls={isMenuOpen ? 'profile-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={isMenuOpen ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user?.firstName[0]}{user?.lastName[0]}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Меню профиля */}
      {/* Profile menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
      >
        {/* Пункт меню - Профиль */}
        {/* Menu item - Profile */}
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Профиль
        </MenuItem>

        {/* Разделитель */}
        {/* Divider */}
        <Divider />

        {/* Пункт меню - Выход */}
        {/* Menu item - Logout */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Выход
        </MenuItem>
      </Menu>

      {/* Боковое меню */}
      {/* Side drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Временное боковое меню для мобильных */}
        {/* Temporary drawer for mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH }
          }}
        >
          {drawer}
        </Drawer>

        {/* Постоянное боковое меню для десктопа */}
        {/* Permanent drawer for desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Основной контент */}
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8
        }}
      >
        {/* Outlet для рендера дочерних маршрутов */}
        {/* Outlet for rendering child routes */}
        <Outlet />
      </Box>
    </Box>
  );
}

// Экспорт компонента по умолчанию
// Export component as default
export default Layout;

/**
 * ТЕСТЫ для Layout.tsx
 *
 * Тест 1: Layout рендерится без ошибок
 * - Создать тестовый рендер Layout
 * - Проверить отсутствие ошибок
 *
 * Тест 2: AppBar отображает заголовок
 * - Проверить наличие текста "Система управления соревнованиями"
 *
 * Тест 3: Отображается имя пользователя
 * - Установить user в store
 * - Проверить что имя и фамилия отображаются
 *
 * Тест 4: Аватар отображает инициалы
 * - Установить user с firstName='Иван', lastName='Петров'
 * - Проверить что аватар содержит 'ИП'
 *
 * Тест 5: Мобильное меню открывается/закрывается
 * - Кликнуть на кнопку меню
 * - Проверить что Drawer открыт
 * - Кликнуть еще раз
 * - Проверить что Drawer закрыт
 *
 * Тест 6: Меню профиля открывается по клику на аватар
 * - Кликнуть на аватар
 * - Проверить что меню открылось
 *
 * Тест 7: Клик на "Профиль" перенаправляет на /profile
 * - Открыть меню профиля
 * - Кликнуть "Профиль"
 * - Проверить navigate вызван с '/profile'
 *
 * Тест 8: Клик на "Выход" вызывает logout
 * - Открыть меню профиля
 * - Кликнуть "Выход"
 * - Проверить что logout вызван
 * - Проверить navigate вызван с '/login'
 *
 * Тест 9: Пункты меню отображаются корректно
 * - Проверить наличие "Главная" и "Соревнования"
 *
 * Тест 10: Outlet рендерит дочерние маршруты
 * - Проверить наличие компонента Outlet
 */
