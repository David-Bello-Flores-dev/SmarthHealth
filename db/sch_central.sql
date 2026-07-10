CREATE SCHEMA IF NOT EXISTS sch_central;

CREATE TABLE IF NOT EXISTS "SCH_CENTRAL"."C_SEXO" (
    sex_id serial  NOT NULL,
    sex_nombre character varying(20) NOT NULL,

    CONSTRAINT c_sex_id___pk PRIMARY KEY (sex_id)
);

CREATE TABLE IF NOT EXISTS "SCH_CENTRAL"."T_PERSONA" (
    per_id serial NOT NULL, 
    per_nombre character varying(50) NOT NULL,
    per_apellido_paterno character varying(50) NOT NULL,
    per_apellido_materno character varying(50),
    per_curp character varying(18) UNIQUE,
    per_fecha_nacimiento date NOT NULL,
    per_sex_id integer NOT NULL,
    per_fecha_registro timestamp default CURRENT_TIMESTAMP,
    per_estatus boolean default TRUE,

    CONSTRAINT t_persona_per_id___pk PRIMARY KEY (per_id),
    CONSTRAINT t_persona_per_sex_id___fk FOREIGN KEY (per_sex_id) REFERENCES "SCH_CENTRAL"."C_SEXO" (sex_id)
);

CREATE TABLE IF NOT EXISTS "SCH_CENTRAL"."T_CONTACTO" (
    con_id serial NOT NULL,
    con_per_id integer NOT NULL,
    con_email character varying(100),
    con_telefono_primario character varying(15),
    con_telefono_secundario character varying(15),

    CONSTRAINT t_contacto_con_id___pk PRIMARY KEY (con_id),
    CONSTRAINT t_contacto_con_per_id___fk FOREIGN KEY(con_per_id) REFERENCES "SCH_CENTRAL"."T_PERSONA" (per_id)
);

CREATE TABLE IF NOT EXISTS "SCH_CENTRAL"."T_USUARIO" (
    usu_id serial NOT NULL,
    -- Llave primaria
    usu_per_id integer UNIQUE NOT NULL,
    usu_username character varying(50) UNIQUE NOT NULL,
    usu_password character varying(255) NOT NULL, 
    usu_rol character varying(20) NOT NULL,

    CONSTRAINT t_usuario_usu_id___pk PRIMARY KEY (usu_id),
    CONSTRAINT t_usuario_usu_per_id___fk FOREIGN KEY (usu_per_id) REFERENCES "SCH_CENTRAL"."T_PERSONA" (per_id)
);