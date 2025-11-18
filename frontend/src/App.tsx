import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Typography, Box, AppBar, Toolbar, Button } from '@mui/material';

function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" gutterBottom>
          Система управления соревнованиями по спортивной гимнастике
        </Typography>
        <Typography variant="body1" paragraph>
          Добро пожаловать в систему управления соревнованиями!
        </Typography>
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

function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Вход в систему
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Страница входа (в разработке)
        </Typography>
      </Box>
    </Container>
  );
}

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Гимнастика
          </Typography>
          <Button color="inherit" href="/login">
            Вход
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
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
