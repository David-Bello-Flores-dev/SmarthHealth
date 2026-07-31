import React, { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { PatientSearchBar } from '@/components/patient-search/PatientSearchBar';
import { RecetaTabs } from '@/components/prescriptions/RecetaTabs';
import { RecetaCard } from '@/components/prescriptions/RecetaCard';
import { NuevaRecetaModal } from './components/NuevaRecetaModal';
import './Recetas.css';
import { api } from '@/services/api';

// TODO: BACKEND - mismo directorio de pacientes que usa Expedientes.jsx.
// Considerar centralizar esta función en un solo servicio (services/pacientesService.js)
// en vez de repetirla en cada pantalla que necesita buscar pacientes.
async function searchPacientes(_doctorId, query) {
  return api.get(`/pacientes?q=${encodeURIComponent(query)}`);
}

// TODO: BACKEND - Endpoint esperado: GET /api/pacientes/:patientId/recetas
// Mismo endpoint que RecetasMedicas.jsx (paciente); el backend solo valida
// que el médico autenticado tenga permiso de ver a ese paciente.
async function fetchRecetas(patientId) {
  return api.get(`/pacientes/${patientId}/recetas`);
}

// TODO: BACKEND - Endpoint esperado: POST /api/pacientes/:patientId/recetas
// Body esperado: { diagnostico, medicamentos: [{ nombre, dosis, via, frecuencia, duracion, instrucciones }] }
// El backend debe generar el folio (RX-2026-XXX) y la fecha de emisión; el front no las inventa.
async function crearReceta(_doctorInfo, patientId, payload) {
  return api.post(`/pacientes/${patientId}/recetas`, {
    diagnostico: payload.diagnostico,
    medicamentos: payload.medicamentos,
  });
}

export const Recetas = () => {
  const { doctorId } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPatientId = searchParams.get('paciente') ?? '1';
  const selectedPatientName = searchParams.get('nombre') ?? 'María García López'; // TODO: BACKEND - idealmente vendría del detalle del paciente, no de la URL

  const [recetas, setRecetas] = useState([]);
  const [selectedRecetaId, setSelectedRecetaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    fetchRecetas(selectedPatientId)
      .then((res) => {
        if (!activo) return;
        setRecetas(res);
        setSelectedRecetaId(res[0]?.id ?? null);
      })
      .catch((err) => { if (activo) setError(err); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, [selectedPatientId]);

  const handleSelectPatient = (patientId, patientName) => {
    setSearchParams({ paciente: patientId, nombre: patientName });
  };

  const handleCrearReceta = async ({ diagnostico, medicamentos }) => {
    setSaving(true);
    try {
      // TODO: BACKEND - reemplazar por datos reales del médico autenticado (useAuth)
      const doctorInfo = { nombre: 'Dr. Andrés Mora', especialidad: 'Medicina General', cedula: '12345678' };
      const paciente = { nombre: selectedPatientName, fechaNacimiento: '1985-03-15' };

      const nuevaReceta = await crearReceta(doctorInfo, selectedPatientId, { diagnostico, medicamentos, paciente });
      setRecetas((prev) => [nuevaReceta, ...prev]);
      setSelectedRecetaId(nuevaReceta.id);
      setShowModal(false);
    } catch (err) {
      // TODO: BACKEND - mostrar el error real de validación del servidor en vez de solo loguearlo
      console.error('No se pudo crear la receta', err);
    } finally {
      setSaving(false);
    }
  };

  const recetaActiva = recetas.find((r) => r.id === selectedRecetaId);

  return (
    <div className="recetas-medico-page">
      <div className="recetas-medico-page__header">
        <div>
          <h1>Recetas Médicas</h1>
          <p>Gestión de recetas digitales y prescripciones</p>
        </div>
        <button type="button" className="btn-nueva-receta" onClick={() => setShowModal(true)}>
          + Nueva receta
        </button>
      </div>

      <PatientSearchBar
        doctorId={doctorId}
        selectedPatientId={selectedPatientId}
        onSearch={searchPacientes}
        onSelectPatient={handleSelectPatient}
      />

      {loading && <div className="page-state">Cargando recetas...</div>}
      {error && <div className="page-state page-state--error">No se pudieron cargar las recetas.</div>}

      {!loading && !error && (
        recetas.length === 0 ? (
          <div className="page-state">Este paciente no tiene recetas registradas.</div>
        ) : (
          <>
            <RecetaTabs recetas={recetas} selectedId={selectedRecetaId} onSelect={setSelectedRecetaId} />
            {recetaActiva && <RecetaCard receta={recetaActiva} />}
          </>
        )
      )}

      {showModal && (
        <NuevaRecetaModal
          pacienteNombre={selectedPatientName}
          saving={saving}
          onClose={() => setShowModal(false)}
          onSubmit={handleCrearReceta}
        />
      )}
    </div>
  );
};

export default Recetas;