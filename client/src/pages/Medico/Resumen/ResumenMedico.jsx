import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DoctorGreetingHeader } from './components/DoctorGreetingHeader';
import { DoctorStatsCards } from './components/DoctorStatsCards';
import { WeeklyAppointmentsChart } from './components/WeeklyAppointmentsChart';
import { ClinicalAlerts } from './components/ClinicalAlerts';
import './ResumenMedico.css';

// TODO: BACKEND - Endpoint esperado: GET /api/medicos/:doctorId/resumen
// "alertasClinicas" idealmente las genera el backend comparando resultados de
// laboratorio/signos vitales recientes contra rangos de referencia (T_RESULTADO_LABORATORIO,
// T_SIGNOS_VITALES) y eventos de agenda (citas canceladas sin reprogramar en T_CITA).
async function fetchResumenMedico(doctorId) {
  // --- MOCK: reemplazar por llamada real ---
  // const res = await api.get(`/medicos/${doctorId}/resumen`);
  // return res.data;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        medico: { nombre: 'Dr. Mora' },
        stats: {
          pacientesHoy: 5,
          pacientesHoyAtendidos: 2,
          citasSemana: 49,
          citasSemanaCompletadas: 45,
          recetasEmitidasMes: 18,
          satisfaccionPromedio: 98,
        },
        citasPorDiaSemana: [
          { dia: 'Lun', agendadas: 8, completadas: 8 },
          { dia: 'Mar', agendadas: 12, completadas: 11 },
          { dia: 'Mié', agendadas: 6, completadas: 6 },
          { dia: 'Jue', agendadas: 10, completadas: 9 },
          { dia: 'Vie', agendadas: 9, completadas: 8 },
          { dia: 'Sáb', agendadas: 4, completadas: 3 },
        ],
        alertasClinicas: [
          { id: 'a1', tipo: 'warning', paciente: 'Carlos Méndez', mensaje: 'Presión arterial elevada en último control' },
          { id: 'a2', tipo: 'critical', paciente: 'Pedro Ruiz', mensaje: 'Hemoglobina glucosilada fuera de rango' },
          { id: 'a3', tipo: 'info', paciente: 'Elena Castro', mensaje: 'Cita cancelada sin reprogramar' },
        ],
      });
    }, 400);
  });
}

export const ResumenMedico = () => {
  const { doctorId } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    fetchResumenMedico(doctorId)
      .then((res) => { if (activo) setData(res); })
      .catch((err) => { if (activo) setError(err); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, [doctorId]);

  if (loading) return <div className="page-state">Cargando resumen...</div>;
  if (error) return <div className="page-state page-state--error">No se pudo cargar el resumen.</div>;
  if (!data) return null;

  const handleNuevaReceta = () => {
    // TODO: BACKEND - abrir flujo de nueva receta (selector de paciente + medicamentos)
    console.log('Abrir flujo de nueva receta para', doctorId);
  };

  return (
    <div className="resumen-medico-page">
      <DoctorGreetingHeader
        nombreMedico={data.medico.nombre}
        pacientesHoy={data.stats.pacientesHoy}
        onNuevaReceta={handleNuevaReceta}
      />

      <DoctorStatsCards stats={data.stats} />

      <div className="resumen-medico-page__grid">
        <WeeklyAppointmentsChart datos={data.citasPorDiaSemana} />
        <ClinicalAlerts alertas={data.alertasClinicas} />
      </div>
    </div>
  );
};

export default ResumenMedico;