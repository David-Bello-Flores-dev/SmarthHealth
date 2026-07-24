import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CalendarMonth } from '@/components/calendar/CalendarMonth';
import { toDateKey } from '@/utils/calendarUtils';
import { DailyPatientsPanel } from './components/DailyPatientsPanel';
import './Agenda.css';

// TODO: BACKEND - Endpoint esperado: GET /api/medicos/:doctorId/citas?mes=2026-06
// A diferencia de MisCitas.jsx (paciente), aquí el backend debe traer TODAS las
// citas del médico sin importar el paciente, ordenadas para agrupar por día.
async function fetchCitasMedico(doctorId, year, month) {
  // --- MOCK: reemplazar por llamada real ---
  // const mes = `${year}-${String(month + 1).padStart(2, '0')}`;
  // const res = await api.get(`/medicos/${doctorId}/citas`, { params: { mes } });
  // return res.data;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'c1', fecha: '2026-06-10', hora: '09:00', paciente: 'Carlos Méndez', tipoConsulta: 'Consulta general', modalidad: 'presencial', estatus: 'confirmada' },
        { id: 'c2', fecha: '2026-06-10', hora: '10:30', paciente: 'Ana López', tipoConsulta: 'Seguimiento', modalidad: 'videollamada', estatus: 'confirmada' },
        { id: 'c3', fecha: '2026-06-10', hora: '14:30', paciente: 'María García', tipoConsulta: 'Revisión anual', modalidad: 'presencial', estatus: 'confirmada' },
        { id: 'c4', fecha: '2026-06-12', hora: '11:00', paciente: 'Pedro Ruiz', tipoConsulta: 'Consulta general', modalidad: 'presencial', estatus: 'pendiente' },
        { id: 'c5', fecha: '2026-06-15', hora: '09:30', paciente: 'Elena Castro', tipoConsulta: 'Seguimiento', modalidad: 'presencial', estatus: 'cancelada' },
        { id: 'c6', fecha: '2026-06-15', hora: '16:00', paciente: 'Luis Herrera', tipoConsulta: 'Consulta general', modalidad: 'videollamada', estatus: 'confirmada' },
        { id: 'c7', fecha: '2026-06-18', hora: '08:30', paciente: 'Sofía Ramírez', tipoConsulta: 'Consulta general', modalidad: 'presencial', estatus: 'pendiente' },
        { id: 'c8', fecha: '2026-06-22', hora: '10:00', paciente: 'Jorge Salinas', tipoConsulta: 'Revisión anual', modalidad: 'presencial', estatus: 'confirmada' },
        { id: 'c9', fecha: '2026-06-22', hora: '11:30', paciente: 'Diana Ortiz', tipoConsulta: 'Seguimiento', modalidad: 'presencial', estatus: 'confirmada' },
        { id: 'c10', fecha: '2026-06-22', hora: '13:00', paciente: 'Fernando Ríos', tipoConsulta: 'Consulta general', modalidad: 'videollamada', estatus: 'confirmada' },
      ]);
    }, 400);
  });
}

export const Agenda = () => {
  const { doctorId } = useOutletContext();

  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1));
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(new Date(2026, 5, 10)));
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    fetchCitasMedico(doctorId, currentMonth.getFullYear(), currentMonth.getMonth())
      .then((res) => { if (activo) setCitas(res); })
      .catch((err) => { if (activo) setError(err); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, [doctorId, currentMonth]);

  const citasPorDia = useMemo(() => {
    const map = {};
    for (const c of citas) {
      (map[c.fecha] ??= []).push(c);
    }
    return map;
  }, [citas]);

  const citasDelDiaSeleccionado = citasPorDia[selectedDateKey] ?? [];

  const handlePrevMonth = () => setCurrentMonth((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1));

  const handleNuevaCita = () => {
    // TODO: BACKEND - abrir modal/formulario de nueva cita (elegir paciente, tipo de consulta, horario)
    // y hacer POST /api/medicos/:doctorId/citas
    console.log('Abrir flujo de nueva cita para el médico', doctorId, 'en', selectedDateKey);
  };

  return (
    <div className="agenda-page">
      <div className="agenda-page__header">
        <div>
          <h1>Gestión de Citas</h1>
          <p>Administra y agenda citas médicas</p>
        </div>
        <button type="button" className="btn-nueva-cita" onClick={handleNuevaCita}>
          + Nueva cita
        </button>
      </div>

      {loading && <div className="page-state">Cargando agenda...</div>}
      {error && <div className="page-state page-state--error">No se pudo cargar la agenda.</div>}

      {!loading && !error && (
        <div className="agenda-page__grid">
          <CalendarMonth
            currentMonth={currentMonth}
            selectedDateKey={selectedDateKey}
            citasPorDia={citasPorDia}
            onSelectDate={setSelectedDateKey}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
          <DailyPatientsPanel
            selectedDateKey={selectedDateKey}
            citas={citasDelDiaSeleccionado}
          />
        </div>
      )}
    </div>
  );
};

export default Agenda;