import { pool } from '../config/db.js';

// ---------- GET /api/pacientes/:id/resumen ----------
export const getResumenPaciente = async (req, res) => {
  const { id } = req.params;

  if (req.user.rol === 'paciente' && String(req.user.pacienteId) !== String(id)) {
    return res.status(403).json({ message: 'No tienes permiso para ver este resumen' });
  }

  try {
    const [personaRows] = await pool.query(
      `SELECT per.per_nombre FROM T_PERFIL_PACIENTE pac JOIN T_PERSONA per ON per.per_id = pac.pac_per_id WHERE pac.pac_id = ?`,
      [id]
    );
    if (!personaRows[0]) return res.status(404).json({ message: 'Paciente no encontrado' });

    const [ultimoSigno] = await pool.query(
      `SELECT sv_frecuencia_cardiaca, sv_presion_sistolica, sv_presion_diastolica, sv_temperatura, sv_glucosa
       FROM T_SIGNOS_VITALES WHERE sv_pac_id = ? ORDER BY sv_fecha_registro DESC LIMIT 1`,
      [id]
    );
    const sv = ultimoSigno[0] ?? {};

    // Últimos 6 registros de presión, en orden cronológico ascendente para la gráfica
    const [tendencia] = await pool.query(
      `SELECT sv_fecha_registro, sv_presion_sistolica, sv_presion_diastolica
       FROM T_SIGNOS_VITALES WHERE sv_pac_id = ?
       ORDER BY sv_fecha_registro DESC LIMIT 6`,
      [id]
    );

    const MESES_CORTOS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const tendenciaOrdenada = tendencia.reverse().map((r) => ({
      mes: MESES_CORTOS[new Date(r.sv_fecha_registro).getMonth()],
      sistolica: r.sv_presion_sistolica,
      diastolica: r.sv_presion_diastolica,
    }));

    const [proximasCitas] = await pool.query(
      `SELECT cit.cit_fecha, cit.cit_hora, cit.cit_estatus,
              perDoc.per_nombre AS medNombre, perDoc.per_apellido_paterno AS medApellido, doc.doc_especialidad
       FROM T_CITA cit
       JOIN T_PERFIL_MEDICO doc ON doc.doc_id = cit.cit_doc_id
       JOIN T_PERSONA perDoc ON perDoc.per_id = doc.doc_per_id
       WHERE cit.cit_pac_id = ? AND cit.cit_fecha >= CURDATE() AND cit.cit_estatus != 'cancelada'
       ORDER BY cit.cit_fecha, cit.cit_hora LIMIT 3`,
      [id]
    );

    const calcularEstatusSimple = (valor, min, max) => {
      if (valor == null) return 'normal';
      if (min != null && valor < min) return 'bajo';
      if (max != null && valor > max) return 'elevado';
      return 'normal';
    };

    return res.json({
      paciente: { nombre: personaRows[0].per_nombre },
      signosVitales: {
        frecuenciaCardiaca: { valor: sv.sv_frecuencia_cardiaca, unidad: 'lpm', estatus: calcularEstatusSimple(sv.sv_frecuencia_cardiaca, 60, 100) },
        presionArterial: { sistolica: sv.sv_presion_sistolica, diastolica: sv.sv_presion_diastolica, unidad: 'mmHg', estatus: calcularEstatusSimple(sv.sv_presion_sistolica, 90, 120) },
        temperatura: { valor: sv.sv_temperatura, unidad: '°C', estatus: calcularEstatusSimple(sv.sv_temperatura, 36, 37.5) },
        glucosa: { valor: sv.sv_glucosa, unidad: 'mg/dL', estatus: calcularEstatusSimple(sv.sv_glucosa, 70, 100) },
      },
      tendenciaPresionArterial: tendenciaOrdenada,
      proximasCitas: proximasCitas.map((c) => ({
        medico: `Dr. ${c.medNombre} ${c.medApellido}`,
        especialidad: c.doc_especialidad,
        fechaLabel: new Date(c.cit_fecha).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' }),
        hora: c.cit_hora.slice(0, 5),
        estatus: c.cit_estatus,
      })),
    });
  } catch (error) {
    console.error('[getResumenPaciente] error:', error);
    return res.status(500).json({ message: 'Error al obtener el resumen' });
  }
};

