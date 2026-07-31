import { pool } from '../config/db.js';

async function obtenerMedicamentosDeReceta(recetaId) {
  const [rows] = await pool.query(
    `SELECT rme_id AS id, rme_orden AS orden, rme_nombre AS nombre, rme_dosis AS dosis,
            rme_via AS via, rme_frecuencia AS frecuencia, rme_duracion AS duracion,
            rme_instrucciones AS instrucciones
     FROM T_RECETA_MEDICAMENTO
     WHERE rme_rec_id = ?
     ORDER BY rme_orden`,
    [recetaId]
  );
  return rows;
}

function mapRecetaRow(r) {
  return {
    id: r.rec_folio, // el front usa el folio como "id" visible (RX-2026-001)
    fechaEmision: r.rec_fecha_emision.toISOString().slice(0, 10),
    diagnostico: r.rec_diagnostico,
    medico: {
      nombre: `Dr. ${r.medNombre} ${r.medApellido}`,
      especialidad: r.doc_especialidad,
      cedula: r.doc_cedula,
    },
    paciente: {
      nombre: `${r.pacNombre} ${r.pacApellido}`,
      fechaNacimiento: r.per_fecha_nacimiento.toISOString().slice(0, 10),
    },
  };
}

const SELECT_BASE = `
  SELECT
    rec.rec_id, rec.rec_folio, rec.rec_fecha_emision, rec.rec_diagnostico,
    perMed.per_nombre AS medNombre, perMed.per_apellido_paterno AS medApellido,
    doc.doc_especialidad, doc.doc_cedula,
    perPac.per_nombre AS pacNombre, perPac.per_apellido_paterno AS pacApellido,
    perPac.per_fecha_nacimiento
  FROM T_RECETA rec
  JOIN T_PERFIL_MEDICO doc ON doc.doc_id = rec.rec_doc_id
  JOIN T_PERSONA perMed ON perMed.per_id = doc.doc_per_id
  JOIN T_PERFIL_PACIENTE pac ON pac.pac_id = rec.rec_pac_id
  JOIN T_PERSONA perPac ON perPac.per_id = pac.pac_per_id
`;

// GET /api/pacientes/:id/recetas
export const getRecetasPaciente = async (req, res) => {
  const { id } = req.params;

  if (req.user.rol === 'paciente' && String(req.user.pacienteId) !== String(id)) {
    return res.status(403).json({ message: 'No tienes permiso para ver estas recetas' });
  }

  try {
    const [recetas] = await pool.query(
      `${SELECT_BASE} WHERE rec.rec_pac_id = ? ORDER BY rec.rec_fecha_emision DESC`,
      [id]
    );

    // Trae medicamentos de cada receta en paralelo
    const recetasConMedicamentos = await Promise.all(
      recetas.map(async (r) => ({
        ...mapRecetaRow(r),
        medicamentos: await obtenerMedicamentosDeReceta(r.rec_id),
      }))
    );

    return res.json(recetasConMedicamentos);
  } catch (error) {
    console.error('[getRecetasPaciente] error:', error);
    return res.status(500).json({ message: 'Error al obtener las recetas' });
  }
};

// POST /api/pacientes/:id/recetas
export const crearReceta = async (req, res) => {
  const { id: pacienteId } = req.params;
  const { diagnostico, medicamentos, citaId } = req.body;

  if (!diagnostico?.trim()) {
    return res.status(400).json({ message: 'El diagnóstico es requerido' });
  }
  if (!Array.isArray(medicamentos) || medicamentos.length === 0) {
    return res.status(400).json({ message: 'Debe incluir al menos un medicamento' });
  }
  for (const m of medicamentos) {
    if (!m.nombre?.trim() || !m.dosis?.trim() || !m.frecuencia?.trim() || !m.duracion?.trim()) {
      return res.status(400).json({ message: 'Cada medicamento requiere nombre, dosis, frecuencia y duración' });
    }
  }

  // Solo un médico puede emitir recetas; doctorId sale del token, no del body (nadie puede
  // recetar "a nombre de otro médico" solo cambiando el request).
  const doctorId = req.user.doctorId;
  if (req.user.rol !== 'medico' || !doctorId) {
    return res.status(403).json({ message: 'Solo un médico puede emitir recetas' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Folio: RX-{año}-{consecutivo de 3 dígitos}. Se calcula dentro de la transacción
    // para minimizar (no eliminar del todo) el riesgo de folios duplicados en alta concurrencia.
    // Para garantizarlo al 100% en producción, conviene una tabla de secuencia dedicada.
    const anio = new Date().getFullYear();
    const [conteoRows] = await connection.query(
      `SELECT COUNT(*) AS total FROM T_RECETA WHERE YEAR(rec_fecha_emision) = ?`,
      [anio]
    );
    const consecutivo = String(conteoRows[0].total + 1).padStart(3, '0');
    const folio = `RX-${anio}-${consecutivo}`;

    const [recetaResult] = await connection.query(
      `INSERT INTO T_RECETA (rec_folio, rec_pac_id, rec_doc_id, rec_cit_id, rec_diagnostico, rec_fecha_emision)
       VALUES (?, ?, ?, ?, ?, CURDATE())`,
      [folio, pacienteId, doctorId, citaId ?? null, diagnostico]
    );
    const recetaId = recetaResult.insertId;

    for (let i = 0; i < medicamentos.length; i++) {
      const m = medicamentos[i];
      await connection.query(
        `INSERT INTO T_RECETA_MEDICAMENTO (rme_rec_id, rme_orden, rme_nombre, rme_dosis, rme_via, rme_frecuencia, rme_duracion, rme_instrucciones)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [recetaId, i + 1, m.nombre, m.dosis, m.via ?? 'Oral', m.frecuencia, m.duracion, m.instrucciones ?? null]
      );
    }

    await connection.commit();

    // Regresa la receta completa recién creada, en el mismo shape que el GET
    const [rows] = await connection.query(`${SELECT_BASE} WHERE rec.rec_id = ?`, [recetaId]);
    const medicamentosCreados = await obtenerMedicamentosDeReceta(recetaId);

    return res.status(201).json({ ...mapRecetaRow(rows[0]), medicamentos: medicamentosCreados });
  } catch (error) {
    await connection.rollback();
    console.error('[crearReceta] error:', error);
    return res.status(500).json({ message: 'Error al crear la receta' });
  } finally {
    connection.release();
  }
};