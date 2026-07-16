import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GreetingHeader } from './components/GreetingHeader';
import { VitalsCards } from './components/VitalsCards';
import { BloodPressureChart } from './components/BloodPressureChart';
import { UpcomingAppointments } from './components/UpcomingAppointments';
import './Resumen.css';

// TODO: BACKEND - Endpoint esperado: GET /api/pacientes/:pacienteId/resumen
// Puede ser un solo endpoint agregador (como aquí) o 3 llamadas separadas
// (signos vitales / tendencia / próximas citas) si el backend prefiere desacoplarlo.
async function fetchResumen(pacienteId) {
  // --- MOCK: reemplazar por llamada real ---
  // const res = await api.get(`/pacientes/${pacienteId}/resumen`);
  // return res.data;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        paciente: { nombre: 'María' },
        signosVitales: {
          frecuenciaCardiaca: { valor: 72, unidad: 'lpm', estatus: 'normal' },
          presionArterial: { sistolica: 119, diastolica: 77, unidad: 'mmHg', estatus: 'normal' },
          temperatura: { valor: 36.7, unidad: '°C', estatus: 'normal' },
          glucosa: { valor: 94, unidad: 'mg/dL', estatus: 'normal' },
        },
        tendenciaPresionArterial: [
          { mes: 'Ene', sistolica: 122, diastolica: 80 },
          { mes: 'Feb', sistolica: 124, diastolica: 81 },
          { mes: 'Mar', sistolica: 121, diastolica: 79 },
          { mes: 'Abr', sistolica: 118, diastolica: 78 },
          { mes: 'May', sistolica: 120, diastolica: 78 },
          { mes: 'Jun', sistolica: 119, diastolica: 77 },
        ],
        proximasCitas: [
          { id: 'c1', medico: 'Dr. Andrés Mora', especialidad: 'Medicina General', fechaLabel: 'Hoy', hora: '14:30', estatus: 'confirmada' },
          { id: 'c2', medico: 'Dra. Valentina Cruz', especialidad: 'Cardiología', fechaLabel: 'Mié 21 Jun', hora: '10:00', estatus: 'pendiente' },
          { id: 'c3', medico: 'Dr. Marcos Ruiz', especialidad: 'Laboratorio', fechaLabel: 'Vie 23 Jun', hora: '09:00', estatus: 'confirmada' },
        ],
      });
    }, 400);
  });
}

export const Resumen = () => {
  const { pacienteId } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    // TODO: BACKEND - mismo flujo de "Nueva cita" que en MisCitas.jsx; idealmente
    // centralizar esto en un solo hook/modal compartido entre ambas pantallas.
    console.log('Abrir flujo de nueva cita');
  };

  return (
    <div className="resumen-page">
      <GreetingHeader nombre={data.paciente.nombre} onNuevaCita={handleNuevaCita} />

      <VitalsCards signosVitales={data.signosVitales} />

      <div className="resumen-page__grid">
        <BloodPressureChart datos={data.tendenciaPresionArterial} />
        <UpcomingAppointments citas={data.proximasCitas} />
      </div>
    </div>
  );
};

export default Resumen;