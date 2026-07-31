-- =========================================================
-- SmartHealth - Esquema de base de datos
-- Corregido y ampliado a partir del script original.
-- =========================================================

CREATE DATABASE IF NOT EXISTS SmarthHealth;
USE SmarthHealth;

-- =========================================================
-- CATÁLOGOS GENERALES
-- =========================================================

CREATE TABLE IF NOT EXISTS C_SEXO (
    sex_id INT AUTO_INCREMENT NOT NULL,
    sex_nombre VARCHAR(20) NOT NULL,
    CONSTRAINT c_sexo_sex_id___pk PRIMARY KEY (sex_id)
);

CREATE TABLE IF NOT EXISTS C_TIPO_SANGUINEO (
    tip_san_id INT AUTO_INCREMENT NOT NULL,
    tip_san_nombre VARCHAR(10) NOT NULL, -- 'O+', 'A-', etc.
    CONSTRAINT c_tipo_sanguineo_tip_san_id___pk PRIMARY KEY (tip_san_id)
);

-- =========================================================
-- PERSONA / CONTACTO / USUARIO
-- Base de identidad para pacientes, médicos y personal.
-- =========================================================

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

-- Usada por: pages/Login (POST /api/auth/login)
-- usu_rol decide el redirect en LoginForm.jsx (HOME_BY_ROLE) y el allowedRoles de ProtectedRoute.jsx
CREATE TABLE IF NOT EXISTS T_USUARIO (
    usu_id INT AUTO_INCREMENT NOT NULL,
    usu_per_id INT UNIQUE NOT NULL,
    usu_username VARCHAR(50) UNIQUE NOT NULL,
    usu_password VARCHAR(255) NOT NULL, -- guardar SIEMPRE con hash (bcrypt/argon2), nunca texto plano
    usu_rol ENUM('paciente', 'medico', 'secretaria') NOT NULL,
    usu_estatus BOOLEAN DEFAULT TRUE,
    CONSTRAINT t_usuario_usu_id___pk PRIMARY KEY (usu_id),
    CONSTRAINT t_usuario_usu_per_id___fk FOREIGN KEY (usu_per_id) REFERENCES T_PERSONA (per_id)
);

-- =========================================================
-- PERFILES POR ROL
-- Cada rol es una tabla separada (no un T_PERFIL genérico
-- reutilizado), porque cada uno tiene columnas muy distintas.
-- =========================================================

-- Personal administrativo (secretaria/recepción)
CREATE TABLE IF NOT EXISTS T_PERFIL_EMPLEADO (
    emp_id INT AUTO_INCREMENT NOT NULL,
    emp_per_id INT UNIQUE NOT NULL,
    emp_num_empleado VARCHAR(20) UNIQUE NOT NULL,
    emp_turno VARCHAR(20) NOT NULL,
    CONSTRAINT t_perfil_empleado_emp_id___pk PRIMARY KEY (emp_id),
    CONSTRAINT t_perfil_empleado_emp_per_id___fk FOREIGN KEY (emp_per_id) REFERENCES T_PERSONA (per_id)
);

-- Usada por: AppointmentCard.medico, RecetaCard.medico, UpcomingAppointments
CREATE TABLE IF NOT EXISTS T_PERFIL_MEDICO (
    doc_id INT AUTO_INCREMENT NOT NULL,
    doc_per_id INT UNIQUE NOT NULL,
    doc_cedula VARCHAR(50) UNIQUE NOT NULL,
    doc_especialidad VARCHAR(100) NOT NULL, -- ej. 'Medicina General', 'Cardiología'
    doc_consultorio VARCHAR(10),
    CONSTRAINT t_perfil_medico_doc_id___pk PRIMARY KEY (doc_id),
    CONSTRAINT t_perfil_medico_doc_per_id___fk FOREIGN KEY (doc_per_id) REFERENCES T_PERSONA (per_id)
);

