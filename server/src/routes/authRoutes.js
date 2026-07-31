import { Router } from 'express';
import { login, me, getPerfil } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';


const router = Router();

router.post('/login', login);
router.get('/me', requireAuth, me);
router.get('/perfil', requireAuth, getPerfil);

export default router;