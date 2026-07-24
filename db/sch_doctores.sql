CREATE SCHEMA IF NOT EXISTS sch_doctores;

CREATE TABLE IF NOT EXISTS "SCH_DOCTORES"."T_PERFIL" (
    doc_id serial NOT NULL,
    doc_per_id integer UNIQUE NOT NULL,
    doc_cedula character varying(50) UNIQUE NOT NULL,
    doc_especialidad character varying(100) NOT NULL,
    doc_consultorio character varying(10),

    CONSTRAINT t_perfil_doc_id___pk PRIMARY KEY (doc_id),
    CONSTRAINT t_perfil_doc_per_id___fk FOREIGN KEY(doc_per_id) REFERENCES "SCH_CENTRAL"."T_PERSONA" (per_id)
);