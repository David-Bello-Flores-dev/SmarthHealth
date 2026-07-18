import React from 'react';
import { Card } from '../../../components/Card';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const STATUS_DOT_CLASS = {
  confirmada: 'calendar-dot-success',
  normal: 'calendar-dot-success',
  pendiente: 'calendar-dot-warning',
  elevado: 'calendar-dot-danger',
  fuera_de_rango: 'calendar-dot-danger',
};

const pad2 = (n) => String(n).padStart(2, '0');

const dateKey = (year, month, day) => `${year}-${pad2(month + 1)}-${pad2(day)}`;

const isSameDay = (a, b) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const getMonthLabel = (year, month) => {
  const formatted = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(
    new Date(year, month, 1)
  );
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const buildGrid = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Dom
  const leadingBlanks = (firstDay + 6) % 7; // convertir a semana Lun-Dom
  const totalDays = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < leadingBlanks; i += 1) cells.push(null);
  for (let day = 1; day <= totalDays; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
};

// TODO: appointmentsByDate debe venir de la API / Redux.
// Formato esperado: { 'YYYY-MM-DD': ['confirmada', 'pendiente', ...] }
export const Calendar = ({
  year,
  month,
  onMonthChange,
  selectedDate,
  onSelectDate,
  appointmentsByDate = {},
}) => {
  const cells = buildGrid(year, month);

  const goToPrevMonth = () => {
    const prev = month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 };
    onMonthChange(prev.year, prev.month);
  };

  const goToNextMonth = () => {
    const next = month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 };
    onMonthChange(next.year, next.month);
  };

  return (
    <Card className="calendar-panel">
      <div className="calendar-nav">
        <button type="button" className="calendar-nav-btn" onClick={goToPrevMonth} aria-label="Mes anterior">
          <ChevronLeftIcon width={18} height={18} />
        </button>
        <h3 className="calendar-month-label">{getMonthLabel(year, month)}</h3>
        <button type="button" className="calendar-nav-btn" onClick={goToNextMonth} aria-label="Mes siguiente">
          <ChevronRightIcon width={18} height={18} />
        </button>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS.map((label) => (
          <span key={label} className="calendar-weekday">
            {label}
          </span>
        ))}
      </div>

      <div className="calendar-grid">
        {cells.map((day, index) => {
          if (!day) {
            return <div key={`blank-${index}`} className="calendar-day-empty" />;
          }

          const cellDate = new Date(year, month, day);
          const key = dateKey(year, month, day);
          const statuses = appointmentsByDate[key] || [];
          const isSelected = isSameDay(cellDate, selectedDate);

          return (
            <button
              type="button"
              key={key}
              onClick={() => onSelectDate(cellDate)}
              className={`calendar-day-cell ${isSelected ? 'calendar-day-selected' : ''}`}
            >
              <span className="calendar-day-number">{day}</span>
              {statuses.length > 0 && (
                <span className="calendar-day-dots">
                  {statuses.slice(0, 3).map((status, dotIndex) => (
                    <span
                      key={dotIndex}
                      className={`calendar-day-dot ${STATUS_DOT_CLASS[status] || 'calendar-dot-default'}`}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default Calendar;
