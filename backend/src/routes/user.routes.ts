import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Публичные маршруты
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Защищенные маршруты
router.get('/me', authenticate, UserController.getMe);
router.get('/:id', authenticate, UserController.getById);
router.get('/', authenticate, UserController.getAll);
router.patch('/:id', authenticate, UserController.update);
router.delete('/:id', authenticate, UserController.delete);

export default router;
