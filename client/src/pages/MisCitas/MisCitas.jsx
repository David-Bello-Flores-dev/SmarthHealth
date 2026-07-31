import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CalendarMonth } from '@/components/calendar/CalendarMonth';
import { AppointmentsPanel } from './components/AppointmentsPanel';
import { toDateKey } from '@/utils/calendarUtils';
import './MisCitas.css';
import { api } from '@/services/api';
import { NewAppointmentModal } from '@/components/appointments/NewAppointmentModal';

// TODO: BACKEND - Endpoint esperado: GET /api/pacientes/:pacienteId/citas?mes=2026-06
// Idealmente el backend ya filtra por mes visible para no traer todo el historial de citas.
async function fetchCitas(pacienteId, year, month) {
  const mes = `${year}-${String(month + 1).padStart(2, '0')}`;
  return api.get(`/pacientes/${pacienteId}/citas?mes=${mes}`);
}


export const MisCitas = () => {
  const { pacienteId } = useOutletContext();
  const [showModal, setShowModal] = useState(false);

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
    setShowModal(true);
  };

  const handleCitaCreada = (nuevaCita) => {
    setCitas((prev) => [...prev, nuevaCita]);
    setShowModal(false);
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
        {showModal && (
          <NewAppointmentModal
            fechaInicial={selectedDateKey}
            onClose={() => setShowModal(false)}
            onCreated={handleCitaCreada}
          />
        )}
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