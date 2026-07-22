import React, { useEffect, useMemo, useState } from 'react';
import { CalendarMonth } from '@/components/calendar/CalendarMonth';
import { toDateKey } from '@/utils/calendarUtils';
import { ClinicAppointmentsPanel } from './components/ClinicAppointmentsPanel';
import { NewClinicApptModal } from './components/NewClinicApptModal';
import './CitasSecretaria.css';

// TODO: BACKEND - Endpoint esperado: GET /api/clinica/citas?mes=2026-06
// A diferencia de MisCitas (paciente) y Agenda (médico), aquí se traen las citas
// de TODOS los médicos de la clínica para ese mes.
async function fetchCitasClinica(year, month) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'c1', fecha: '2026-06-10', hora: '09:00', paciente: 'Carlos Méndez', medico: 'Dr. Andrés Mora', tipoConsulta: 'Consulta general', modalidad: 'presencial', estatus: 'confirmada' },
        { id: 'c2', fecha: '2026-06-10', hora: '10:30', paciente: 'Ana López', medico: 'Dr. Andrés Mora', tipoConsulta: 'Seguimiento', modalidad: 'videollamada', estatus: 'pendiente' },
        { id: 'c3', fecha: '2026-06-10', hora: '11:00', paciente: 'Elena Castro', medico: 'Dra. Valentina Cruz', tipoConsulta: 'Cardiología', modalidad: 'presencial', estatus: 'pendiente' },
        { id: 'c4', fecha: '2026-06-15', hora: '09:00', paciente: 'Luis Herrera', medico: 'Dr. Marcos Ruiz', tipoConsulta: 'Laboratorio', modalidad: 'presencial', estatus: 'confirmada' },
      ]);
    }, 400);
  });
}

// TODO: BACKEND - Endpoint esperado: GET /api/medicos (para el selector del modal)
async function fetchDoctores() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([
      { id: '456', nombre: 'Dr. Andrés Mora' },
      { id: '457', nombre: 'Dra. Valentina Cruz' },
      { id: '458', nombre: 'Dr. Marcos Ruiz' },
    ]), 200);
  });
}

// TODO: BACKEND - PATCH /api/citas/:citaId  { estatus: 'confirmada' }
async function confirmarCita(citaId) {
  return new Promise((resolve) => setTimeout(() => resolve({ id: citaId, estatus: 'confirmada' }), 300));
}

// TODO: BACKEND - POST /api/citas
async function crearCitaClinica(payload) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: `c${Date.now()}`, estatus: 'pendiente', ...payload }), 400);
  });
}

export const CitasSecretaria = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1));
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(new Date(2026, 5, 10)));
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    fetchCitasClinica(currentMonth.getFullYear(), currentMonth.getMonth())
      .then((res) => { if (activo) setCitas(res); })
      .catch((err) => { if (activo) setError(err); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, [currentMonth]);

  const citasPorDia = useMemo(() => {
    const map = {};
    for (const c of citas) (map[c.fecha] ??= []).push(c);
    return map;
  }, [citas]);

  const handleConfirmar = async (citaId) => {
    await confirmarCita(citaId);
    setCitas((prev) => prev.map((c) => (c.id === citaId ? { ...c, estatus: 'confirmada' } : c)));
  };

  const handleCrearCita = async (payload) => {
    const nueva = await crearCitaClinica({ ...payload, fecha: selectedDateKey });
    setCitas((prev) => [...prev, nueva]);
    setShowModal(false);
  };

  return (
    <div className="citas-secretaria-page">
      <div className="citas-secretaria-page__header">
        <div>
          <h1>Gestión de Citas</h1>
          <p>Agenda centralizada de todos los médicos</p>
        </div>
        <button type="button" className="btn-nueva-cita" onClick={() => setShowModal(true)}>
          + Nueva cita
        </button>
      </div>

      {loading && <div className="page-state">Cargando agenda...</div>}
      {error && <div className="page-state page-state--error">No se pudo cargar la agenda.</div>}

      {!loading && !error && (
        <div className="citas-secretaria-page__grid">
          <CalendarMonth
            currentMonth={currentMonth}
            selectedDateKey={selectedDateKey}
            citasPorDia={citasPorDia}
            onSelectDate={setSelectedDateKey}
            onPrevMonth={() => setCurrentMonth((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1))}
            onNextMonth={() => setCurrentMonth((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1))}
          />
          <ClinicAppointmentsPanel
            selectedDateKey={selectedDateKey}
            citas={citasPorDia[selectedDateKey] ?? []}
            onConfirmar={handleConfirmar}
          />
        </div>
      )}

      {showModal && (
        <NewClinicApptModal
          fetchDoctores={fetchDoctores}
          onClose={() => setShowModal(false)}
          onSubmit={handleCrearCita}
        />
      )}
    </div>
  );
};

export default CitasSecretaria;