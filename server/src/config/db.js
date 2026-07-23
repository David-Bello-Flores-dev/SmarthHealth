require("dotenv").config(); // Carga las variables del archivo .env
const mysql = require("mysql2");

// Configura tu conexión dinámica leyendo del entorno
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    //database: process.env.DB_NAME,
    
    // 1. CAMBIO CLAVE PARA AZURE: Obligar a usar SSL. 
    // En local con Docker usualmente se ignora si no está configurado, pero Azure te lo exigirá.
    ssl: {
        rejectUnauthorized: false 
    },
    
    // Permite ejecutar múltiples consultas SQL en una sola llamada query()
    multipleStatements: true 
});
// Crear tabla si no existe
db.query(`
  CREATE DATABASE IF NOT EXISTS SmarthHealth;
USE SmarthHealth;

CREATE TABLE IF NOT EXISTS C_SEXO (
    sex_id INT AUTO_INCREMENT NOT NULL,
    sex_nombre VARCHAR(20) NOT NULL,
    CONSTRAINT c_sex_id___pk PRIMARY KEY (sex_id)
);

CREATE TABLE IF NOT EXISTS T_PERSONA (
    per_id INT AUTO_INCREMENT NOT NULL, 
    per_nombre VARCHAR(50) NOT NULL,
    per_apellido_paterno VARCHAR(50) NOT NULL,
    per_apellido_materno VARCHAR(50),
    per_curp VARCHAR(18) UNIQUE,
    per_fecha_nacimiento DATE NOT NULL,
    per_sex_id INT NOT NULL,
    per_fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    per_estatus BOOLEAN DEFAULT TRUE,
    CONSTRAINT t_persona_per_id___pk PRIMARY KEY (per_id),
    CONSTRAINT t_persona_per_sex_id___fk FOREIGN KEY (per_sex_id) REFERENCES C_SEXO (sex_id)
);

CREATE TABLE IF NOT EXISTS T_CONTACTO (
    con_id INT AUTO_INCREMENT NOT NULL,
    con_per_id INT NOT NULL,
    con_email VARCHAR(100),
    con_telefono_primario VARCHAR(15),
    con_telefono_secundario VARCHAR(15),
    CONSTRAINT t_contacto_con_id___pk PRIMARY KEY (con_id),
    CONSTRAINT t_contacto_con_per_id___fk FOREIGN KEY (con_per_id) REFERENCES T_PERSONA (per_id)
);

CREATE TABLE IF NOT EXISTS T_USUARIO (
    usu_id INT AUTO_INCREMENT NOT NULL,
    usu_per_id INT UNIQUE NOT NULL,
    usu_username VARCHAR(50) UNIQUE NOT NULL,
    usu_password VARCHAR(255) NOT NULL, 
    usu_rol VARCHAR(20) NOT NULL,
    CONSTRAINT t_usuario_usu_id___pk PRIMARY KEY (usu_id),
    CONSTRAINT t_usuario_usu_per_id___fk FOREIGN KEY (usu_per_id) REFERENCES T_PERSONA (per_id)
);

CREATE TABLE IF NOT EXISTS T_PERFIL (
    rec_id INT AUTO_INCREMENT NOT NULL,
    rec_per_id INT UNIQUE NOT NULL,
    rec_num_empleado VARCHAR(20) UNIQUE NOT NULL,
    rec_turno VARCHAR(20) NOT NULL,
    CONSTRAINT t_perfil_rec_id___pk PRIMARY KEY (rec_id),
    CONSTRAINT t_perfil_rec_per_id___fk FOREIGN KEY (rec_per_id) REFERENCES sch_central.T_PERSONA (per_id)
);

CREATE TABLE IF NOT EXISTS T_PERFIL (
    doc_id INT AUTO_INCREMENT NOT NULL,
    doc_per_id INT UNIQUE NOT NULL,
    doc_cedula VARCHAR(50) UNIQUE NOT NULL,
    doc_especialidad VARCHAR(100) NOT NULL,
    doc_consultorio VARCHAR(10),
    CONSTRAINT t_perfil_doc_id___pk PRIMARY KEY (doc_id),
    CONSTRAINT t_perfil_doc_per_id___fk FOREIGN KEY (doc_per_id) REFERENCES sch_central.T_PERSONA (per_id)
);

CREATE TABLE IF NOT EXISTS C_TIPO_SANGUINEO (
    tip_san_id INT AUTO_INCREMENT NOT NULL,
    tip_san_nombre VARCHAR(10) NOT NULL,
    CONSTRAINT c_tipo_sanguineo_tip_san_id___pk PRIMARY KEY (tip_san_id)
);

CREATE TABLE IF NOT EXISTS T_PERFIL (
    pac_id INT AUTO_INCREMENT NOT NULL,
    pac_per_id INT UNIQUE NOT NULL,
    pac_tip_san_id INT NOT NULL,
    pac_nss VARCHAR(20) UNIQUE NOT NULL,
    pac_alergias VARCHAR(30) NOT NULL, 
    CONSTRAINT t_perfil_pac_id___pk PRIMARY KEY (pac_id),
    CONSTRAINT t_perfil_pac_per_id___fk FOREIGN KEY (pac_per_id) REFERENCES sch_central.T_PERSONA (per_id),
    CONSTRAINT t_perfil_pac_tip_san_id___fk FOREIGN KEY (pac_tip_san_id) REFERENCES C_TIPO_SANGUINEO (tip_san_id)
);
`);
module.exports = db;

//Administrador: Danna
//Contraseña de Azure DB : SQLDanna#1234