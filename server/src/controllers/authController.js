import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';
import { signToken } from '../utils/jwt.js';

// Dado el rol, trae el id de perfil correspondiente (pacienteId / doctorId / employeeId).
// El front usa esto para saber "de quién" pedir datos en el resto de los endpoints.
async function obtenerPerfilPorRol(rol, perId) {
  if (rol === 'paciente') {
    const [rows] = await pool.query(
      'SELECT pac_id FROM T_PERFIL_PACIENTE WHERE pac_per_id = ?',
      [perId]
    );
    return { pacienteId: rows[0]?.pac_id ?? null };
  }

  if (rol === 'medico') {
    const [rows] = await pool.query(
      'SELECT doc_id, doc_especialidad, doc_cedula FROM T_PERFIL_MEDICO WHERE doc_per_id = ?',
      [perId]
    );
    return {
      doctorId: rows[0]?.doc_id ?? null,
      especialidad: rows[0]?.doc_especialidad ?? null,
      cedula: rows[0]?.doc_cedula ?? null,
    };
  }

  if (rol === 'secretaria') {
    const [rows] = await pool.query(
      'SELECT emp_id FROM T_PERFIL_EMPLEADO WHERE emp_per_id = ?',
      [perId]
    );
    return { employeeId: rows[0]?.emp_id ?? null };
  }

  return {};
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
  }

  try {
    // usu_username almacena el correo (ver nota de decisión en el README del backend)
    const [rows] = await pool.query(
      `SELECT
         usu.usu_id, usu.usu_password, usu.usu_rol, usu.usu_estatus,
         per.per_id, per.per_nombre, per.per_apellido_paterno
       FROM T_USUARIO usu
       JOIN T_PERSONA per ON per.per_id = usu.usu_per_id
       WHERE usu.usu_username = ?
       LIMIT 1`,
      [email]
    );

    const usuario = rows[0];

    // Mensaje genérico a propósito: no revelar si falló por email o por password
    // (evita que alguien use el login para adivinar qué correos existen).
    if (!usuario) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    if (!usuario.usu_estatus) {
      return res.status(403).json({ message: 'Esta cuenta está deshabilitada' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.usu_password);
    if (!passwordValida) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const perfil = await obtenerPerfilPorRol(usuario.usu_rol, usuario.per_id);

    const nombreCompleto = `${usuario.per_nombre} ${usuario.per_apellido_paterno}`;

    const token = signToken({
      usuarioId: usuario.usu_id,
      perId: usuario.per_id,
      rol: usuario.usu_rol,
      ...perfil,
    });

    return res.status(200).json({
      token,
      user: {
        id: usuario.usu_id,
        nombre: nombreCompleto,
        rol: usuario.usu_rol,
        ...perfil,
      },
    });
  } catch (error) {
    console.error('[login] error:', error);
    return res.status(500).json({ message: 'Error interno al iniciar sesión' });
  }
};

// Endpoint para validar sesión al recargar la página (equivalente a "restaurar sesión"
// que el front ya hace leyendo localStorage — esto la valida contra el servidor).
export const me = async (req, res) => {
  // req.user lo llena el authMiddleware a partir del token
  return res.status(200).json({ user: req.user });
};

// GET /api/auth/perfil — datos completos para el menú de usuario y Configuración
export const getPerfil = async (req, res) => {
  const { perId, rol } = req.user;

  try {
    const [rows] = await pool.query(
      `SELECT
         per.per_nombre, per.per_apellido_paterno, per.per_apellido_materno,
         per.per_fecha_nacimiento, sex.sex_nombre,
         con.con_email, con.con_telefono_primario
       FROM T_PERSONA per
       JOIN C_SEXO sex ON sex.sex_id = per.per_sex_id
       LEFT JOIN T_CONTACTO con ON con.con_per_id = per.per_id
       WHERE per.per_id = ?
       LIMIT 1`,
      [perId]
    );

    const base = rows[0];
    if (!base) return res.status(404).json({ message: 'Perfil no encontrado' });

    const hoy = new Date();
    const nacimiento = new Date(base.per_fecha_nacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    if (hoy.getMonth() < nacimiento.getMonth() || (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    let datosRol = {};
    if (rol === 'medico') {
      const [medRows] = await pool.query(
        'SELECT doc_especialidad, doc_cedula, doc_consultorio FROM T_PERFIL_MEDICO WHERE doc_per_id = ?',
        [perId]
      );
      datosRol = {
        especialidad: medRows[0]?.doc_especialidad ?? null,
        cedula: medRows[0]?.doc_cedula ?? null,
        consultorio: medRows[0]?.doc_consultorio ?? null,
      };
    } else if (rol === 'secretaria') {
      const [empRows] = await pool.query(
        'SELECT emp_num_empleado, emp_turno FROM T_PERFIL_EMPLEADO WHERE emp_per_id = ?',
        [perId]
      );
      datosRol = {
        numEmpleado: empRows[0]?.emp_num_empleado ?? null,
        turno: empRows[0]?.emp_turno ?? null,
      };
    } else if (rol === 'paciente') {
      const [pacRows] = await pool.query(
        `SELECT pac.pac_nss, tsan.tip_san_nombre
         FROM T_PERFIL_PACIENTE pac
         JOIN C_TIPO_SANGUINEO tsan ON tsan.tip_san_id = pac.pac_tip_san_id
         WHERE pac.pac_per_id = ?`,
        [perId]
      );
      datosRol = {
        nss: pacRows[0]?.pac_nss ?? null,
        tipoSangre: pacRows[0]?.tip_san_nombre ?? null,
      };
    }

    return res.json({
      nombreCompleto: `${base.per_nombre} ${base.per_apellido_paterno} ${base.per_apellido_materno ?? ''}`.trim(),
      email: base.con_email,
      telefono: base.con_telefono_primario,
      fechaNacimiento: base.per_fecha_nacimiento,
      edad,
      sexo: base.sex_nombre,
      rol,
      ...datosRol,
    });
  } catch (error) {
    console.error('[getPerfil] error:', error);
    return res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};