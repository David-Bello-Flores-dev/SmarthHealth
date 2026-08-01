import React, { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { PatientSummaryCard } from '@/components/clinical-record/PatientSummaryCard';
import { ChronicConditions } from '@/components/clinical-record/ChronicConditions';
import { LabResults } from '@/components/clinical-record/LabResults';
import { PatientSearchBar } from '@/components/patient-search/PatientSearchBar';
import './Expedientes.css';
import { api } from '@/services/api';


// TODO: BACKEND - Endpoint esperado: GET /api/medicos/:doctorId/pacientes?q=texto
// Debe buscar solo entre los pacientes asignados/atendidos por este médico, no en toda la base.
async function searchPacientes(_doctorId, query) {
  return api.get(`/pacientes?q=${encodeURIComponent(query)}`);
}

// TODO: BACKEND - Endpoint esperado: GET /api/pacientes/:patientId/expediente
// Es el MISMO endpoint que usa ExpedienteClinico.jsx (vista de paciente) — el backend
// solo necesita validar que el médico autenticado tenga permiso de ver a ese paciente.
async function fetchExpediente(patientId) {
  return api.get(`/pacientes/${patientId}/expediente`);
}

export const Expedientes = () => {
  const { doctorId } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPatientId = searchParams.get('paciente') ?? '1'; // default: primer paciente, solo para que la pantalla no arranque vacía

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    fetchExpediente(selectedPatientId)
      .then((res) => { if (activo) setData(res); })
      .catch((err) => { if (activo) setError(err); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, [selectedPatientId]);

  const handleSelectPatient = (patientId) => {
    setSearchParams({ paciente: patientId });
  };

  const imc = data ? (data.paciente.pesoKg / (data.paciente.tallaM * data.paciente.tallaM)).toFixed(1) : null;

  return (
    <div className="expedientes-medico-page">
      <header className="expedientes-medico-page__header">
        <h1>Expediente Clínico</h1>
        <p>Historial médico completo y resultados de laboratorio</p>
      </header>

      <PatientSearchBar
        doctorId={doctorId}
        selectedPatientId={selectedPatientId}
        onSearch={searchPacientes}
        onSelectPatient={handleSelectPatient}
      />

      {loading && <div className="page-state">Cargando expediente...</div>}
      {error && <div className="page-state page-state--error">No se pudo cargar el expediente clínico.</div>}

      {!loading && !error && data && (
        <>
          <PatientSummaryCard paciente={data.paciente} imc={imc} />
          <ChronicConditions padecimientos={data.padecimientosCronicos} />
          <LabResults resultados={data.laboratorio.resultados} ultimaToma={data.laboratorio.ultimaToma} />
        </>
      )}
    </div>
  );
};

export default Expedientes;