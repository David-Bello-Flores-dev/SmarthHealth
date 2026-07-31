import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import {
  getExpediente,
  getExpedienteBasico,
  searchPacientes,
} from '../controllers/clinicalRecordController.js';

const router = Router();

router.use(requireAuth); // todas las rutas de este módulo requieren sesión

router.get('/pacientes', requireRole('secretaria', 'medico'), searchPacientes);
router.get('/pacientes/:id/expediente', requireRole('paciente', 'medico'), getExpediente);
router.get('/pacientes/:id/expediente-basico', requireRole('secretaria'), getExpedienteBasico);

export default router;