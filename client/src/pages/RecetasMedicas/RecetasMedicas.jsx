import { useOutletContext } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { RecetaTabs } from '@/components/prescriptions/RecetaTabs';
import { RecetaCard } from '@/components/prescriptions/RecetaCard';
import './RecetasMedicas.css';
import { api } from '@/services/api';

// TODO: BACKEND - Endpoint esperado: GET /api/pacientes/:pacienteId/recetas
// Debe regresar un arreglo de recetas, la más reciente primero.
async function fetchRecetas(pacienteId) {
  return api.get(`/pacientes/${pacienteId}/recetas`);
}

export const RecetasMedicas = () => {
  const { pacienteId } = useOutletContext();
  const [recetas, setRecetas] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    fetchRecetas(pacienteId)
      .then((res) => {
        if (!activo) return;
        setRecetas(res);
        setSelectedId(res[0]?.id ?? null);
      })
      .catch((err) => { if (activo) setError(err); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, [pacienteId]);

  if (loading) return <div className="recetas-page__state">Cargando recetas...</div>;
  if (error) return <div className="recetas-page__state recetas-page__state--error">No se pudieron cargar las recetas.</div>;
  if (!recetas.length) return <div className="recetas-page__state">Este paciente no tiene recetas registradas.</div>;

  const recetaActiva = recetas.find((r) => r.id === selectedId);

  return (
    <div className="recetas-page">
      <header className="recetas-page__header">
        <h1>Recetas Médicas</h1>
        <p>Gestión de recetas digitales y prescripciones</p>
      </header>

      <RecetaTabs
        recetas={recetas}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {recetaActiva && <RecetaCard receta={recetaActiva} />}
    </div>
  );
};

export default RecetasMedicas;