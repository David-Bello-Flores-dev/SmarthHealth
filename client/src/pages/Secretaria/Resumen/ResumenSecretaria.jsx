import React, { useEffect, useState } from 'react';
import { OperationalStatsCards } from './components/OperationalStatsCards';
import { ReceptionGreetingHeader } from './components/ReceptionGreetingHeader';
import { QuickAccessLinks } from './components/QuickAccessLinks';
import { UpcomingAppointments } from '@/pages/Resumen/components/UpcomingAppointments';
import './ResumenSecretaria.css';
import { api } from '@/services/api';

// TODO: BACKEND - Endpoint esperado: GET /api/clinica/resumen-recepcion
// Agrega citas de TODOS los médicos (no un solo doctorId), a diferencia del resumen de médico.

async function fetchResumenRecepcion() {
  return api.get('/clinica/resumen-recepcion');
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