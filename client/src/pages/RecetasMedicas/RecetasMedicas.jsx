import { useOutletContext } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { RecetaTabs } from './components/RecetaTabs';
import { RecetaCard } from './components/RecetaCard';
import './RecetasMedicas.css';

// TODO: BACKEND - Endpoint esperado: GET /api/pacientes/:pacienteId/recetas
// Debe regresar un arreglo de recetas, la más reciente primero.
async function fetchRecetas(pacienteId) {
  // --- MOCK: reemplazar por llamada real ---
  // const res = await api.get(`/pacientes/${pacienteId}/recetas`);
  // return res.data;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'RX-2026-001',
          fechaEmision: '2026-06-10',
          medico: {
            nombre: 'Dr. Andrés Mora',
            especialidad: 'Medicina General',
            cedula: '12345678',
          },
          paciente: {
            nombre: 'María García López',
            fechaNacimiento: '1985-03-15',
          },
          diagnostico: 'Hipertensión arterial + seguimiento metabólico',
          medicamentos: [
            {
              id: 1,
              nombre: 'Enalapril',
              dosis: '10 mg',
              via: 'Oral',
              frecuencia: 'Cada 12 horas',
              duracion: '30 días',
              instrucciones: 'Tomar con agua, preferentemente en ayunas',
            },
            {
              id: 2,
              nombre: 'Metformina',
              dosis: '500 mg',
              via: 'Oral',
              frecuencia: 'Cada 24 horas',
              duracion: '30 días',
              instrucciones: 'Tomar con los alimentos',
            },
          ],
        },
        {
          id: 'RX-2026-002',
          fechaEmision: '2026-04-22',
          medico: {
            nombre: 'Dra. Lucía Fernández',
            especialidad: 'Endocrinología',
            cedula: '87654321',
          },
          paciente: {
            nombre: 'María García López',
            fechaNacimiento: '1985-03-15',
          },
          diagnostico: 'Diabetes tipo 2, ajuste de tratamiento',
          medicamentos: [
            {
              id: 1,
              nombre: 'Metformina',
              dosis: '850 mg',
              via: 'Oral',
              frecuencia: 'Cada 12 horas',
              duracion: '60 días',
              instrucciones: 'Tomar después de los alimentos',
            },
          ],
        },
      ]);
    }, 400);
  });
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