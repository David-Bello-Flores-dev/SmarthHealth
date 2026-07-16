import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { useAuth } from '../context/AuthContext';
import './AppLayout.css';

const ROUTE_META = {
  '/paciente/resumen': { title: 'Resumen', subtitle: 'SmartHealth · Paciente' },
  '/paciente/citas': { title: 'Mis Citas', subtitle: 'SmartHealth · Paciente' },
  '/paciente/expediente': { title: 'Mi Expediente', subtitle: 'SmartHealth · Paciente' },
  '/paciente/recetas': { title: 'Recetas', subtitle: 'SmartHealth · Paciente' },
};

export const AppLayout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const meta = ROUTE_META[location.pathname] ?? { title: '', subtitle: '' };

  return (
    <div className="app-layout">
      <Sidebar userName={user.nombre} userRole={user.rol === 'paciente' ? 'Paciente' : user.rol} />

      <div className="app-layout__main">
        <TopBar
          title={meta.title}
          subtitle={meta.subtitle}
          userInitial={user.nombre.trim().charAt(0).toUpperCase()}
        />
        <div className="app-layout__content">
          <Outlet context={{ pacienteId: user.pacienteId }} />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;