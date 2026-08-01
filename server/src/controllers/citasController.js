import { pool } from '../config/db.js';

const SELECT_BASE = `
  SELECT
    cit.cit_id AS id, cit.cit_fecha AS fecha, cit.cit_hora AS hora,
    cit.cit_modalidad AS modalidad, cit.cit_estatus AS estatus,
    tco.tco_nombre AS tipoConsulta,
    perPac.per_nombre AS pacienteNombre, perPac.per_apellido_paterno AS pacienteApellido,
    pac.pac_id AS pacienteId,
    perDoc.per_nombre AS medicoNombre, perDoc.per_apellido_paterno AS medicoApellido,
    doc.doc_id AS doctorId
  FROM T_CITA cit
  JOIN C_TIPO_CONSULTA tco ON tco.tco_id = cit.cit_tco_id
  JOIN T_PERFIL_PACIENTE pac ON pac.pac_id = cit.cit_pac_id
  JOIN T_PERSONA perPac ON perPac.per_id = pac.pac_per_id
  JOIN T_PERFIL_MEDICO doc ON doc.doc_id = cit.cit_doc_id
  JOIN T_PERSONA perDoc ON perDoc.per_id = doc.doc_per_id
`;

function mapCitaRow(r) {
  return {
    id: r.id,
    fecha: r.fecha.toISOString().slice(0, 10),
    hora: r.hora.slice(0, 5),
    modalidad: r.modalidad,
    estatus: r.estatus,
    tipoConsulta: r.tipoConsulta,
    paciente: `${r.pacienteNombre} ${r.pacienteApellido}`,
    pacienteId: r.pacienteId,
    medico: `Dr. ${r.medicoNombre} ${r.medicoApellido}`,
    doctorId: r.doctorId,
  };
}

// GET /api/pacientes/:id/citas?mes=YYYY-MM
export const getCitasPaciente = async (req, res) => {
  const { id } = req.params;
  const { mes } = req.query; // 'YYYY-MM'

  if (req.user.rol === 'paciente' && String(req.user.pacienteId) !== String(id)) {
    return res.status(403).json({ message: 'No tienes permiso para ver estas citas' });
  }

  try {
    const [rows] = await pool.query(
      `${SELECT_BASE} WHERE cit.cit_pac_id = ? AND DATE_FORMAT(cit.cit_fecha, '%Y-%m') = ? ORDER BY cit.cit_fecha, cit.cit_hora`,
      [id, mes]
    );
    return res.json(rows.map(mapCitaRow));
  } catch (error) {
    console.error('[getCitasPaciente] error:', error);
    return res.status(500).json({ message: 'Error al obtener las citas' });
  }
};

// GET /api/medicos/:id/citas?mes=YYYY-MM
export const getCitasMedico = async (req, res) => {
  const { id } = req.params;
  const { mes } = req.query;

  if (req.user.rol === 'medico' && String(req.user.doctorId) !== String(id)) {
    return res.status(403).json({ message: 'No tienes permiso para ver esta agenda' });
  }

  try {
    const [rows] = await pool.query(
      `${SELECT_BASE} WHERE cit.cit_doc_id = ? AND DATE_FORMAT(cit.cit_fecha, '%Y-%m') = ? ORDER BY cit.cit_fecha, cit.cit_hora`,
      [id, mes]
    );
    return res.json(rows.map(mapCitaRow));
  } catch (error) {
    console.error('[getCitasMedico] error:', error);
    return res.status(500).json({ message: 'Error al obtener la agenda' });
  }
};

// GET /api/clinica/citas?mes=YYYY-MM  (secretaria: todas las citas de la clínica)
export const getCitasClinica = async (req, res) => {
  const { mes } = req.query;

  try {
    const [rows] = await pool.query(
      `${SELECT_BASE} WHERE DATE_FORMAT(cit.cit_fecha, '%Y-%m') = ? ORDER BY cit.cit_fecha, cit.cit_hora`,
      [mes]
    );
    return res.json(rows.map(mapCitaRow));
  } catch (error) {
    console.error('[getCitasClinica] error:', error);
    return res.status(500).json({ message: 'Error al obtener la agenda de la clínica' });
  }
};

// GET /api/medicos  (listado simple para el selector del modal de nueva cita)
export const getMedicos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT doc.doc_id AS id, CONCAT('Dr. ', per.per_nombre, ' ', per.per_apellido_paterno) AS nombre, doc.doc_especialidad AS especialidad
       FROM T_PERFIL_MEDICO doc
       JOIN T_PERSONA per ON per.per_id = doc.doc_per_id
       WHERE per.per_estatus = TRUE
       ORDER BY per.per_nombre`
    );
    return res.json(rows);
  } catch (error) {
    console.error('[getMedicos] error:', error);
    return res.status(500).json({ message: 'Error al obtener médicos' });
  }
};

// GET /api/tipos-consulta  (catálogo para el selector del modal)
export const getTiposConsulta = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT tco_id AS id, tco_nombre AS nombre FROM C_TIPO_CONSULTA ORDER BY tco_nombre');
    return res.json(rows);
  } catch (error) {
    console.error('[getTiposConsulta] error:', error);
    return res.status(500).json({ message: 'Error al obtener tipos de consulta' });
  }
};

// POST /api/citas
// POST /api/citas
// POST /api/citas
export const crearCita = async (req, res) => {
  let { pacienteId, doctorId, tipoConsultaId, fecha, hora, modalidad } = req.body;

  if (req.user.rol === 'paciente') {
    pacienteId = req.user.pacienteId;
  }
  if (req.user.rol === 'medico') {
    doctorId = req.user.doctorId;
  }

  if (!pacienteId || !doctorId || !tipoConsultaId || !fecha || !hora) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  //Nuevo: no permitir fechas/horas en el pasado
  const fechaHoraCita = new Date(`${fecha}T${hora}`);
  if (fechaHoraCita < new Date()) {
    return res.status(400).json({ message: 'No puedes agendar una cita en una fecha u hora pasada' });
  }

  try {
    const [result] = await pool.query(  
      `INSERT INTO T_CITA (cit_pac_id, cit_doc_id, cit_tco_id, cit_fecha, cit_hora, cit_modalidad, cit_estatus)
       VALUES (?, ?, ?, ?, ?, ?, 'pendiente')`,
      [pacienteId, doctorId, tipoConsultaId, fecha, hora, modalidad ?? 'presencial']
    );

    const [rows] = await pool.query(`${SELECT_BASE} WHERE cit.cit_id = ?`, [result.insertId]);
    return res.status(201).json(mapCitaRow(rows[0]));
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ese médico ya tiene una cita agendada en ese horario' });
    }
    console.error('[crearCita] error:', error);
    return res.status(500).json({ message: 'Error al crear la cita' });
  }
};

// PATCH /api/citas/:id
export const actualizarEstatusCita = async (req, res) => {
  const { id } = req.params;
  const { estatus } = req.body;

  const ESTATUS_VALIDOS = ['confirmada', 'pendiente', 'cancelada'];
  if (!ESTATUS_VALIDOS.includes(estatus)) {
    return res.status(400).json({ message: 'Estatus inválido' });
  }

  try {
    const [result] = await pool.query('UPDATE T_CITA SET cit_estatus = ? WHERE cit_id = ?', [estatus, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    const [rows] = await pool.query(`${SELECT_BASE} WHERE cit.cit_id = ?`, [id]);
    return res.json(mapCitaRow(rows[0]));
  } catch (error) {
    console.error('[actualizarEstatusCita] error:', error);
    return res.status(500).json({ message: 'Error al actualizar la cita' });
  }
};