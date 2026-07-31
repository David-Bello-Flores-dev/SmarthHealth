import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';

const USUARIOS_DEMO = [
  {
    persona: { nombre: 'María', apellidoPaterno: 'García', apellidoMaterno: 'López', curp: 'GALM850315MDFRPR01', fechaNacimiento: '1985-03-15', sexId: 2 },
    email: 'maria@smarthealth.com',
    password: '123456',
    rol: 'paciente',
    perfil: { tipoSanguineoId: 1, nss: '12345678901' }, // asume 1 = O+ en C_TIPO_SANGUINEO
  },
  {
    persona: { nombre: 'Andrés', apellidoPaterno: 'Mora', apellidoMaterno: null, curp: 'MOAX800101HDFRRN02', fechaNacimiento: '1980-01-01', sexId: 1 },
    email: 'mora@smarthealth.com',
    password: '123456',
    rol: 'medico',
    perfil: { cedula: '12345678', especialidad: 'Medicina General', consultorio: '204' },
  },
  {
    persona: { nombre: 'Lupita', apellidoPaterno: 'Hernández', apellidoMaterno: null, curp: 'HELU900202MDFRRP03', fechaNacimiento: '1990-02-02', sexId: 2 },
    email: 'recepcion@smarthealth.com',
    password: '123456',
    rol: 'secretaria',
    perfil: { numEmpleado: 'EMP-001', turno: 'Matutino' },
  },
];

async function seed() {
  const connection = await pool.getConnection();

  try {
    for (const u of USUARIOS_DEMO) {
      await connection.beginTransaction();

      const [perResult] = await connection.query(
        `INSERT INTO T_PERSONA (per_nombre, per_apellido_paterno, per_apellido_materno, per_curp, per_fecha_nacimiento, per_sex_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [u.persona.nombre, u.persona.apellidoPaterno, u.persona.apellidoMaterno, u.persona.curp, u.persona.fechaNacimiento, u.persona.sexId]
      );
      const perId = perResult.insertId;

      await connection.query(
        `INSERT INTO T_CONTACTO (con_per_id, con_email) VALUES (?, ?)`,
        [perId, u.email]
      );

      const hash = await bcrypt.hash(u.password, 10);
      await connection.query(
        `INSERT INTO T_USUARIO (usu_per_id, usu_username, usu_password, usu_rol)
         VALUES (?, ?, ?, ?)`,
        [perId, u.email, hash, u.rol]
      );

      if (u.rol === 'paciente') {
        await connection.query(
          `INSERT INTO T_PERFIL_PACIENTE (pac_per_id, pac_tip_san_id, pac_nss) VALUES (?, ?, ?)`,
          [perId, u.perfil.tipoSanguineoId, u.perfil.nss]
        );
      } else if (u.rol === 'medico') {
        await connection.query(
          `INSERT INTO T_PERFIL_MEDICO (doc_per_id, doc_cedula, doc_especialidad, doc_consultorio) VALUES (?, ?, ?, ?)`,
          [perId, u.perfil.cedula, u.perfil.especialidad, u.perfil.consultorio]
        );
      } else if (u.rol === 'secretaria') {
        await connection.query(
          `INSERT INTO T_PERFIL_EMPLEADO (emp_per_id, emp_num_empleado, emp_turno) VALUES (?, ?, ?)`,
          [perId, u.perfil.numEmpleado, u.perfil.turno]
        );
      }

      await connection.commit();
      console.log(` Usuario creado: ${u.email} (${u.rol})`);
    }
  } catch (error) {
    await connection.rollback();
    console.error(' Error en seed:', error.message);
  } finally {
    connection.release();
    process.exit(0);
  }
}

seed();