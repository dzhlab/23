import { useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import { LoginData } from '../types/user.types';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login, isLoading, error, clearError } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginData) => {
    try {
      await login(data);
      toast.success('Вход выполнен успешно!');
      navigate('/', { replace: true });
    } catch (err) {
      // Error handled in store
    }
  };

  useEffect(() => {
    clearError();
  }, [clearError]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Вход в систему
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="emailOrUsername"
              label="Email или имя пользователя"
              autoComplete="username"
              autoFocus
              {...register('emailOrUsername', {
                required: 'Это поле обязательно',
              })}
              error={!!errors.emailOrUsername}
              helperText={errors.emailOrUsername?.message}
              disabled={isLoading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password', {
                required: 'Это поле обязательно',
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/register" variant="body2">
                Нет аккаунта? Зарегистрироваться
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
