import { Router } from 'express';
import userRoutes from './user.routes';
import competitionRoutes from './competition.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/competitions', competitionRoutes);

export default router;
