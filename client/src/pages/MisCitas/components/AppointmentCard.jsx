import React from 'react';
import { DownloadPdfButton } from '@/components/appointments/DownloadPdfButton';

const ESTATUS_LABEL = {
  confirmada: 'Confirmada',
  pendiente: 'Pendiente',
  cancelada: 'Cancelada',
};

const MODALIDAD_LABEL = {
  presencial: 'Presencial',
  videollamada: 'Videollamada',
};

export const AppointmentCard = ({ cita }) => {
  return (
    <li className="appointment-card">
      <div className="appointment-card__time">{cita.hora}</div>

      <div className="appointment-card__body">
        <div className="appointment-card__row">
          <strong>{cita.medico}</strong>
          <span className={`estatus-badge estatus-badge--${cita.estatus}`}>
            {ESTATUS_LABEL[cita.estatus] ?? cita.estatus}
          </span>
          
          <span className={`estatus-badge estatus-badge--${cita.estatus}`}>
            {ESTATUS_LABEL[cita.estatus] ?? cita.estatus}
          </span>

          <DownloadPdfButton cita={{ ...cita, medico: cita.medico }} />


        </div>
        <p className="appointment-card__tipo">{cita.tipoConsulta}</p>
        <p className="appointment-card__modalidad">{MODALIDAD_LABEL[cita.modalidad] ?? cita.modalidad}</p>
      </div>
    </li>
  );
};