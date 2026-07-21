import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CalendarMonth } from '@/components/calendar/CalendarMonth';
import { AppointmentsPanel } from './components/AppointmentsPanel';
import { toDateKey } from '@/utils/calendarUtils';
import './MisCitas.css';

// TODO: BACKEND - Endpoint esperado: GET /api/pacientes/:pacienteId/citas?mes=2026-06
// Idealmente el backend ya filtra por mes visible para no traer todo el historial de citas.
async function fetchCitas(pacienteId, year, month) {
  // --- MOCK: reemplazar por llamada real ---
  // const mes = `${year}-${String(month + 1).padStart(2, '0')}`;
  // const res = await api.get(`/pacientes/${pacienteId}/citas`, { params: { mes } });
  // return res.data;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'c1',
          fecha: '2026-06-10',
          hora: '09:00',
          medico: 'Carlos Méndez',
          tipoConsulta: 'Consulta general',
          modalidad: 'presencial',
          estatus: 'confirmada',
        },
        {
          id: 'c2',
          fecha: '2026-06-10',
          hora: '10:30',
          medico: 'Ana López',
          tipoConsulta: 'Seguimiento',
          modalidad: 'videollamada',
          estatus: 'confirmada',
        },
        {
          id: 'c3',
          fecha: '2026-06-10',
          hora: '14:30',
          medico: 'María García',
          tipoConsulta: 'Revisión anual',
          modalidad: 'presencial',
          estatus: 'confirmada',
        },
        { id: 'c4', fecha: '2026-06-04', hora: '11:00', medico: 'Andrés Mora', tipoConsulta: 'Consulta general', modalidad: 'presencial', estatus: 'confirmada' },
        { id: 'c5', fecha: '2026-06-13', hora: '16:00', medico: 'Lucía Fernández', tipoConsulta: 'Endocrinología', modalidad: 'videollamada', estatus: 'pendiente' },
        { id: 'c6', fecha: '2026-06-24', hora: '08:30', medico: 'Carlos Méndez', tipoConsulta: 'Consulta general', modalidad: 'presencial', estatus: 'confirmada' },
      ]);
    }, 400);
  });
}

export const MisCitas = () => {
  const { pacienteId } = useOutletContext();

  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1)); // Junio 2026
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(new Date(2026, 5, 10)));
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    fetchCitas(pacienteId, currentMonth.getFullYear(), currentMonth.getMonth())
      .then((res) => { if (activo) setCitas(res); })
      .catch((err) => { if (activo) setError(err); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, [pacienteId, currentMonth]);

  // Mapa dateKey -> citas de ese día, para que el calendario pinte los indicadores sin recorrer el arreglo por celda
  const citasPorDia = useMemo(() => {
    const map = {};
    for (const c of citas) {
      (map[c.fecha] ??= []).push(c);
    }
    return map;
  }, [citas]);

  const citasDelDiaSeleccionado = citasPorDia[selectedDateKey] ?? [];

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleNuevaCita = () => {
    // TODO: BACKEND - abrir modal/formulario y hacer POST /api/pacientes/:pacienteId/citas
    // Por ahora solo placeholder de navegación
    console.log('Abrir flujo de nueva cita para', pacienteId, 'en', selectedDateKey);
  };

  return (
    <div className="mis-citas-page">
      <div className="mis-citas-page__header">
        <div>
          <h1>Gestión de Citas</h1>
          <p>Administra y agenda tus citas médicas</p>
        </div>
        <button type="button" className="btn-nueva-cita" onClick={handleNuevaCita}>
          + Nueva cita
        </button>
      </div>

      {loading && <div className="mis-citas-page__state">Cargando citas...</div>}
      {error && <div className="mis-citas-page__state mis-citas-page__state--error">No se pudieron cargar tus citas.</div>}

      {!loading && !error && (
        <div className="mis-citas-page__grid">
          <CalendarMonth
            currentMonth={currentMonth}
            selectedDateKey={selectedDateKey}
            citasPorDia={citasPorDia}
            onSelectDate={setSelectedDateKey}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
          <AppointmentsPanel
            selectedDateKey={selectedDateKey}
            citas={citasDelDiaSeleccionado}
          />
        </div>
      )}
    </div>
  );
};

export default MisCitas;