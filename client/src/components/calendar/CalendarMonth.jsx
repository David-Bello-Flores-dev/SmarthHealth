import React from 'react';
import './CalendarMonth.css'
import { ChevronRightIcon } from '@/components/layout/Icons';
import { buildMonthGrid, nombreMes, nombresDiasSemana } from '@/utils/calendarUtils';

export const CalendarMonth = ({
  currentMonth,
  selectedDateKey,
  citasPorDia,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const dias = buildMonthGrid(year, month);

  return (
    <section className="calendar-month">
      <div className="calendar-month__header">
        <button type="button" className="calendar-nav-btn" onClick={onPrevMonth} aria-label="Mes anterior">
          <ChevronRightIcon style={{ transform: 'rotate(180deg)' }} width={16} height={16} />
        </button>
        <h2>{nombreMes(currentMonth)} {year}</h2>
        <button type="button" className="calendar-nav-btn" onClick={onNextMonth} aria-label="Mes siguiente">
          <ChevronRightIcon width={16} height={16} />
        </button>
      </div>

      <div className="calendar-month__weekdays">
        {nombresDiasSemana().map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="calendar-month__grid">
        {dias.map(({ date, dateKey, inCurrentMonth }) => {
          const citasDelDia = citasPorDia[dateKey] ?? [];
          const isSelected = dateKey === selectedDateKey;

          return (
            <button
              type="button"
              key={dateKey}
              className={[
                'calendar-day',
                !inCurrentMonth && 'calendar-day--outside',
                isSelected && 'calendar-day--selected',
              ].filter(Boolean).join(' ')}
              onClick={() => onSelectDate(dateKey)}
            >
              <span className="calendar-day__number">{date.getDate()}</span>
              {citasDelDia.length > 0 && (
                <span className="calendar-day__dots">
                  {citasDelDia.slice(0, 3).map((c) => (
                    <span key={c.id} className={`calendar-dot calendar-dot--${c.estatus}`} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};