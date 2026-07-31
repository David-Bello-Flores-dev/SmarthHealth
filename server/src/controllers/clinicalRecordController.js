import { pool } from '../config/db.js';

// Trae los datos base del paciente + tipo de sangre (usado por ambos endpoints de abajo)
async function obtenerDatosBasePaciente(pacienteId) {
  const [rows] = await pool.query(
    `SELECT
       per.per_id, per.per_nombre, per.per_apellido_paterno, per.per_apellido_materno,
       per.per_fecha_nacimiento,
       pac.pac_id, pac.pac_nss,
       tsan.tip_san_nombre
     FROM T_PERFIL_PACIENTE pac
     JOIN T_PERSONA per ON per.per_id = pac.pac_per_id
     JOIN C_TIPO_SANGUINEO tsan ON tsan.tip_san_id = pac.pac_tip_san_id
     WHERE pac.pac_id = ?`,
    [pacienteId]
  );
  return rows[0] ?? null;
}

async function obtenerAlergias(pacienteId) {
  const [rows] = await pool.query(
    `SELECT ale.ale_nombre
     FROM T_PACIENTE_ALERGIA pal
     JOIN C_ALERGIA ale ON ale.ale_id = pal.pal_ale_id
     WHERE pal.pal_pac_id = ?`,
    [pacienteId]
  );
  return rows.map((r) => r.ale_nombre);
}

async function obtenerPadecimientosCronicos(pacienteId) {
  const [rows] = await pool.query(
    `SELECT pad.pad_nombre, ppa.ppa_nota
     FROM T_PACIENTE_PADECIMIENTO ppa
     JOIN C_PADECIMIENTO pad ON pad.pad_id = ppa.ppa_pad_id
     WHERE ppa.ppa_pac_id = ? AND ppa.ppa_estatus = TRUE`,
    [pacienteId]
  );
  // El front espera strings ya formateados: "Diabetes tipo 2 (seguimiento)"
  return rows.map((r) => (r.ppa_nota ? `${r.pad_nombre} (${r.ppa_nota})` : r.pad_nombre));
}

// Último registro de peso/talla para calcular IMC (el IMC no se guarda, se calcula)
async function obtenerUltimosSignosVitales(pacienteId) {
  const [rows] = await pool.query(
    `SELECT sv_peso_kg, sv_talla_m
     FROM T_SIGNOS_VITALES
     WHERE sv_pac_id = ?
     ORDER BY sv_fecha_registro DESC
     LIMIT 1`,
    [pacienteId]
  );
  return rows[0] ?? { sv_peso_kg: null, sv_talla_m: null };
}

async function obtenerResultadosLaboratorio(pacienteId) {
  const [rows] = await pool.query(
    `SELECT lab_id, lab_nombre_estudio, lab_valor, lab_ref_min, lab_ref_max, lab_ref_unidad, lab_estatus, lab_fecha_toma
     FROM T_RESULTADO_LABORATORIO
     WHERE lab_pac_id = ?
     ORDER BY lab_fecha_toma DESC`,
    [pacienteId]
  );
  return rows;
}

function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const noHaCumplidoEsteAno =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  if (noHaCumplidoEsteAno) edad--;
  return edad;
}

function obtenerIniciales(nombre, apellidoPaterno) {
  return `${nombre[0]}${apellidoPaterno[0]}`.toUpperCase();
}