// ---------- GET /api/medicos/:id/resumen ----------
export const getResumenMedico = async (req, res) => {
  const { id } = req.params;

  if (req.user.rol === 'medico' && String(req.user.doctorId) !== String(id)) {
    return res.status(403).json({ message: 'No tienes permiso para ver este resumen' });
  }

  try {
    // Datos del médico
    const [medicoRows] = await pool.query(
      `SELECT per.per_nombre, per.per_apellido_paterno, doc.doc_especialidad
       FROM T_PERFIL_MEDICO doc
       JOIN T_PERSONA per ON per.per_id = doc.doc_per_id
       WHERE doc.doc_id = ?`,
      [id]
    );
    if (!medicoRows[0]) {
      return res.status(404).json({ message: 'Médico no encontrado' });
    }
    const medico = {
      nombre: `Dr. ${medicoRows[0].per_nombre} ${medicoRows[0].per_apellido_paterno}`,
      especialidad: medicoRows[0].doc_especialidad,
    };

    const [[{ pacientesHoy }]] = await pool.query(
      `SELECT COUNT(*) AS pacientesHoy FROM T_CITA WHERE cit_doc_id = ? AND cit_fecha = CURDATE()`, [id]
    );
    const [[{ pacientesHoyAtendidos }]] = await pool.query(
      `SELECT COUNT(*) AS pacientesHoyAtendidos FROM T_CITA WHERE cit_doc_id = ? AND cit_fecha = CURDATE() AND cit_estatus = 'confirmada'`, [id]
    );
    const [[{ citasSemana }]] = await pool.query(
      `SELECT COUNT(*) AS citasSemana FROM T_CITA WHERE cit_doc_id = ? AND YEARWEEK(cit_fecha, 1) = YEARWEEK(CURDATE(), 1)`, [id]
    );
    const [[{ citasSemanaCompletadas }]] = await pool.query(
      `SELECT COUNT(*) AS citasSemanaCompletadas FROM T_CITA WHERE cit_doc_id = ? AND YEARWEEK(cit_fecha, 1) = YEARWEEK(CURDATE(), 1) AND cit_estatus = 'confirmada'`, [id]
    );
    const [[{ recetasEmitidasMes }]] = await pool.query(
      `SELECT COUNT(*) AS recetasEmitidasMes FROM T_RECETA WHERE rec_doc_id = ? AND MONTH(rec_fecha_emision) = MONTH(CURDATE()) AND YEAR(rec_fecha_emision) = YEAR(CURDATE())`, [id]
    );

    const [citasPorDia] = await pool.query(
      `SELECT DAYNAME(cit_fecha) AS dia, cit_estatus,
              CASE WHEN DAYOFWEEK(cit_fecha) = 1 THEN 7 ELSE DAYOFWEEK(cit_fecha) - 1 END AS orden
       FROM T_CITA
       WHERE cit_doc_id = ? AND YEARWEEK(cit_fecha, 1) = YEARWEEK(CURDATE(), 1)`,
      [id]
    );
    const DIAS_LABEL = { Monday: 'Lun', Tuesday: 'Mar', Wednesday: 'Mié', Thursday: 'Jue', Friday: 'Vie', Saturday: 'Sáb', Sunday: 'Dom' };
    const mapaDias = {};
    for (const c of citasPorDia) {
      const label = DIAS_LABEL[c.dia];
      mapaDias[label] ??= { dia: label, agendadas: 0, completadas: 0, orden: c.orden };
      mapaDias[label].agendadas += 1;
      if (c.cit_estatus === 'confirmada') mapaDias[label].completadas += 1;
    }
    const citasPorDiaSemana = Object.values(mapaDias).sort((a, b) => a.orden - b.orden)
      .map(({ dia, agendadas, completadas }) => ({ dia, agendadas, completadas }));

    const [alertasLab] = await pool.query(
      `SELECT lab.lab_id, lab.lab_nombre_estudio, lab.lab_estatus,
              per.per_nombre, per.per_apellido_paterno
       FROM T_RESULTADO_LABORATORIO lab
       JOIN T_PERFIL_PACIENTE pac ON pac.pac_id = lab.lab_pac_id
       JOIN T_PERSONA per ON per.per_id = pac.pac_per_id
       WHERE lab.lab_estatus != 'normal'
         AND lab.lab_fecha_toma >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
         AND lab.lab_pac_id IN (SELECT DISTINCT cit_pac_id FROM T_CITA WHERE cit_doc_id = ?)
       ORDER BY lab.lab_fecha_toma DESC LIMIT 5`,
      [id]
    );
    const [alertasCitas] = await pool.query(
      `SELECT per.per_nombre, per.per_apellido_paterno
       FROM T_CITA cit
       JOIN T_PERFIL_PACIENTE pac ON pac.pac_id = cit.cit_pac_id
       JOIN T_PERSONA per ON per.per_id = pac.pac_per_id
       WHERE cit.cit_doc_id = ? AND cit.cit_estatus = 'cancelada' AND cit.cit_fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       LIMIT 3`,
      [id]
    );

    const alertasClinicas = [
      ...alertasLab.map((a) => ({
        id: `lab-${a.lab_id}`,
        tipo: a.lab_estatus === 'elevado' ? 'critical' : 'warning',
        paciente: `${a.per_nombre} ${a.per_apellido_paterno}`,
        mensaje: `${a.lab_nombre_estudio} fuera de rango`,
      })),
      ...alertasCitas.map((a, i) => ({
        id: `cita-${i}`,
        tipo: 'info',
        paciente: `${a.per_nombre} ${a.per_apellido_paterno}`,
        mensaje: 'Cita cancelada sin reprogramar',
      })),
    ];

    return res.json({
      medico,
      stats: {
        pacientesHoy, pacientesHoyAtendidos, citasSemana, citasSemanaCompletadas,
        recetasEmitidasMes,
        satisfaccionPromedio: 98, // TODO: sin fuente de datos real todavía
      },
      citasPorDiaSemana,
      alertasClinicas,
    });
  } catch (error) {
    console.error('[getResumenMedico] error:', error);
    return res.status(500).json({ message: 'Error al obtener el resumen' });
  }
};