-- Usada por: PatientSummaryCard.jsx (tipoSangre, pesoKg, tallaM se acompañan de T_SIGNOS_VITALES para el peso/talla más reciente)
CREATE TABLE IF NOT EXISTS T_PERFIL_PACIENTE (
    pac_id INT AUTO_INCREMENT NOT NULL,
    pac_per_id INT UNIQUE NOT NULL,
    pac_tip_san_id INT NOT NULL,
    pac_nss VARCHAR(20) UNIQUE NOT NULL,
    CONSTRAINT t_perfil_paciente_pac_id___pk PRIMARY KEY (pac_id),
    CONSTRAINT t_perfil_paciente_pac_per_id___fk FOREIGN KEY (pac_per_id) REFERENCES T_PERSONA (per_id),
    CONSTRAINT t_perfil_paciente_pac_tip_san_id___fk FOREIGN KEY (pac_tip_san_id) REFERENCES C_TIPO_SANGUINEO (tip_san_id)
);

-- =========================================================
-- ALERGIAS Y PADECIMIENTOS CRÓNICOS
-- Se separan en catálogo + tabla puente porque un paciente
-- puede tener varias (pac_alergias VARCHAR(30) del script
-- original no soportaba eso).
-- =========================================================

-- Usada por: PatientSummaryCard.jsx -> paciente.alergias (pills rojas)
CREATE TABLE IF NOT EXISTS C_ALERGIA (
    ale_id INT AUTO_INCREMENT NOT NULL,
    ale_nombre VARCHAR(50) NOT NULL UNIQUE, -- 'Penicilina', 'Sulfas'...
    CONSTRAINT c_alergia_ale_id___pk PRIMARY KEY (ale_id)
);

CREATE TABLE IF NOT EXISTS T_PACIENTE_ALERGIA (
    pal_id INT AUTO_INCREMENT NOT NULL,
    pal_pac_id INT NOT NULL,
    pal_ale_id INT NOT NULL,
    pal_fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT t_paciente_alergia_pal_id___pk PRIMARY KEY (pal_id),
    CONSTRAINT t_paciente_alergia_pal_pac_id___fk FOREIGN KEY (pal_pac_id) REFERENCES T_PERFIL_PACIENTE (pac_id),
    CONSTRAINT t_paciente_alergia_pal_ale_id___fk FOREIGN KEY (pal_ale_id) REFERENCES C_ALERGIA (ale_id),
    CONSTRAINT t_paciente_alergia___uq UNIQUE (pal_pac_id, pal_ale_id)
);

-- Usada por: ChronicConditions.jsx (pills azules "Hipertensión arterial controlada", etc.)
CREATE TABLE IF NOT EXISTS C_PADECIMIENTO (
    pad_id INT AUTO_INCREMENT NOT NULL,
    pad_nombre VARCHAR(100) NOT NULL UNIQUE, -- 'Hipertensión arterial', 'Diabetes tipo 2'
    CONSTRAINT c_padecimiento_pad_id___pk PRIMARY KEY (pad_id)
);

CREATE TABLE IF NOT EXISTS T_PACIENTE_PADECIMIENTO (
    ppa_id INT AUTO_INCREMENT NOT NULL,
    ppa_pac_id INT NOT NULL,
    ppa_pad_id INT NOT NULL,
    ppa_nota VARCHAR(100), -- ej. 'controlada', 'en seguimiento' -> se concatena en el front: "{padecimiento} ({nota})"
    ppa_fecha_diagnostico DATE,
    ppa_estatus BOOLEAN DEFAULT TRUE, -- FALSE = ya resuelto, no debe salir en el expediente activo
    CONSTRAINT t_paciente_padecimiento_ppa_id___pk PRIMARY KEY (ppa_id),
    CONSTRAINT t_paciente_padecimiento_ppa_pac_id___fk FOREIGN KEY (ppa_pac_id) REFERENCES T_PERFIL_PACIENTE (pac_id),
    CONSTRAINT t_paciente_padecimiento_ppa_pad_id___fk FOREIGN KEY (ppa_pad_id) REFERENCES C_PADECIMIENTO (pad_id)
);

