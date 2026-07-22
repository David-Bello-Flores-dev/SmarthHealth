import React, { useEffect, useState } from 'react';
import { OperationalStatsCards } from './components/OperationalStatsCards';
import { ReceptionGreetingHeader } from './components/ReceptionGreetingHeader';
import { QuickAccessLinks } from './components/QuickAccessLinks';
import { UpcomingAppointments } from '@/pages/Resumen/components/UpcomingAppointments';
import './ResumenSecretaria.css';

// TODO: BACKEND - Endpoint esperado: GET /api/clinica/resumen-recepcion
// Agrega citas de TODOS los médicos (no un solo doctorId), a diferencia del resumen de médico.
async function fetchResumenRecepcion() {
  // --- MOCK: reemplazar por llamada real ---
  // const res = await api.get('/clinica/resumen-recepcion');
  // return res.data;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: {
          citasHoy: 14,
          confirmadas: 9,
          pendientes: 5,
          pacientesRegistradosHoy: 3,
        },
        proximasCitas: [
          { id: 'c1', medico: 'Dr. Andrés Mora', especialidad: 'Medicina General', fechaLabel: 'Hoy', hora: '09:00', estatus: 'confirmada' },
          { id: 'c2', medico: 'Dra. Valentina Cruz', especialidad: 'Cardiología', fechaLabel: 'Hoy', hora: '10:00', estatus: 'pendiente' },
          { id: 'c3', medico: 'Dr. Marcos Ruiz', especialidad: 'Laboratorio', fechaLabel: 'Hoy', hora: '11:30', estatus: 'confirmada' },
        ],
      });
    }, 400);
  });
}

export const ResumenSecretaria = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    fetchResumenRecepcion()
      .then((res) => { if (activo) setData(res); })
      .catch((err) => { if (activo) setError(err); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, []);

  if (loading) return <div className="page-state">Cargando resumen...</div>;
  if (error) return <div className="page-state page-state--error">No se pudo cargar el resumen.</div>;
  if (!data) return null;

  return (
    <div className="resumen-secretaria-page">
      <ReceptionGreetingHeader />
      <OperationalStatsCards stats={data.stats} />

      <div className="resumen-secretaria-page__grid">
        <UpcomingAppointments 
        citas={data.proximasCitas} 
        verTodasHref="/secretaria/citas"
        />
        <QuickAccessLinks />
      </div>
    </div>
  );
};

export default ResumenSecretaria;