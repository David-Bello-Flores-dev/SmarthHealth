import React from 'react';
import { Button } from '../../../components/Button';
import { PlusIcon } from './Icons';

export const AppointmentsHeader = ({ onNewAppointment }) => {
  return (
    <div className="appointments-page-header">
      <div>
        <h2 className="appointments-page-title">Gestión de Citas</h2>
        <p className="appointments-page-subtitle">Administra y agenda citas médicas</p>
      </div>

      <Button variant="login-blue" className="gap-2" onClick={onNewAppointment}>
        <PlusIcon width={16} height={16} />
        Nueva cita
      </Button>
    </div>
  );
};

export default AppointmentsHeader;
