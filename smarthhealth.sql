-- =========================================================
-- SmartHealth - Esquema de base de datos (PostgreSQL)
-- =========================================================

-- En PostgreSQL la base de datos se crea por separado:
-- CREATE DATABASE smarthhealth;
-- Luego conectarse a ella antes de ejecutar este script.

-- =========================================================
-- CATÁLOGOS GENERALES
-- =========================================================

CREATE TABLE IF NOT EXISTS c_sexo (
    sex_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sex_nombre VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS c_tipo_sanguineo (
    tip_san_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tip_san_nombre VARCHAR(10) NOT NULL
);

-- =========================================================
-- ENUMS
-- =========================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'rol_usuario'
    ) THEN
        CREATE TYPE rol_usuario AS ENUM (
            'paciente',
            'medico',
            'secretaria'
        );
    END IF;
END $$;

-- =========================================================
-- PERSONA
-- =========================================================

CREATE TABLE IF NOT EXISTS t_persona (
    per_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    per_nombre VARCHAR(50) NOT NULL,
    per_apellido_paterno VARCHAR(50) NOT NULL,
    per_apellido_materno VARCHAR(50),

    per_curp VARCHAR(18) UNIQUE,

    per_fecha_nacimiento DATE NOT NULL,

    per_sex_id INTEGER NOT NULL,

    per_fecha_registro TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    per_estatus BOOLEAN
        DEFAULT TRUE,

    CONSTRAINT fk_persona_sexo
        FOREIGN KEY (per_sex_id)
        REFERENCES c_sexo(sex_id)
);

-- =========================================================
-- CONTACTO
-- =========================================================

CREATE TABLE IF NOT EXISTS t_contacto (

    con_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    con_per_id INTEGER NOT NULL,

    con_email VARCHAR(100),

    con_telefono_primario VARCHAR(15),

    con_telefono_secundario VARCHAR(15),

    CONSTRAINT fk_contacto_persona
        FOREIGN KEY (con_per_id)
        REFERENCES t_persona(per_id)
);

-- =========================================================
-- USUARIO
-- =========================================================

CREATE TABLE IF NOT EXISTS t_usuario (

    usu_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    usu_per_id INTEGER UNIQUE NOT NULL,

    usu_username VARCHAR(50) UNIQUE NOT NULL,

    usu_password VARCHAR(255) NOT NULL,

    usu_rol rol_usuario NOT NULL,

    usu_estatus BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_usuario_persona
        FOREIGN KEY (usu_per_id)
        REFERENCES t_persona(per_id)
);

-- =========================================================
-- PERFIL EMPLEADO
-- =========================================================

CREATE TABLE IF NOT EXISTS t_perfil_empleado (

    emp_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    emp_per_id INTEGER UNIQUE NOT NULL,

    emp_num_empleado VARCHAR(20) UNIQUE NOT NULL,

    emp_turno VARCHAR(20) NOT NULL,

    CONSTRAINT fk_empleado_persona
        FOREIGN KEY (emp_per_id)
        REFERENCES t_persona(per_id)
);

-- =========================================================
-- PERFIL MÉDICO
-- =========================================================

CREATE TABLE IF NOT EXISTS t_perfil_medico (

    doc_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    doc_per_id INTEGER UNIQUE NOT NULL,

    doc_cedula VARCHAR(50) UNIQUE NOT NULL,

    doc_especialidad VARCHAR(100) NOT NULL,

    doc_consultorio VARCHAR(10),

    CONSTRAINT fk_medico_persona
        FOREIGN KEY (doc_per_id)
        REFERENCES t_persona(per_id)
);

-- =========================================================
-- PERFIL PACIENTE
-- =========================================================

CREATE TABLE IF NOT EXISTS t_perfil_paciente (

    pac_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    pac_per_id INTEGER UNIQUE NOT NULL,

    pac_tip_san_id INTEGER NOT NULL,

    pac_nss VARCHAR(20) UNIQUE NOT NULL,

    CONSTRAINT fk_paciente_persona
        FOREIGN KEY (pac_per_id)
        REFERENCES t_persona(per_id),

    CONSTRAINT fk_paciente_tipo_sanguineo
        FOREIGN KEY (pac_tip_san_id)
        REFERENCES c_tipo_sanguineo(tip_san_id)
);

-- =========================================================
-- ALERGIAS
-- =========================================================

