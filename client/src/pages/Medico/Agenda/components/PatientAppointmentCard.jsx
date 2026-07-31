import React from 'react';
import { VideoIcon, MapPinIcon } from '@/components/layout/Icons';
import { DownloadPdfButton } from '@/components/appointments/DownloadPdfButton';

const ESTATUS_LABEL = {
  confirmada: 'Confirmada',
  pendiente: 'Pendiente',
  cancelada: 'Cancelada',
};

export const PatientAppointmentCard = ({ cita }) => {
  const ModalidadIcon = cita.modalidad === 'videollamada' ? VideoIcon : MapPinIcon;

  return (
    <li className="patient-appointment-card">
      <div className="patient-appointment-card__time">{cita.hora}</div>

      <div className="patient-appointment-card__body">
        <div className="patient-appointment-card__row">
          <strong>{cita.paciente}</strong>
          <span className={`estatus-badge estatus-badge--${cita.estatus}`}>
            {ESTATUS_LABEL[cita.estatus] ?? cita.estatus}
          </span>
          <DownloadPdfButton cita={{ ...cita, paciente: cita.paciente }} />
        </div>
        <p className="patient-appointment-card__tipo">{cita.tipoConsulta}</p>
        <p className="patient-appointment-card__modalidad">
          <ModalidadIcon width={13} height={13} />
          {cita.modalidad === 'videollamada' ? 'Videollamada' : 'Presencial'}
        </p>
      </div>
    </li>
  );
};