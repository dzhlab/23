import { Router } from 'express';
import { AthleteController } from '../controllers/athlete.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Все маршруты требуют аутентификации
router.use(authenticate);

router.post('/', AthleteController.create);
router.get('/', AthleteController.getAll);
router.get('/:id', AthleteController.getById);
router.get('/user/:userId', AthleteController.getByUserId);
router.patch('/:id', AthleteController.update);
router.delete('/:id', AthleteController.delete);

export default router;
