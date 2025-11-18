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
  Grid,
} from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { RegisterData } from '../types/user.types';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterData & { confirmPassword: string }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData & { confirmPassword: string }) => {
    const { confirmPassword, ...registerData } = data;
    try {
      await registerUser(registerData);
      navigate('/login');
    } catch (err) {
      // Error handled in store
    }
  };

  useEffect(() => {
    clearError();
  }, [clearError]);

  return (
    <Container component="main" maxWidth="md">
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
            Регистрация
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Имя"
                  {...register('firstName', { required: 'Обязательное поле' })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Фамилия"
                  {...register('lastName', { required: 'Обязательное поле' })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  {...register('email', {
                    required: 'Обязательное поле',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Неверный формат email',
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Имя пользователя"
                  {...register('username', {
                    required: 'Обязательное поле',
                    minLength: {
                      value: 3,
                      message: 'Минимум 3 символа',
                    },
                  })}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Пароль"
                  type="password"
                  {...register('password', {
                    required: 'Обязательное поле',
                    minLength: {
                      value: 6,
                      message: 'Минимум 6 символов',
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Подтверждение пароля"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Обязательное поле',
                    validate: (value) => value === password || 'Пароли не совпадают',
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Страна"
                  {...register('country')}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Город"
                  {...register('city')}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Организация"
                  {...register('organization')}
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Уже есть аккаунт? Войти
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