// ---------- GET /api/clinica/resumen-recepcion ----------
export const getResumenRecepcion = async (req, res) => {
  try {
    const [[{ citasHoy }]] = await pool.query(`SELECT COUNT(*) AS citasHoy FROM T_CITA WHERE cit_fecha = CURDATE()`);
    const [[{ confirmadas }]] = await pool.query(`SELECT COUNT(*) AS confirmadas FROM T_CITA WHERE cit_fecha = CURDATE() AND cit_estatus = 'confirmada'`);
    const [[{ pendientes }]] = await pool.query(`SELECT COUNT(*) AS pendientes FROM T_CITA WHERE cit_fecha = CURDATE() AND cit_estatus = 'pendiente'`);
    const [[{ pacientesRegistradosHoy }]] = await pool.query(
      `SELECT COUNT(*) AS pacientesRegistradosHoy FROM T_PERSONA per
       JOIN T_PERFIL_PACIENTE pac ON pac.pac_per_id = per.per_id
       WHERE DATE(per.per_fecha_registro) = CURDATE()`
    );

    const [proximas] = await pool.query(
      `SELECT cit.cit_fecha, cit.cit_hora, cit.cit_estatus,
              perDoc.per_nombre AS medNombre, perDoc.per_apellido_paterno AS medApellido, doc.doc_especialidad
      FROM T_CITA cit
      JOIN T_PERFIL_MEDICO doc ON doc.doc_id = cit.cit_doc_id
      JOIN T_PERSONA perDoc ON perDoc.per_id = doc.doc_per_id
      WHERE cit.cit_fecha >= CURDATE() AND cit.cit_estatus != 'cancelada'
      ORDER BY cit.cit_fecha, cit.cit_hora LIMIT 5`
    );

    return res.json({
      stats: { citasHoy, confirmadas, pendientes, pacientesRegistradosHoy },
      proximasCitas: proximas.map((c) => ({
        medico: `Dr. ${c.medNombre} ${c.medApellido}`,
        especialidad: c.doc_especialidad,
        fechaLabel: new Date(c.cit_fecha).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' }), // 👈 antes: 'Hoy' fijo
        hora: c.cit_hora.slice(0, 5),
        estatus: c.cit_estatus,
      })),
    });
  } catch (error) {
    console.error('[getResumenRecepcion] error:', error);
    return res.status(500).json({ message: 'Error al obtener el resumen' });
  }
};

