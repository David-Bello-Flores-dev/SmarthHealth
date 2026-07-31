import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import './Configuracion.css';

const ROLE_LABEL = { paciente: 'Paciente', medico: 'Médico', secretaria: 'Secretaria' };

export const Configuracion = () => {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    api.get('/auth/perfil')
      .then((res) => { if (activo) setPerfil(res); })
      .catch((err) => { if (activo) setError(err); })
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, []);

  if (loading) return <div className="page-state">Cargando configuración...</div>;
  if (error) return <div className="page-state page-state--error">No se pudo cargar tu información.</div>;
  if (!perfil) return null;

  return (
    <div className="configuracion-page">
      <header>
        <h1>Configuración</h1>
        <p>Información de tu cuenta</p>
      </header>

      <section className="config-card">
        <div className="config-card__avatar-row">
          <span className="config-card__avatar">{perfil.nombreCompleto.charAt(0).toUpperCase()}</span>
          <div>
            <h2>{perfil.nombreCompleto}</h2>
            <p>{ROLE_LABEL[perfil.rol] ?? perfil.rol}</p>
          </div>
        </div>

        <div className="config-card__grid">
          <div>
            <span>Correo electrónico</span>
            <strong>{perfil.email ?? '—'}</strong>
          </div>
          <div>
            <span>Teléfono</span>
            <strong>{perfil.telefono ?? '—'}</strong>
          </div>
          <div>
            <span>Edad</span>
            <strong>{perfil.edad} años</strong>
          </div>
          <div>
            <span>Sexo</span>
            <strong>{perfil.sexo}</strong>
          </div>

          {perfil.rol === 'paciente' && (
            <>
              <div><span>Tipo de sangre</span><strong>{perfil.tipoSangre}</strong></div>
              <div><span>NSS</span><strong>{perfil.nss}</strong></div>
            </>
          )}
          {perfil.rol === 'medico' && (
            <>
              <div><span>Especialidad</span><strong>{perfil.especialidad}</strong></div>
              <div><span>Cédula profesional</span><strong>{perfil.cedula}</strong></div>
              <div><span>Consultorio</span><strong>{perfil.consultorio ?? '—'}</strong></div>
            </>
          )}
          {perfil.rol === 'secretaria' && (
            <>
              <div><span>No. de empleado</span><strong>{perfil.numEmpleado}</strong></div>
              <div><span>Turno</span><strong>{perfil.turno}</strong></div>
            </>
          )}
        </div>
      </section>

      {/* TODO: BACKEND - sección de cambio de contraseña. Requiere endpoint
          PATCH /api/auth/password { passwordActual, passwordNueva } que revalide
          la contraseña actual con bcrypt.compare antes de permitir el cambio. */}
      <section className="config-card config-card--placeholder">
        <h3>Seguridad</h3>
        <p>Próximamente: cambio de contraseña.</p>
      </section>
    </div>
  );
};

export default Configuracion;