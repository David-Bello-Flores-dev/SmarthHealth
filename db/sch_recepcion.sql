CREATE SCHEMA IF NOT EXISTS sch_recepcion;

CREATE TABLE IF NOT EXISTS "SCH_RECEPCION"."T_PERFIL" (
    rec_id serial NOT NULL,
    rec_per_id integer UNIQUE NOT NULL,
    rec_num_empleado character varying(20) UNIQUE NOT NULL,
    rec_turno character varying(20) NOT NULL,

    CONSTRAINT t_perfil_rec_id___pk PRIMARY KEY (rec_id),
    CONSTRAINT t_perfil_rec_per_id___fk FOREIGN KEY (rec_per_id) REFERENCES "SCH_RECEPCION"."T_PERSONA" (per_id)
);