import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import {
  getCitasPaciente,
  getCitasMedico,
  getCitasClinica,
  getMedicos,
  getTiposConsulta,
  crearCita,
  actualizarEstatusCita,
} from '../controllers/citasController.js';

const router = Router();

router.use(requireAuth);

router.get('/pacientes/:id/citas', requireRole('paciente', 'medico', 'secretaria'), getCitasPaciente);
router.get('/medicos/:id/citas', requireRole('medico', 'secretaria'), getCitasMedico);
router.get('/clinica/citas', requireRole('secretaria'), getCitasClinica);
router.get('/medicos', requireRole('secretaria', 'medico', 'paciente'), getMedicos);
router.get('/tipos-consulta', requireRole('secretaria', 'medico', 'paciente'), getTiposConsulta);
router.post('/citas', requireRole('secretaria', 'medico', 'paciente'), crearCita);
router.patch('/citas/:id', requireRole('secretaria', 'medico'), actualizarEstatusCita);

export default router;