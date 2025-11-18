import { Router } from 'express';
import userRoutes from './user.routes';
import competitionRoutes from './competition.routes';
import athleteRoutes from './athlete.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/competitions', competitionRoutes);
router.use('/athletes', athleteRoutes);

export default router;
