import React from 'react';
import { Link } from 'react-router-dom';

const ESTATUS_LABEL = {
  confirmada: 'Confirmada',
  pendiente: 'Pendiente',
  cancelada: 'Cancelada',
};

export const UpcomingAppointments = ({ citas }) => {
  return (
    <section className="upcoming-appointments">
      <div className="upcoming-appointments__header">
        <h3>Próximas citas</h3>
        <Link to="/paciente/citas">Ver todas</Link>
      </div>

      {citas.length === 0 ? (
        <p className="upcoming-appointments__empty">No tienes citas próximas.</p>
      ) : (
        <ul className="upcoming-appointments__list">
          {citas.map((cita) => (
            <li key={cita.id} className="upcoming-appointment">
              <span className="upcoming-appointment__dot" />
              <div className="upcoming-appointment__info">
                <strong>{cita.medico}</strong>
                <p>{cita.especialidad}</p>
                <span className="upcoming-appointment__time">{cita.fechaLabel} · {cita.hora}</span>
              </div>
              <span className={`estatus-badge estatus-badge--${cita.estatus}`}>
                {ESTATUS_LABEL[cita.estatus] ?? cita.estatus}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};