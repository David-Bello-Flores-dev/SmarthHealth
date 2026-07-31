import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GreetingHeader } from './components/GreetingHeader';
import { VitalsCards } from './components/VitalsCards';
import { BloodPressureChart } from './components/BloodPressureChart';
import { UpcomingAppointments } from './components/UpcomingAppointments';
import './Resumen.css';
import { api } from '@/services/api';
import { NewAppointmentModal } from '@/components/appointments/NewAppointmentModal';

// TODO: BACKEND - Endpoint esperado: GET /api/pacientes/:pacienteId/resumen
// Puede ser un solo endpoint agregador (como aquí) o 3 llamadas separadas
// (signos vitales / tendencia / próximas citas) si el backend prefiere desacoplarlo.



export const Resumen = () => {
  const { pacienteId } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    fetchResumen(pacienteId)
      .then((res) => { if (activo) setData(res); })
      .catch((err) => { if (activo) setError(err); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, [pacienteId]);

  if (loading) return <div className="resumen-page__state">Cargando resumen...</div>;
  if (error) return <div className="resumen-page__state resumen-page__state--error">No se pudo cargar tu resumen.</div>;
  if (!data) return null;

  

  const handleNuevaCita = () => {
    setShowModal(true);
  };

  const handleCitaCreada = () => {
    setShowModal(false);
    // Como Resumen no mantiene la lista completa de citas (solo "próximas 3"),
    // lo más simple es refrescar todo el resumen para reflejar la nueva cita.
    setLoading(true);
    fetchResumen(pacienteId).then(setData).finally(() => setLoading(false));
  };

  async function fetchResumen(pacienteId) {
    return api.get(`/pacientes/${pacienteId}/resumen`);
  }



  return (
    <div className="resumen-page">
      <GreetingHeader nombre={data.paciente.nombre} onNuevaCita={handleNuevaCita} />

      <VitalsCards signosVitales={data.signosVitales} />

      <div className="resumen-page__grid">
        <BloodPressureChart datos={data.tendenciaPresionArterial} />
        <UpcomingAppointments citas={data.proximasCitas} />
      </div>
      {showModal && (
  <NewAppointmentModal
    onClose={() => setShowModal(false)}
    onCreated={handleCitaCreada}
  />
)}
    </div>
  );
};

export default Resumen;