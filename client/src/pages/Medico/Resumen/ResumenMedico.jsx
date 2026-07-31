import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DoctorGreetingHeader } from './components/DoctorGreetingHeader';
import { DoctorStatsCards } from './components/DoctorStatsCards';
import { WeeklyAppointmentsChart } from './components/WeeklyAppointmentsChart';
import { ClinicalAlerts } from './components/ClinicalAlerts';
import './ResumenMedico.css';
import { api } from '@/services/api';

// TODO: BACKEND - Endpoint esperado: GET /api/medicos/:doctorId/resumen
// "alertasClinicas" idealmente las genera el backend comparando resultados de
// laboratorio/signos vitales recientes contra rangos de referencia (T_RESULTADO_LABORATORIO,
// T_SIGNOS_VITALES) y eventos de agenda (citas canceladas sin reprogramar en T_CITA).

async function fetchResumenMedico(doctorId) {
  return api.get(`/medicos/${doctorId}/resumen`);
}

export const ResumenMedico = () => {
  const { doctorId } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleNuevaReceta = () => {
    // TODO: BACKEND - abrir flujo de nueva receta (selector de paciente + medicamentos)
  console.log('Abrir flujo de nueva receta para', doctorId);
  };

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

  



  return (
    <div className="resumen-medico-page">
      <DoctorGreetingHeader
        nombreMedico={data.medico?.nombre ?? 'Doctor/a'}
        pacientesHoy={data.stats?.pacientesHoy ?? 0}
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