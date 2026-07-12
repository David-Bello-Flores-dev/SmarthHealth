import React from 'react';
import { Button } from '../../../components/Button';
import { CalendarIcon } from './Icons';

const formatToday = () => {
  const formatted = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

// TODO: firstName debe venir del usuario autenticado (Redux / API)
export const WelcomeBanner = ({ firstName = '', onNewAppointment }) => {
  return (
    <div className="dashboard-welcome">
      <div>
        <h2 className="welcome-title">
          Buenos días{firstName ? `, ${firstName}` : ''} 👋
        </h2>
        <p className="welcome-date">{formatToday()}</p>
      </div>

      <Button variant="login-blue" className="gap-2" onClick={onNewAppointment}>
        <CalendarIcon width={16} height={16} />
        Nueva cita
      </Button>
    </div>
  );
};

export default WelcomeBanner;
