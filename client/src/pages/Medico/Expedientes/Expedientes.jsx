import React, { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { PatientSummaryCard } from '@/components/clinical-record/PatientSummaryCard';
import { ChronicConditions } from '@/components/clinical-record/ChronicConditions';
import { LabResults } from '@/components/clinical-record/LabResults';
import { PatientSearchBar } from '@/components/patient-search/PatientSearchBar';
import './Expedientes.css';


// TODO: BACKEND - Endpoint esperado: GET /api/medicos/:doctorId/pacientes?q=texto
// Debe buscar solo entre los pacientes asignados/atendidos por este médico, no en toda la base.
async function searchPacientes(doctorId, query) {
  // --- MOCK: reemplazar por llamada real ---
  // const res = await api.get(`/medicos/${doctorId}/pacientes`, { params: { q: query } });
  // return res.data;
  const TODOS = [
    { id: '123', nombre: 'María García López' },
    { id: '456', nombre: 'Carlos Méndez' },
    { id: '789', nombre: 'Ana López' },
    { id: '321', nombre: 'Pedro Ruiz' },
  ];
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.trim().toLowerCase();
      resolve(q ? TODOS.filter((p) => p.nombre.toLowerCase().includes(q)) : TODOS);
    }, 250);
  });
}

// TODO: BACKEND - Endpoint esperado: GET /api/pacientes/:patientId/expediente
// Es el MISMO endpoint que usa ExpedienteClinico.jsx (vista de paciente) — el backend
// solo necesita validar que el médico autenticado tenga permiso de ver a ese paciente.
async function fetchExpediente(patientId) {
  // --- MOCK: reemplazar por llamada real ---
  // const res = await api.get(`/pacientes/${patientId}/expediente`);
  // return res.data;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        paciente: {
          nombre: 'María García López',
          iniciales: 'MG',
          fechaNacimiento: '1985-03-15',
          edad: 41,
          tipoSangre: 'O+',
          pesoKg: 68,
          tallaM: 1.65,
          alergias: ['Penicilina', 'Sulfas'],
        },
        padecimientosCronicos: ['Hipertensión arterial controlada', 'Diabetes tipo 2 (seguimiento)'],
        laboratorio: {
          ultimaToma: '2026-06-05',
          resultados: [
            { id: 1, nombre: 'Glucosa en ayunas', valor: '108 mg/dL', refMin: 70, refMax: 100, refUnidad: 'mg/dL', estatus: 'elevado' },
            { id: 2, nombre: 'Hemoglobina glucosilada (HbA1c)', valor: '6.8%', refMin: 4, refMax: 5.6, refUnidad: '%', estatus: 'elevado' },
            { id: 3, nombre: 'Colesterol total', valor: '185 mg/dL', refMax: 200, refUnidad: 'mg/dL', estatus: 'normal' },
            { id: 4, nombre: 'Triglicéridos', valor: '142 mg/dL', refMax: 150, refUnidad: 'mg/dL', estatus: 'normal' },
            { id: 5, nombre: 'Presión arterial', valor: '119/77 mmHg', refMax: '120/80', refUnidad: 'mmHg', estatus: 'normal' },
          ],
        },
      });
    }, 400);
  });
}

export const Expedientes = () => {
  const { doctorId } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPatientId = searchParams.get('paciente') ?? '123'; // default: primer paciente, solo para que la pantalla no arranque vacía

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