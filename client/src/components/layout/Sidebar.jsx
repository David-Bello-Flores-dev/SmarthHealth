import React from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import {
  ActivityIcon,
  GridIcon,
  CalendarIcon,
  FolderIcon,
  PillIcon,
  GearIcon,
  LogoutIcon,
  ChevronRightIcon,
} from './Icons';

const MENU_ITEMS = [
  { key: 'resumen', label: 'Resumen', icon: GridIcon, href: '/paciente/resumen' },
  { key: 'citas', label: 'Mis Citas', icon: CalendarIcon, href: '/paciente/citas' },
  { key: 'expediente', label: 'Mi Expediente', icon: FolderIcon, href: '/paciente/expediente' },
  { key: 'recetas', label: 'Recetas', icon: PillIcon, href: '/paciente/recetas' },
];

export const Sidebar = ({ userName = '', userRole = '' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const initial = userName.trim().charAt(0).toUpperCase();

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
          <p className="sidebar-user-role">{userRole || '—'}</p>
        </div>
      </div>

      <nav className="sidebar-menu">
        {MENU_ITEMS.map(({ key, label, icon: Icon, href }) => (
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

        <button
          type="button"
          className="sidebar-footer-item sidebar-footer-item--button"
          onClick={handleLogout}
        >
          <LogoutIcon width={18} height={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;