import React from 'react';
import { Card } from '../../../components/Card';
import { StatusBadge } from '../../../components/StatusBadge';
import { ClockIcon } from './Icons';

// TODO: appointments debe venir de la API / Redux. Formato esperado por cada cita:
// { id, doctor, specialty, when, status } donde status es uno de los valores
// que ya reconoce StatusBadge (ej. 'confirmada', 'pendiente').
export const UpcomingAppointments = ({ appointments = [], onViewAll }) => {
  return (
    <Card className="appointments-panel">
      <div className="appointments-header">
        <h3 className="appointments-title">Próximas citas</h3>
        <button type="button" onClick={onViewAll} className="appointments-viewall-link">
          Ver todas
        </button>
      </div>

      {appointments.length === 0 ? (
        <p className="appointments-empty">No hay citas próximas.</p>
      ) : (
        <div className="appointments-list">
          {appointments.map(({ id, doctor, specialty, when, status }) => (
            <div key={id} className="appointment-item">
              <span className="appointment-icon">
                <ClockIcon width={16} height={16} />
              </span>
              <div className="appointment-info">
                <p className="appointment-doctor">{doctor}</p>
                <p className="appointment-specialty">{specialty}</p>
                <p className="appointment-time">{when}</p>
              </div>
              <StatusBadge status={status} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default UpcomingAppointments;
