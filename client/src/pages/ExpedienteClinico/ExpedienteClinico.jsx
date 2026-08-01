import { useOutletContext } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { PatientSummaryCard } from '@/components/clinical-record/PatientSummaryCard';
import { ChronicConditions } from '@/components/clinical-record/ChronicConditions';
import { LabResults } from '@/components/clinical-record/LabResults';
import './ExpedienteClinico.css';
import { api } from '@/services/api';

// TODO: BACKEND - Mover a src/services/expedienteService.js cuando exista el cliente HTTP (axios/fetch wrapper)
// Endpoint esperado: GET /api/pacientes/:pacienteId/expediente
async function fetchExpediente(pacienteId) {
  return api.get(`/pacientes/${pacienteId}/expediente`);
}

export const ExpedienteClinico = () => {
  const { pacienteId } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    fetchExpediente(pacienteId)
      .then((res) => { if (activo) setData(res); })
      .catch((err) => { if (activo) setError(err); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, [pacienteId]);

  if (loading) return <div className="expediente-page__state">Cargando expediente...</div>;
  if (error) return <div className="expediente-page__state expediente-page__state--error">No se pudo cargar el expediente clínico.</div>;
  if (!data) return null;

  const imc = (data.paciente.pesoKg / (data.paciente.tallaM * data.paciente.tallaM)).toFixed(1);

  return (
    <div className="expediente-page">

      <PatientSummaryCard paciente={data.paciente} imc={imc} />
      <ChronicConditions padecimientos={data.padecimientosCronicos} />
      <LabResults
        resultados={data.laboratorio.resultados}
        ultimaToma={data.laboratorio.ultimaToma}
      />
    </div>
  );
};

export default ExpedienteClinico;