// GET /api/pacientes/:id/expediente  (vista completa: paciente y médico)
export const getExpediente = async (req, res) => {
  const { id } = req.params;

  // Autorización: un paciente solo puede ver el suyo propio
  if (req.user.rol === 'paciente' && String(req.user.pacienteId) !== String(id)) {
    return res.status(403).json({ message: 'No tienes permiso para ver este expediente' });
  }

  try {
    const base = await obtenerDatosBasePaciente(id);
    if (!base) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    const [alergias, padecimientos, signos, laboratorio] = await Promise.all([
      obtenerAlergias(id),
      obtenerPadecimientosCronicos(id),
      obtenerUltimosSignosVitales(id),
      obtenerResultadosLaboratorio(id),
    ]);

    // Fecha de la toma más reciente entre los resultados (para el header "Última toma")
    const ultimaToma = laboratorio[0]?.lab_fecha_toma ?? null;

    return res.json({
      paciente: {
        nombre: `${base.per_nombre} ${base.per_apellido_paterno} ${base.per_apellido_materno ?? ''}`.trim(),
        iniciales: obtenerIniciales(base.per_nombre, base.per_apellido_paterno),
        fechaNacimiento: base.per_fecha_nacimiento,
        edad: calcularEdad(base.per_fecha_nacimiento),
        tipoSangre: base.tip_san_nombre,
        pesoKg: signos.sv_peso_kg,
        tallaM: signos.sv_talla_m,
        alergias,
      },
      padecimientosCronicos: padecimientos,
      laboratorio: {
        ultimaToma,
        resultados: laboratorio.map((r) => ({
          id: r.lab_id,
          nombre: r.lab_nombre_estudio,
          valor: r.lab_valor,
          refMin: r.lab_ref_min,
          refMax: r.lab_ref_max,
          refUnidad: r.lab_ref_unidad,
          estatus: r.lab_estatus,
        })),
      },
    });
  } catch (error) {
    console.error('[getExpediente] error:', error);
    return res.status(500).json({ message: 'Error al obtener el expediente' });
  }
};

// GET /api/pacientes/:id/expediente-basico  (vista reducida: solo secretaria)
export const getExpedienteBasico = async (req, res) => {
  const { id } = req.params;

  try {
    const base = await obtenerDatosBasePaciente(id);
    if (!base) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    const [alergias, signos, laboratorio] = await Promise.all([
      obtenerAlergias(id),
      obtenerUltimosSignosVitales(id),
      obtenerResultadosLaboratorio(id),
    ]);

    return res.json({
      paciente: {
        nombre: `${base.per_nombre} ${base.per_apellido_paterno} ${base.per_apellido_materno ?? ''}`.trim(),
        iniciales: obtenerIniciales(base.per_nombre, base.per_apellido_paterno),
        fechaNacimiento: base.per_fecha_nacimiento,
        edad: calcularEdad(base.per_fecha_nacimiento),
        tipoSangre: base.tip_san_nombre,
        pesoKg: signos.sv_peso_kg,
        tallaM: signos.sv_talla_m,
        alergias,
      },
      laboratorio: {
        ultimaToma: laboratorio[0]?.lab_fecha_toma ?? null,
        resultados: laboratorio.map((r) => ({
          id: r.lab_id,
          nombre: r.lab_nombre_estudio,
          valor: r.lab_valor,
          refMin: r.lab_ref_min,
          refMax: r.lab_ref_max,
          refUnidad: r.lab_ref_unidad,
          estatus: r.lab_estatus,
        })),
      },
    });
  } catch (error) {
    console.error('[getExpedienteBasico] error:', error);
    return res.status(500).json({ message: 'Error al obtener el expediente' });
  }
};

// GET /api/pacientes?q=texto  (búsqueda simple, usada por secretaria)
// GET /api/medicos/:doctorId/pacientes?q=texto  (búsqueda de médico, misma lógica por ahora)
export const searchPacientes = async (req, res) => {
  const { q = '' } = req.query;

  try {
    const [rows] = await pool.query(
      `SELECT pac.pac_id AS id,
              CONCAT(per.per_nombre, ' ', per.per_apellido_paterno, ' ', IFNULL(per.per_apellido_materno, '')) AS nombre
       FROM T_PERFIL_PACIENTE pac
       JOIN T_PERSONA per ON per.per_id = pac.pac_per_id
       WHERE per.per_estatus = TRUE
         AND (? = '' OR CONCAT(per.per_nombre, ' ', per.per_apellido_paterno, ' ', IFNULL(per.per_apellido_materno, '')) LIKE CONCAT('%', ?, '%'))
       ORDER BY per.per_nombre
       LIMIT 20`,
      [q, q]
    );

    return res.json(rows);
  } catch (error) {
    console.error('[searchPacientes] error:', error);
    return res.status(500).json({ message: 'Error al buscar pacientes' });
  }
};