import { useOutletContext } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { PatientSummaryCard } from '@/components/clinical-record/PatientSummaryCard';
import { ChronicConditions } from '@/components/clinical-record/ChronicConditions';
import { LabResults } from '@/components/clinical-record/LabResults';
import './ExpedienteClinico.css';

// TODO: BACKEND - Mover a src/services/expedienteService.js cuando exista el cliente HTTP (axios/fetch wrapper)
// Endpoint esperado: GET /api/pacientes/:pacienteId/expediente
async function fetchExpediente(pacienteId) {
  // --- MOCK: reemplazar por llamada real ---
  // const res = await api.get(`/pacientes/${pacienteId}/expediente`);
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
        padecimientosCronicos: [
          'Hipertensión arterial controlada',
          'Diabetes tipo 2 (seguimiento)',
        ],
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