const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DIAS_SEMANA = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

export const nombreMes = (fecha) => MESES[fecha.getMonth()];
export const nombresDiasSemana = () => DIAS_SEMANA;

// Formatea a 'YYYY-MM-DD' en horario local (evita el corrimiento de día que da toISOString con UTC)
export const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Genera la grilla completa del mes (42 celdas = 6 semanas), incluyendo
// días del mes anterior/siguiente para rellenar la primera y última semana.
export const buildMonthGrid = (year, month) => {
  const firstOfMonth = new Date(year, month, 1);
  // getDay(): 0=Domingo..6=Sábado -> lo convertimos a semana que inicia en Lunes
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7;

  const start = new Date(year, month, 1 - firstWeekday);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return {
      date,
      dateKey: toDateKey(date),
      inCurrentMonth: date.getMonth() === month,
    };
  });
};