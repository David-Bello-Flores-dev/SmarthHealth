import React from 'react';
import { BellIcon } from './Icons';

// TODO: title/subtitle/userInitial deben venir de la ruta activa y del usuario autenticado
export const TopBar = ({ title = '', subtitle = '', userInitial = '' }) => {
  return (
    <header className="dashboard-topbar">
      <div>
        <h1 className="topbar-title">{title}</h1>
        <p className="topbar-subtitle">{subtitle}</p>
      </div>

      <div className="topbar-actions">
        <button type="button" className="topbar-icon-btn" aria-label="Notificaciones">
          <BellIcon width={18} height={18} />
          <span className="topbar-notification-dot" />
        </button>
        <span className="topbar-avatar">{userInitial}</span>
      </div>
    </header>
  );
};

export default TopBar;
