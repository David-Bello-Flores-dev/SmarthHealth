// src/pages/Secretaria/Expedientes/ExpedientesSecretaria.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PatientSearchBar } from '@/components/patient-search/PatientSearchBar';
import { PatientSummaryCard } from '@/components/clinical-record/PatientSummaryCard';
import { LabResults } from '@/components/clinical-record/LabResults';
import './ExpedientesSecretaria.css';
import { api } from '@/services/api';

async function searchPacientes(_doctorId, query) {
  return api.get(`/pacientes?q=${encodeURIComponent(query)}`);
}

// TODO: BACKEND - Endpoint esperado: GET /api/pacientes/:patientId/expediente-basico
// Version reducida del expediente completo: SIN padecimientos crónicos ni notas clínicas,
// solo lo necesario para atender dudas de mostrador (alergias, tipo de sangre, laboratorio).
async function fetchExpedienteBasico(patientId) {
  return api.get(`/pacientes/${patientId}/expediente-basico`);
}

export const ExpedientesSecretaria = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPatientId = searchParams.get('paciente');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedPatientId) return;
    setLoading(true);
    fetchExpedienteBasico(selectedPatientId).then(setData).finally(() => setLoading(false));
  }, [selectedPatientId]);

  const imc = data ? (data.paciente.pesoKg / (data.paciente.tallaM ** 2)).toFixed(1) : null;

  return (
    <div className="expedientes-secretaria-page">
      <header>
        <h1>Expedientes</h1>
        <p>Consulta rápida de alergias, tipo de sangre y laboratorio</p>
      </header>

      <PatientSearchBar
        doctorId={null}
        onSearch={searchPacientes}
        onSelectPatient={(id) => setSearchParams({ paciente: id })}
      />

      {!selectedPatientId && <div className="page-state">Busca un paciente para ver su expediente básico.</div>}
      {loading && <div className="page-state">Cargando...</div>}

      {data && !loading && (
        <>
          <PatientSummaryCard paciente={data.paciente} imc={imc} />
          <LabResults resultados={data.laboratorio.resultados} ultimaToma={data.laboratorio.ultimaToma} />
        </>
      )}
    </div>
  );
};

export default ExpedientesSecretaria;