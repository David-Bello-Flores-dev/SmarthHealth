import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '@/context/AuthContext';
import {
  ActivityIcon,
  GridIcon,
  CalendarIcon,
  FolderIcon,
  PillIcon,
  UsersIcon,
  GearIcon,
  LogoutIcon,
  ChevronRightIcon,
} from './Icons';

// TODO: BACKEND - si algún rol necesita permisos más finos que "ve/no ve un menú"
// (ej. secretaria con acceso parcial a expedientes), esto debe moverse a un
// endpoint de permisos en vez de un mapa fijo en el front.
const MENU_ITEMS_BY_ROLE = {
  paciente: [
    { key: 'resumen', label: 'Resumen', icon: GridIcon, href: '/paciente/resumen' },
    { key: 'citas', label: 'Mis Citas', icon: CalendarIcon, href: '/paciente/citas' },
    { key: 'expediente', label: 'Mi Expediente', icon: FolderIcon, href: '/paciente/expediente' },
    { key: 'recetas', label: 'Recetas', icon: PillIcon, href: '/paciente/recetas' },
  ],
  medico: [
    { key: 'resumen', label: 'Resumen', icon: GridIcon, href: '/medico/resumen' },
    { key: 'agenda', label: 'Agenda', icon: CalendarIcon, href: '/medico/agenda' },
    { key: 'expedientes', label: 'Expedientes', icon: FolderIcon, href: '/medico/expedientes' },
    { key: 'recetas', label: 'Recetas', icon: PillIcon, href: '/medico/recetas' },
    { key: 'pacientes', label: 'Pacientes', icon: UsersIcon, href: '/medico/pacientes' },
  ],
  secretaria: [
    { key: 'resumen', label: 'Resumen', icon: GridIcon, href: '/secretaria/resumen' },
    { key: 'citas', label: 'Citas', icon: CalendarIcon, href: '/secretaria/citas' },
    { key: 'expedientes', label: 'Expedientes', icon: FolderIcon, href: '/secretaria/expedientes' },
  ],
};

const ROLE_LABEL = {
  paciente: 'Paciente',
  medico: 'Médico',
  secretaria: 'Secretaria',
};

export const Sidebar = ({ userName = '', role = 'paciente' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const initial = userName.trim().charAt(0).toUpperCase();
  const menuItems = MENU_ITEMS_BY_ROLE[role] ?? [];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">
          <ActivityIcon width={18} height={18} />
        </span>
        <span className="sidebar-brand-name">SmartHealth</span>
      </div>

      <div className="sidebar-user">
        <span className="sidebar-user-avatar">{initial}</span>
        <div>
          <p className="sidebar-user-name">{userName || '—'}</p>
          <p className="sidebar-user-role">{ROLE_LABEL[role] ?? role}</p>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map(({ key, label, icon: Icon, href }) => (
          <NavLink
            key={key}
            to={href}
            className={({ isActive }) =>
              `sidebar-menu-item ${isActive ? 'sidebar-menu-item-active' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <span className="sidebar-menu-icon">
                  <Icon width={18} height={18} />
                </span>
                <span className="sidebar-menu-label">{label}</span>
                {isActive && (
                  <span className="sidebar-menu-chevron">
                    <ChevronRightIcon width={16} height={16} />
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/configuracion" className="sidebar-footer-item">
          <GearIcon width={18} height={18} />
          <span>Configuración</span>
        </NavLink>
        <button type="button" className="sidebar-footer-item sidebar-footer-item--button" onClick={handleLogout}>
          <LogoutIcon width={18} height={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;