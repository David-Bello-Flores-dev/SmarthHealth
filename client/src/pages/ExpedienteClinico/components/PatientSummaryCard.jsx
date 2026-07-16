import React from 'react';

export const PatientSummaryCard = ({ paciente, imc }) => {
  const fecha = new Date(paciente.fechaNacimiento).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <section className="patient-card">
      <div className="patient-card__identity">
        <div className="patient-card__avatar">{paciente.iniciales}</div>
        <div>
          <span className="patient-card__label">Paciente</span>
          <h2>{paciente.nombre}</h2>
          <p className="patient-card__birth">{fecha} · {paciente.edad} años</p>

          {paciente.alergias?.length > 0 && (
            <div className="patient-card__allergies">
              <span className="patient-card__label">Alergias</span>
              <div className="pill-group">
                {/* TODO: BACKEND - si en el futuro hay severidad por alergia, pasar objeto {nombre, severidad} en vez de string */}
                {paciente.alergias.map((a) => (
                  <span key={a} className="pill pill--alert">⚠ {a}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <dl className="patient-card__vitals">
        <div>
          <dt>Tipo de sangre</dt>
          <dd>{paciente.tipoSangre}</dd>
        </div>
        <div>
          <dt>Peso</dt>
          <dd>{paciente.pesoKg} kg</dd>
        </div>
        <div>
          <dt>Talla</dt>
          <dd>{paciente.tallaM} m</dd>
        </div>
        <div>
          <dt>IMC</dt>
          <dd>{imc}</dd>
        </div>
      </dl>
    </section>
  );
};