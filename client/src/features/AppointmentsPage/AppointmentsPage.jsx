import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { AppointmentsHeader } from './components/AppointmentsHeader';
import { Calendar } from './components/Calendar';
import { DayAppointmentsList } from './components/DayAppointmentsList';

// TODO: reemplazar por datos reales de la API / Redux.
// appointmentsByDate: { 'YYYY-MM-DD': ['confirmada', 'pendiente', ...] } -> puntos en el calendario
// appointmentsByDay: { 'YYYY-MM-DD': [ { id, time, personName, reason, mode, status } ] } -> lista del día
const DEFAULT_APPOINTMENTS_BY_DATE = {};
const DEFAULT_APPOINTMENTS_BY_DAY = {};

const pad2 = (n) => String(n).padStart(2, '0');
const toDateKey = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

export const AppointmentsPage = ({
  appointmentsByDate = DEFAULT_APPOINTMENTS_BY_DATE,
  appointmentsByDay = DEFAULT_APPOINTMENTS_BY_DAY,
  onNewAppointment,
}) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);

  const handleMonthChange = (year, month) => {
    setViewYear(year);
    setViewMonth(month);
  };

  const selectedDayAppointments = selectedDate
    ? appointmentsByDay[toDateKey(selectedDate)] || []
    : [];

  return (
    <div className="dashboard-layout">
      <Sidebar activeItem="citas" />

      <div className="dashboard-main">
        <TopBar title="Mis Citas" subtitle="SmartHealth — Paciente" />

        <div className="dashboard-content">
          <AppointmentsHeader onNewAppointment={onNewAppointment} />

          <div className="appointments-page-grid">
            <Calendar
              year={viewYear}
              month={viewMonth}
              onMonthChange={handleMonthChange}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              appointmentsByDate={appointmentsByDate}
            />
            <DayAppointmentsList selectedDate={selectedDate} appointments={selectedDayAppointments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