-- =========================================================
-- SIGNOS VITALES (historial)
-- Es tabla de HISTORIAL, no un solo registro por paciente:
-- - El más reciente alimenta las 4 tarjetas de Resumen.jsx (VitalsCards)
-- - Los últimos 6 registros de presión alimentan BloodPressureChart.jsx
-- - peso/talla más recientes alimentan el IMC en PatientSummaryCard.jsx
-- =========================================================

CREATE TABLE IF NOT EXISTS T_SIGNOS_VITALES (
    sv_id INT AUTO_INCREMENT NOT NULL,
    sv_pac_id INT NOT NULL,
    sv_fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sv_frecuencia_cardiaca INT,        -- lpm
    sv_presion_sistolica INT,          -- mmHg
    sv_presion_diastolica INT,         -- mmHg
    sv_temperatura DECIMAL(4,1),       -- °C
    sv_glucosa INT,                    -- mg/dL
    sv_peso_kg DECIMAL(5,2),
    sv_talla_m DECIMAL(3,2),
    sv_registrado_por INT,             -- FK a T_USUARIO, quién lo capturó (médico/enfermería)
    CONSTRAINT t_signos_vitales_sv_id___pk PRIMARY KEY (sv_id),
    CONSTRAINT t_signos_vitales_sv_pac_id___fk FOREIGN KEY (sv_pac_id) REFERENCES T_PERFIL_PACIENTE (pac_id),
    CONSTRAINT t_signos_vitales_sv_registrado_por___fk FOREIGN KEY (sv_registrado_por) REFERENCES T_USUARIO (usu_id)
);

-- =========================================================
-- RESULTADOS DE LABORATORIO
-- Usada por: LabResults.jsx
-- =========================================================

CREATE TABLE IF NOT EXISTS T_RESULTADO_LABORATORIO (
    lab_id INT AUTO_INCREMENT NOT NULL,
    lab_pac_id INT NOT NULL,
    lab_nombre_estudio VARCHAR(100) NOT NULL, -- 'Glucosa en ayunas', 'HbA1c'...
    lab_valor VARCHAR(20) NOT NULL,           -- se guarda como texto: '108 mg/dL', '6.8%' (LabResults.jsx lo muestra tal cual)
    lab_ref_min DECIMAL(6,2),
    lab_ref_max DECIMAL(6,2),
    lab_ref_unidad VARCHAR(15),
    lab_estatus ENUM('normal', 'elevado', 'bajo') NOT NULL, -- calcularlo en backend al insertar, no en el front
    lab_fecha_toma DATE NOT NULL,
    CONSTRAINT t_resultado_laboratorio_lab_id___pk PRIMARY KEY (lab_id),
    CONSTRAINT t_resultado_laboratorio_lab_pac_id___fk FOREIGN KEY (lab_pac_id) REFERENCES T_PERFIL_PACIENTE (pac_id)
);

-- =========================================================
-- CITAS
-- Usada por: MisCitas.jsx (calendario) y UpcomingAppointments.jsx (Resumen)
-- =========================================================

CREATE TABLE IF NOT EXISTS C_TIPO_CONSULTA (
    tco_id INT AUTO_INCREMENT NOT NULL,
    tco_nombre VARCHAR(50) NOT NULL, -- 'Consulta general', 'Seguimiento', 'Revisión anual'
    CONSTRAINT c_tipo_consulta_tco_id___pk PRIMARY KEY (tco_id)
);

