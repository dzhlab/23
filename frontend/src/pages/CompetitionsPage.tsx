import { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useCompetitionStore } from '../store/competitionStore';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CompetitionStatus } from '../types/competition.types';

const statusColors: Record<CompetitionStatus, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  [CompetitionStatus.DRAFT]: 'default',
  [CompetitionStatus.REGISTRATION_OPEN]: 'primary',
  [CompetitionStatus.REGISTRATION_CLOSED]: 'warning',
  [CompetitionStatus.IN_PROGRESS]: 'success',
  [CompetitionStatus.COMPLETED]: 'default',
  [CompetitionStatus.CANCELLED]: 'error',
};

const statusLabels: Record<CompetitionStatus, string> = {
  [CompetitionStatus.DRAFT]: 'Черновик',
  [CompetitionStatus.REGISTRATION_OPEN]: 'Регистрация открыта',
  [CompetitionStatus.REGISTRATION_CLOSED]: 'Регистрация закрыта',
  [CompetitionStatus.IN_PROGRESS]: 'В процессе',
  [CompetitionStatus.COMPLETED]: 'Завершено',
  [CompetitionStatus.CANCELLED]: 'Отменено',
};

export default function CompetitionsPage() {
  const { user } = useAuthStore();
  const { competitions, isLoading, error, fetchCompetitions } = useCompetitionStore();

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  const canCreateCompetition = user?.role === 'admin' || user?.role === 'organizer';

  if (isLoading && competitions.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Соревнования
        </Typography>
        {canCreateCompetition && (
          <Button variant="contained" startIcon={<AddIcon />}>
            Создать соревнование
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {competitions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Соревнований пока нет
          </Typography>
          {canCreateCompetition && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Создайте первое соревнование, нажав на кнопку выше
            </Typography>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Уровень</TableCell>
                <TableCell>Дата начала</TableCell>
                <TableCell>Дата окончания</TableCell>
                <TableCell>Место проведения</TableCell>
                <TableCell>Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {competitions.map((competition) => (
                <TableRow
                  key={competition.id}
                  sx={{ '&:hover': { backgroundColor: 'action.hover' }, cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant="subtitle2">{competition.name}</Typography>
                    {competition.description && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {competition.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label={competition.level} size="small" />
                  </TableCell>
                  <TableCell>
                    {format(new Date(competition.startDate), 'dd MMM yyyy', { locale: ru })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(competition.endDate), 'dd MMM yyyy', { locale: ru })}
                  </TableCell>
                  <TableCell>
                    {competition.city}, {competition.country}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[competition.status]}
                      color={statusColors[competition.status]}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
