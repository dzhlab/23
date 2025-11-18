import { Router } from 'express';
import { CompetitionController } from '../controllers/competition.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Все маршруты требуют аутентификации
router.use(authenticate);

router.post('/', CompetitionController.create);
router.get('/', CompetitionController.getAll);
router.get('/:id', CompetitionController.getById);
router.patch('/:id', CompetitionController.update);
router.delete('/:id', CompetitionController.delete);

export default router;
