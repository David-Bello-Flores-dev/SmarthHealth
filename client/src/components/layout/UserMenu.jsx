import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { GearIcon, LogoutIcon, MailIcon, PhoneIcon } from './Icons';

const ROLE_LABEL = { paciente: 'Paciente', medico: 'Médico', secretaria: 'Secretaria' };

export const UserMenu = ({ userInitial }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    // Carga el perfil completo solo la primera vez que se abre (no en cada render)
    if (nextOpen && !perfil) {
      setLoading(true);
      try {
        const data = await api.get('/auth/perfil');
        setPerfil(data);
      } catch {
        // silencioso: si falla, el dropdown solo muestra lo básico que ya tenemos en el context
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleVerConfiguracion = () => {
    setOpen(false);
    navigate('/configuracion');
  };

  return (
    <div className="user-menu" ref={containerRef}>
      <button type="button" className="topbar-avatar" onClick={handleToggle}>
        {userInitial}
      </button>

      {open && (
        <div className="user-menu__dropdown">
          <div className="user-menu__header">
            <span className="user-menu__avatar">{userInitial}</span>
            <div>
              <strong>{perfil?.nombreCompleto ?? user?.nombre}</strong>
              <p>{ROLE_LABEL[user?.rol] ?? user?.rol}</p>
            </div>
          </div>

          {loading && <p className="user-menu__loading">Cargando datos...</p>}

          {perfil && !loading && (
            <div className="user-menu__details">
              {perfil.email && (
                <div className="user-menu__row">
                  <MailIcon width={14} height={14} />
                  <span>{perfil.email}</span>
                </div>
              )}
              {perfil.telefono && (
                <div className="user-menu__row">
                  <PhoneIcon width={14} height={14} />
                  <span>{perfil.telefono}</span>
                </div>
              )}
              <div className="user-menu__grid">
                <div>
                  <span className="user-menu__label">Edad</span>
                  <strong>{perfil.edad} años</strong>
                </div>
                <div>
                  <span className="user-menu__label">Sexo</span>
                  <strong>{perfil.sexo}</strong>
                </div>
                {perfil.rol === 'paciente' && (
                  <>
                    <div>
                      <span className="user-menu__label">Tipo de sangre</span>
                      <strong>{perfil.tipoSangre}</strong>
                    </div>
                    <div>
                      <span className="user-menu__label">NSS</span>
                      <strong>{perfil.nss}</strong>
                    </div>
                  </>
                )}
                {perfil.rol === 'medico' && (
                  <>
                    <div>
                      <span className="user-menu__label">Especialidad</span>
                      <strong>{perfil.especialidad}</strong>
                    </div>
                    <div>
                      <span className="user-menu__label">Cédula</span>
                      <strong>{perfil.cedula}</strong>
                    </div>
                  </>
                )}
                {perfil.rol === 'secretaria' && (
                  <>
                    <div>
                      <span className="user-menu__label">No. empleado</span>
                      <strong>{perfil.numEmpleado}</strong>
                    </div>
                    <div>
                      <span className="user-menu__label">Turno</span>
                      <strong>{perfil.turno}</strong>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="user-menu__actions">
            <button type="button" onClick={handleVerConfiguracion}>
              <GearIcon width={15} height={15} /> Configuración
            </button>
            <button type="button" onClick={handleLogout} className="user-menu__logout">
              <LogoutIcon width={15} height={15} /> Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};