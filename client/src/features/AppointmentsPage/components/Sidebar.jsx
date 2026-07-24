import React from 'react';
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

// TODO: reemplazar <a> por <Link> de react-router-dom cuando se agreguen las rutas
const MENU_ITEMS = [
  { key: 'resumen', label: 'Resumen', icon: GridIcon, href: '/paciente/resumen' },
  { key: 'citas', label: 'Mis Citas', icon: CalendarIcon, href: '/paciente/citas' },
  { key: 'expediente', label: 'Mi Expediente', icon: FolderIcon, href: '/paciente/expediente' },
  { key: 'recetas', label: 'Recetas', icon: PillIcon, href: '/paciente/recetas' },
];

// TODO: userName y userRole deben venir del usuario autenticado (Redux / API)
export const Sidebar = ({ userName = '', userRole = '', activeItem = 'resumen' }) => {
  const initial = userName.trim().charAt(0).toUpperCase();

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
        {MENU_ITEMS.map(({ key, label, icon: Icon, href }) => {
          const isActive = key === activeItem;
          return (
            <a
              key={key}
              href={href}
              className={`sidebar-menu-item ${isActive ? 'sidebar-menu-item-active' : ''}`}
            >
              <span className="sidebar-menu-icon">
                <Icon width={18} height={18} />
              </span>
              <span className="sidebar-menu-label">{label}</span>
              {isActive && (
                <span className="sidebar-menu-chevron">
                  <ChevronRightIcon width={16} height={16} />
                </span>
              )}
            </a>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <a href="/configuracion" className="sidebar-footer-item">
          <GearIcon width={18} height={18} />
          <span>Configuración</span>
        </a>
        <a href="/logout" className="sidebar-footer-item">
          <LogoutIcon width={18} height={18} />
          <span>Cerrar sesión</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
