import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { getRecetasPaciente, crearReceta } from '../controllers/recetasController.js';


const router = Router();

router.use(requireAuth);

router.get('/pacientes/:id/recetas', requireRole('paciente', 'medico'), getRecetasPaciente);
router.post('/pacientes/:id/recetas', requireRole('medico'), crearReceta);

export default router;