CREATE TABLE IF NOT EXISTS c_alergia (

    ale_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    ale_nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS t_paciente_alergia (

    pal_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    pal_pac_id INTEGER NOT NULL,

    pal_ale_id INTEGER NOT NULL,

    pal_fecha_registro TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pal_paciente
        FOREIGN KEY (pal_pac_id)
        REFERENCES t_perfil_paciente(pac_id),

    CONSTRAINT fk_pal_alergia
        FOREIGN KEY (pal_ale_id)
        REFERENCES c_alergia(ale_id),

    CONSTRAINT uq_paciente_alergia
        UNIQUE (pal_pac_id, pal_ale_id)
);

-- =========================================================
-- PADECIMIENTOS
-- =========================================================

CREATE TABLE IF NOT EXISTS c_padecimiento (

    pad_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    pad_nombre VARCHAR(100)
        UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS t_paciente_padecimiento (

    ppa_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    ppa_pac_id INTEGER NOT NULL,

    ppa_pad_id INTEGER NOT NULL,

    ppa_nota VARCHAR(100),

    ppa_fecha_diagnostico DATE,

    ppa_estatus BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_ppa_paciente
        FOREIGN KEY (ppa_pac_id)
        REFERENCES t_perfil_paciente(pac_id),

    CONSTRAINT fk_ppa_padecimiento
        FOREIGN KEY (ppa_pad_id)
        REFERENCES c_padecimiento(pad_id)
);

-- =========================================================
-- SIGNOS VITALES
-- =========================================================

CREATE TABLE IF NOT EXISTS t_signos_vitales (

    sv_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    sv_pac_id INTEGER NOT NULL,

    sv_fecha_registro TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    sv_frecuencia_cardiaca INTEGER,

    sv_presion_sistolica INTEGER,

    sv_presion_diastolica INTEGER,

    sv_temperatura NUMERIC(4,1),

    sv_glucosa INTEGER,

    sv_peso_kg NUMERIC(5,2),

    sv_talla_m NUMERIC(3,2),

    sv_registrado_por INTEGER,

    CONSTRAINT fk_sv_paciente
        FOREIGN KEY (sv_pac_id)
        REFERENCES t_perfil_paciente(pac_id),

    CONSTRAINT fk_sv_usuario
        FOREIGN KEY (sv_registrado_por)
        REFERENCES t_usuario(usu_id)
);

-- =========================================================
-- RESULTADOS DE LABORATORIO
-- =========================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'estatus_laboratorio'
    ) THEN

        CREATE TYPE estatus_laboratorio AS ENUM (
            'normal',
            'elevado',
            'bajo'
        );

    END IF;
END $$;

CREATE TABLE IF NOT EXISTS t_resultado_laboratorio (

    lab_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    lab_pac_id INTEGER NOT NULL,

    lab_nombre_estudio VARCHAR(100) NOT NULL,

    lab_valor VARCHAR(20) NOT NULL,

    lab_ref_min NUMERIC(6,2),

    lab_ref_max NUMERIC(6,2),

    lab_ref_unidad VARCHAR(15),

    lab_estatus estatus_laboratorio NOT NULL,

    lab_fecha_toma DATE NOT NULL,

    CONSTRAINT fk_lab_paciente
        FOREIGN KEY (lab_pac_id)
        REFERENCES t_perfil_paciente(pac_id)
);

-- =========================================================
-- CATÁLOGO DE TIPOS DE CONSULTA
-- =========================================================

CREATE TABLE IF NOT EXISTS c_tipo_consulta (

    tco_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    tco_nombre VARCHAR(50) NOT NULL
);

-- =========================================================
-- ENUMS PARA CITAS
-- =========================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'modalidad_cita'
    ) THEN
        CREATE TYPE modalidad_cita AS ENUM (
            'presencial',
            'videollamada'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'estatus_cita'
    ) THEN
        CREATE TYPE estatus_cita AS ENUM (
            'confirmada',
            'pendiente',
            'cancelada'
        );
    END IF;
END $$;

-- =========================================================
-- CITAS
-- =========================================================

CREATE TABLE IF NOT EXISTS t_cita (

    cit_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    cit_pac_id INTEGER NOT NULL,

    cit_doc_id INTEGER NOT NULL,

    cit_tco_id INTEGER NOT NULL,

    cit_fecha DATE NOT NULL,

    cit_hora TIME NOT NULL,

    cit_modalidad modalidad_cita
        DEFAULT 'presencial',

    cit_estatus estatus_cita
        DEFAULT 'pendiente',

    cit_notas VARCHAR(255),

    cit_fecha_creacion TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cita_paciente
        FOREIGN KEY (cit_pac_id)
        REFERENCES t_perfil_paciente(pac_id),

    CONSTRAINT fk_cita_medico
        FOREIGN KEY (cit_doc_id)
        REFERENCES t_perfil_medico(doc_id),

    CONSTRAINT fk_cita_tipo
        FOREIGN KEY (cit_tco_id)
        REFERENCES c_tipo_consulta(tco_id),

    CONSTRAINT uq_cita_medico_horario
        UNIQUE (cit_doc_id, cit_fecha, cit_hora)
);

-- =========================================================
-- RECETAS
-- =========================================================

