import React from 'react';
import { CheckCircleIcon } from '@/components/layout/Icons';

const ESTATUS_LABEL = { confirmada: 'Confirmada', pendiente: 'Pendiente', cancelada: 'Cancelada' };
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export const ClinicAppointmentsPanel = ({ selectedDateKey, citas, onConfirmar }) => {
  const [year, month, day] = selectedDateKey.split('-').map(Number);

  return (
    <section className="clinic-appts-panel">
      <header>
        <h3>{day} {MESES[month - 1]}</h3>
        <p>{citas.length} cita{citas.length !== 1 ? 's' : ''} programada{citas.length !== 1 ? 's' : ''}</p>
      </header>

      {citas.length === 0 ? (
        <div className="clinic-appts-panel__empty">Sin citas este día.</div>
      ) : (
        <ul className="clinic-appts-panel__list">
          {citas.slice().sort((a, b) => a.hora.localeCompare(b.hora)).map((cita) => (
            <li key={cita.id} className="clinic-appt-row">
              <span className="clinic-appt-row__time">{cita.hora}</span>
              <div className="clinic-appt-row__body">
                <strong>{cita.paciente}</strong>
                <p>{cita.medico} · {cita.tipoConsulta}</p>
              </div>
              <span className={`estatus-badge estatus-badge--${cita.estatus}`}>{ESTATUS_LABEL[cita.estatus]}</span>
              {cita.estatus === 'pendiente' && (
                <button type="button" className="clinic-appt-row__confirm" onClick={() => onConfirmar(cita.id)} title="Confirmar cita">
                  <CheckCircleIcon width={16} height={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};