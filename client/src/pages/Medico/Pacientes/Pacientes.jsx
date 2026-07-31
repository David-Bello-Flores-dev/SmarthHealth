import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PatientsFilterBar } from './components/PatientsFilterBar';
import { PatientsTable } from './components/PatientsTable';
import './Pacientes.css';
import { api } from '@/services/api';

// TODO: BACKEND - Endpoint esperado: GET /api/medicos/:doctorId/pacientes
// A diferencia del buscador rápido de Expedientes/Recetas (que regresa solo id+nombre
// para el dropdown), aquí se necesita el listado completo con datos de resumen clínico
// para pintar la tabla (última visita, padecimiento principal, alertas).

async function fetchPacientes(doctorId) {
  return api.get(`/medicos/${doctorId}/pacientes`);
}

export const Pacientes = () => {
  const { doctorId } = useOutletContext();
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [soloAlertas, setSoloAlertas] = useState(false);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    fetchPacientes(doctorId)
      .then((res) => { if (activo) setPacientes(res); })
      .catch((err) => { if (activo) setError(err); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, [doctorId]);

  const pacientesFiltrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pacientes.filter((p) => {
      const coincideNombre = !q || p.nombre.toLowerCase().includes(q);
      const coincideAlerta = !soloAlertas || p.tieneAlerta;
      return coincideNombre && coincideAlerta;
    });
  }, [pacientes, query, soloAlertas]);

  const handleVerExpediente = (paciente) => {
    navigate(`/medico/expedientes?paciente=${paciente.id}&nombre=${encodeURIComponent(paciente.nombre)}`);
  };

  const handleNuevaReceta = (paciente) => {
    navigate(`/medico/recetas?paciente=${paciente.id}&nombre=${encodeURIComponent(paciente.nombre)}`);
  };

  return (
    <div className="pacientes-page">
      <header className="pacientes-page__header">
        <h1>Pacientes</h1>
        <p>Directorio de pacientes asignados</p>
      </header>

      <PatientsFilterBar
        query={query}
        onQueryChange={setQuery}
        soloAlertas={soloAlertas}
        onToggleAlertas={setSoloAlertas}
        total={pacientesFiltrados.length}
      />

      {loading && <div className="page-state">Cargando pacientes...</div>}
      {error && <div className="page-state page-state--error">No se pudo cargar el directorio de pacientes.</div>}

      {!loading && !error && (
        <PatientsTable
          pacientes={pacientesFiltrados}
          onVerExpediente={handleVerExpediente}
          onNuevaReceta={handleNuevaReceta}
        />
      )}
    </div>
  );
};

export default Pacientes;