CREATE TABLE IF NOT EXISTS t_receta (

    rec_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    rec_folio VARCHAR(20)
        UNIQUE NOT NULL,

    rec_pac_id INTEGER NOT NULL,

    rec_doc_id INTEGER NOT NULL,

    rec_cit_id INTEGER,

    rec_diagnostico VARCHAR(255) NOT NULL,

    rec_fecha_emision DATE NOT NULL,

    CONSTRAINT fk_receta_paciente
        FOREIGN KEY (rec_pac_id)
        REFERENCES t_perfil_paciente(pac_id),

    CONSTRAINT fk_receta_medico
        FOREIGN KEY (rec_doc_id)
        REFERENCES t_perfil_medico(doc_id),

    CONSTRAINT fk_receta_cita
        FOREIGN KEY (rec_cit_id)
        REFERENCES t_cita(cit_id)
);

-- =========================================================
-- MEDICAMENTOS DE LA RECETA
-- =========================================================

CREATE TABLE IF NOT EXISTS t_receta_medicamento (

    rme_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    rme_rec_id INTEGER NOT NULL,

    rme_orden INTEGER
        DEFAULT 1,

    rme_nombre VARCHAR(100) NOT NULL,

    rme_dosis VARCHAR(20) NOT NULL,

    rme_via VARCHAR(30) NOT NULL,

    rme_frecuencia VARCHAR(50) NOT NULL,

    rme_duracion VARCHAR(30) NOT NULL,

    rme_instrucciones VARCHAR(255),

    CONSTRAINT fk_receta_medicamento
        FOREIGN KEY (rme_rec_id)
        REFERENCES t_receta(rec_id)
        ON DELETE CASCADE
);

-- =========================================================
-- ÍNDICES
-- =========================================================

CREATE INDEX idx_cita_paciente
    ON t_cita(cit_pac_id);

CREATE INDEX idx_cita_medico
    ON t_cita(cit_doc_id);

CREATE INDEX idx_cita_fecha
    ON t_cita(cit_fecha);

CREATE INDEX idx_signos_paciente
    ON t_signos_vitales(sv_pac_id);

CREATE INDEX idx_lab_paciente
    ON t_resultado_laboratorio(lab_pac_id);

CREATE INDEX idx_receta_paciente
    ON t_receta(rec_pac_id);

CREATE INDEX idx_receta_medico
    ON t_receta(rec_doc_id);

-- =========================================================
-- DATOS INICIALES
-- =========================================================

INSERT INTO c_sexo (sex_nombre)
VALUES
    ('Masculino'),
    ('Femenino'),
    ('Otro')
ON CONFLICT DO NOTHING;

INSERT INTO c_tipo_sanguineo (tip_san_nombre)
VALUES
    ('A+'),
    ('A-'),
    ('B+'),
    ('B-'),
    ('AB+'),
    ('AB-'),
    ('O+'),
    ('O-')
ON CONFLICT DO NOTHING;

INSERT INTO c_tipo_consulta (tco_nombre)
VALUES
    ('Consulta General'),
    ('Seguimiento'),
    ('Urgencia'),
    ('Control')
ON CONFLICT DO NOTHING;

INSERT INTO c_alergia (ale_nombre)
VALUES
    ('Penicilina'),
    ('Ibuprofeno'),
    ('Polen'),
    ('Lácteos'),
    ('Mariscos')
ON CONFLICT DO NOTHING;

INSERT INTO c_padecimiento (pad_nombre)
VALUES
    ('Diabetes'),
    ('Hipertensión'),
    ('Asma'),
    ('Obesidad'),
    ('Artritis')
ON CONFLICT DO NOTHING;

-- =========================================================
-- EJEMPLO DE USUARIO
-- =========================================================

INSERT INTO t_persona (
    per_nombre,
    per_apellido_paterno,
    per_apellido_materno,
    per_curp,
    per_fecha_nacimiento,
    per_sex_id
)
VALUES (
    'Administrador',
    'Sistema',
    '',
    'XAXX010101HNEXXXA0',
    '2000-01-01',
    1
);

INSERT INTO t_usuario (
    usu_per_id,
    usu_username,
    usu_password,
    usu_rol
)
VALUES (
    currval(pg_get_serial_sequence('t_persona','per_id')),
    'admin',
    'admin123',
    'secretaria'
);

-- =========================================================
-- CONSULTAS ÚTILES
-- =========================================================

-- Próximas citas
SELECT
    c.cit_id,
    p.per_nombre,
    p.per_apellido_paterno,
    c.cit_fecha,
    c.cit_hora,
    c.cit_estatus
FROM t_cita c
INNER JOIN t_perfil_paciente pa
    ON c.cit_pac_id = pa.pac_id
INNER JOIN t_persona p
    ON pa.pac_per_id = p.per_id
ORDER BY c.cit_fecha, c.cit_hora;

-- Historial de signos vitales
SELECT
    sv_fecha_registro,
    sv_temperatura,
    sv_peso_kg,
    sv_presion_sistolica,
    sv_presion_diastolica
FROM t_signos_vitales
WHERE sv_pac_id = 1
ORDER BY sv_fecha_registro DESC;