-- Usada por: AppointmentCard.jsx -> cita.modalidad ('presencial' | 'videollamada')
CREATE TABLE IF NOT EXISTS T_CITA (
    cit_id INT AUTO_INCREMENT NOT NULL,
    cit_pac_id INT NOT NULL,
    cit_doc_id INT NOT NULL,
    cit_tco_id INT NOT NULL,
    cit_fecha DATE NOT NULL,           -- CalendarMonth.jsx agrupa por esta columna (dateKey)
    cit_hora TIME NOT NULL,
    cit_modalidad ENUM('presencial', 'videollamada') NOT NULL DEFAULT 'presencial',
    cit_estatus ENUM('confirmada', 'pendiente', 'cancelada') NOT NULL DEFAULT 'pendiente',
    cit_notas VARCHAR(255),
    cit_fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT t_cita_cit_id___pk PRIMARY KEY (cit_id),
    CONSTRAINT t_cita_cit_pac_id___fk FOREIGN KEY (cit_pac_id) REFERENCES T_PERFIL_PACIENTE (pac_id),
    CONSTRAINT t_cita_cit_doc_id___fk FOREIGN KEY (cit_doc_id) REFERENCES T_PERFIL_MEDICO (doc_id),
    CONSTRAINT t_cita_cit_tco_id___fk FOREIGN KEY (cit_tco_id) REFERENCES C_TIPO_CONSULTA (tco_id),
    CONSTRAINT t_cita___no_doble_cita UNIQUE (cit_doc_id, cit_fecha, cit_hora) -- evita que 2 pacientes agarren el mismo horario con el mismo médico
);

-- =========================================================
-- RECETAS Y MEDICAMENTOS
-- Usada por: RecetasMedicas.jsx / RecetaCard.jsx / MedicationsList.jsx
-- =========================================================

CREATE TABLE IF NOT EXISTS T_RECETA (
    rec_id INT AUTO_INCREMENT NOT NULL,
    rec_folio VARCHAR(20) UNIQUE NOT NULL, -- 'RX-2026-001', mostrado en RecetaTabs.jsx y el folio del RecetaCard
    rec_pac_id INT NOT NULL,
    rec_doc_id INT NOT NULL,
    rec_cit_id INT,                        -- opcional: a qué cita quedó ligada la receta
    rec_diagnostico VARCHAR(255) NOT NULL,
    rec_fecha_emision DATE NOT NULL,
    CONSTRAINT t_receta_rec_id___pk PRIMARY KEY (rec_id),
    CONSTRAINT t_receta_rec_pac_id___fk FOREIGN KEY (rec_pac_id) REFERENCES T_PERFIL_PACIENTE (pac_id),
    CONSTRAINT t_receta_rec_doc_id___fk FOREIGN KEY (rec_doc_id) REFERENCES T_PERFIL_MEDICO (doc_id),
    CONSTRAINT t_receta_rec_cit_id___fk FOREIGN KEY (rec_cit_id) REFERENCES T_CITA (cit_id)
);

CREATE TABLE IF NOT EXISTS T_RECETA_MEDICAMENTO (
    rme_id INT AUTO_INCREMENT NOT NULL,
    rme_rec_id INT NOT NULL,
    rme_orden INT NOT NULL DEFAULT 1,      -- controla el número (1,2,3...) en MedicationsList.jsx
    rme_nombre VARCHAR(100) NOT NULL,      -- 'Enalapril', 'Metformina'
    rme_dosis VARCHAR(20) NOT NULL,        -- '10 mg'
    rme_via VARCHAR(30) NOT NULL,          -- 'Oral'
    rme_frecuencia VARCHAR(50) NOT NULL,   -- 'Cada 12 horas'
    rme_duracion VARCHAR(30) NOT NULL,     -- '30 días'
    rme_instrucciones VARCHAR(255),
    CONSTRAINT t_receta_medicamento_rme_id___pk PRIMARY KEY (rme_id),
    CONSTRAINT t_receta_medicamento_rme_rec_id___fk FOREIGN KEY (rme_rec_id) REFERENCES T_RECETA (rec_id)
);