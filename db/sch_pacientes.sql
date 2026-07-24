CREATE SCHEMA IF NOT EXISTS sch_pacientes;

CREATE TABLE IF NOT EXISTS "SCH_PACIENTES"."C_TIPO_SANGUINEO" (
    tip_san_id serial NOT NULL,
    tip_san_nombre character varying(10) NOT NULL,

    CONSTRAINT c_tipo_sanguineo_tip_san_id___pk PRIMARY KEY (tip_san_id)
);

-- Perfil exclusivo del Paciente
CREATE TABLE IF NOT EXISTS "SCH_PACIENTES"."T_PERFIL" (
    pac_id serial NOT NULL,
    pac_per_id integer UNIQUE NOT NULL,
    pac_tip_san_id integer NOT NULL,
    pac_nss VARCHAR(20) UNIQUE NOT NULL,
    pac_alergias character varying(30) NOT NULL, 

    CONSTRAINT t_perfil_pac_id___pk PRIMARY KEY (pac_id),
    CONSTRAINT t_perfil_pac_per_id___fk FOREIGN KEY (pac_per_id) REFERENCES "SCH_CENTRAL"."T_PERSONA" (per_id),
    CONSTRAINT t_perfil_pac_tip_san_id___fk FOREIGN KEY (pac_tip_san_id) REFERENCES "SHC_PACIENTES"."C_TIPO_SANGUINEO" (tip_san_id)
);