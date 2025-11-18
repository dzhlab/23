import { useEffect } from 'react';
import { Routes, Route, Navigate, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CompetitionsPage from './pages/CompetitionsPage';
import { useState } from 'react';

function HomePage() {
  const { user } = useAuthStore();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" gutterBottom>
          Система управления соревнованиями по спортивной гимнастике
        </Typography>
        {user ? (
          <>
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Добро пожаловать, {user.firstName} {user.lastName}!
            </Typography>
            <Typography variant="body1" paragraph>
              Роль: {user.role}
            </Typography>
          </>
        ) : (
          <Typography variant="body1" paragraph>
            Войдите в систему для доступа ко всем возможностям
          </Typography>
        )}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Возможности системы:
        </Typography>
        <ul>
          <li>Регистрация и управление пользователями (14 ролей)</li>
          <li>Создание и управление соревнованиями</li>
          <li>Регистрация спортсменов</li>
          <li>Судейская система по правилам FIG 2025-2028</li>
          <li>Подсчет баллов и формирование рейтингов</li>
        </ul>
      </Box>
    </Container>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { user, logout, initialize, isInitialized } = useAuthStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  if (!isInitialized) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Гимнастика
          </Typography>

          {user && (
            <>
              <Button color="inherit" component={RouterLink} to="/competitions">
                Соревнования
              </Button>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  {user.firstName} {user.lastName}
                </MenuItem>
                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
              </Menu>
            </>
          )}

          {!user && (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Вход
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Регистрация
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/competitions"
            element={
              <ProtectedRoute>
                <CompetitionsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[200],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 Система управления соревнованиями по гимнастике
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