// ---------- GET /api/medicos/:id/pacientes  (listado completo, sin ?q=) ----------
export const getPacientesDeMedico = async (req, res) => {
  const { id } = req.params;

  try {
    const [pacientes] = await pool.query(
      `SELECT DISTINCT pac.pac_id AS id, per.per_nombre, per.per_apellido_paterno, per.per_fecha_nacimiento
       FROM T_CITA cit
       JOIN T_PERFIL_PACIENTE pac ON pac.pac_id = cit.cit_pac_id
       JOIN T_PERSONA per ON per.per_id = pac.pac_per_id
       WHERE cit.cit_doc_id = ?`,
      [id]
    );

    const calcularEdad = (fecha) => {
      const hoy = new Date();
      const nac = new Date(fecha);
      let edad = hoy.getFullYear() - nac.getFullYear();
      if (hoy.getMonth() < nac.getMonth() || (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate())) edad--;
      return edad;
    };

    const resultado = await Promise.all(pacientes.map(async (p) => {
      const [[ultimaVisitaRow]] = await pool.query(
        `SELECT MAX(cit_fecha) AS ultimaVisita FROM T_CITA WHERE cit_pac_id = ? AND cit_doc_id = ?`,
        [p.id, id]
      );
      const [[padecimientoRow]] = await pool.query(
        `SELECT pad.pad_nombre FROM T_PACIENTE_PADECIMIENTO ppa
         JOIN C_PADECIMIENTO pad ON pad.pad_id = ppa.ppa_pad_id
         WHERE ppa.ppa_pac_id = ? AND ppa.ppa_estatus = TRUE
         ORDER BY ppa.ppa_fecha_diagnostico DESC LIMIT 1`,
        [p.id]
      );
      const [[alertaRow]] = await pool.query(
        `SELECT COUNT(*) AS total FROM T_RESULTADO_LABORATORIO
         WHERE lab_pac_id = ? AND lab_estatus != 'normal' AND lab_fecha_toma >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`,
        [p.id]
      );

      return {
        id: p.id,
        nombre: `${p.per_nombre} ${p.per_apellido_paterno}`,
        edad: calcularEdad(p.per_fecha_nacimiento),
        ultimaVisita: ultimaVisitaRow.ultimaVisita,
        padecimientoPrincipal: padecimientoRow?.pad_nombre ?? 'Sin registro',
        tieneAlerta: alertaRow.total > 0,
      };
    }));

    return res.json(resultado);
  } catch (error) {
    console.error('[getPacientesDeMedico] error:', error);
    return res.status(500).json({ message: 'Error al obtener el listado de pacientes' });
  }
};