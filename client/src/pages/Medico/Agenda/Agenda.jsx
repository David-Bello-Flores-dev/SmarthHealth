import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CalendarMonth } from '@/components/calendar/CalendarMonth';
import { toDateKey } from '@/utils/calendarUtils';
import { DailyPatientsPanel } from './components/DailyPatientsPanel';
import './Agenda.css';
import { NewDoctorApptModal } from './components/NewDoctorApptModal';
import { api } from '@/services/api';


// TODO: BACKEND - Endpoint esperado: GET /api/medicos/:doctorId/citas?mes=2026-06
// A diferencia de MisCitas.jsx (paciente), aquí el backend debe traer TODAS las
// citas del médico sin importar el paciente, ordenadas para agrupar por día.
async function fetchCitasMedico(doctorId, year, month) {
  const mes = `${year}-${String(month + 1).padStart(2, '0')}`;
  return api.get(`/medicos/${doctorId}/citas?mes=${mes}`);
}

export const Agenda = () => {
  const { doctorId } = useOutletContext();
  const [showModal, setShowModal] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(new Date()));
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
    setShowModal(true);
  };
  
  const handleCitaCreada = (nuevaCita) => {
  setCitas((prev) => [...prev, nuevaCita]);
  setShowModal(false);
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
          {showModal && (
      <NewDoctorApptModal
        fechaInicial={selectedDateKey}
        onClose={() => setShowModal(false)}
        onCreated={handleCitaCreada}
      />
    )}
    </div>
  );
};

export default Agenda;