import React from 'react';
import { Card } from '../../../components/Card';
import { StatusBadge } from '../../../components/StatusBadge';
import { ClockIcon, PersonIcon, MapPinIcon, VideoIcon } from './Icons';

const STATUS_TONE_CLASS = {
  confirmada: 'day-appointment-item-success',
  normal: 'day-appointment-item-success',
  pendiente: 'day-appointment-item-warning',
  elevado: 'day-appointment-item-danger',
  fuera_de_rango: 'day-appointment-item-danger',
};

const formatSelectedDay = (date) => {
  if (!date) return '';
  const formatted = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

// TODO: appointments debe venir de la API / Redux para la fecha seleccionada.
// Formato esperado por cada cita:
// { id, time, personName, reason, mode: 'presencial' | 'videollamada', status }
export const DayAppointmentsList = ({ selectedDate, appointments = [] }) => {
  return (
    <Card className="day-list-panel">
      <div className="day-list-header">
        <h3 className="day-list-title">{formatSelectedDay(selectedDate) || 'Selecciona un día'}</h3>
        <p className="day-list-subtitle">
          {appointments.length > 0
            ? `${appointments.length} ${appointments.length === 1 ? 'cita programada' : 'citas programadas'}`
            : 'Sin citas programadas'}
        </p>
      </div>

      {appointments.length === 0 ? (
        <p className="day-list-empty">No hay citas para este día.</p>
      ) : (
        <div className="day-list-items">
          {appointments.map(({ id, time, personName, reason, mode, status }) => {
            const ModeIcon = mode === 'videollamada' ? VideoIcon : MapPinIcon;
            const modeLabel = mode === 'videollamada' ? 'videollamada' : 'presencial';

            return (
              <div key={id} className={`day-appointment-item ${STATUS_TONE_CLASS[status] || ''}`}>
                <div className="day-appointment-top">
                  <span className="day-appointment-time-row">
                    <ClockIcon width={14} height={14} />
                    {time}
                  </span>
                  <StatusBadge status={status} />
                </div>
                <p className="day-appointment-person">
                  <PersonIcon width={14} height={14} />
                  {personName}
                </p>
                <p className="day-appointment-reason">{reason}</p>
                <p className="day-appointment-meta">
                  <ModeIcon width={13} height={13} />
                  {modeLabel}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default DayAppointmentsList;
