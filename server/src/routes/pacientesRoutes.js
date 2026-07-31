import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import {
  getResumenPaciente,
  getResumenMedico,
  getResumenRecepcion,
  getPacientesDeMedico,
} from '../controllers/pacientesController.js';

const router = Router();

router.use(requireAuth);

router.get('/pacientes/:id/resumen', requireRole('paciente'), getResumenPaciente);
router.get('/medicos/:id/resumen', requireRole('medico'), getResumenMedico);
router.get('/clinica/resumen-recepcion', requireRole('secretaria'), getResumenRecepcion);
router.get('/medicos/:id/pacientes', requireRole('medico'), getPacientesDeMedico);

export default router;