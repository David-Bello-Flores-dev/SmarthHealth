import React from 'react';
import { AppointmentCard } from './AppointmentCard';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const AppointmentsPanel = ({ selectedDateKey, citas }) => {
  const [year, month, day] = selectedDateKey.split('-').map(Number);
  const etiquetaFecha = `${day} ${MESES[month - 1]}`;

  return (
    <section className="appointments-panel">
      <header className="appointments-panel__header">
        <h3>{etiquetaFecha}</h3>
        <p>
          {citas.length === 0
            ? 'Sin citas programadas'
            : `${citas.length} cita${citas.length > 1 ? 's' : ''} programada${citas.length > 1 ? 's' : ''}`}
        </p>
      </header>

      {citas.length === 0 ? (
        <div className="appointments-panel__empty">
          No tienes citas este día. Usa “Nueva cita” para agendar una.
        </div>
      ) : (
        <ul className="appointments-panel__list">
          {citas
            .slice()
            .sort((a, b) => a.hora.localeCompare(b.hora))
            .map((cita) => (
              <AppointmentCard key={cita.id} cita={cita} />
            ))}
        </ul>
      )}
    </section>
  );
};