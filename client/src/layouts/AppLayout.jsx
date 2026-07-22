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
  '/medico/resumen': { title: 'Resumen', subtitle: 'SmartHealth · Médico' },
  '/medico/agenda': { title: 'Agenda', subtitle: 'SmartHealth · Médico' },
  '/medico/expedientes': { title: 'Expedientes', subtitle: 'SmartHealth · Médico' },
  '/medico/recetas': { title: 'Recetas', subtitle: 'SmartHealth · Médico' },
  '/medico/pacientes': { title: 'Pacientes', subtitle: 'SmartHealth · Médico' },
  '/secretaria/resumen': { title: 'Resumen', subtitle: 'SmartHealth · Recepción' },
  '/secretaria/citas': { title: 'Citas', subtitle: 'SmartHealth · Recepción' },
  '/secretaria/expedientes': { title: 'Expedientes', subtitle: 'SmartHealth · Recepción' }
};

export const AppLayout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const meta = ROUTE_META[location.pathname] ?? { title: '', subtitle: '' };

  return (
    <div className="app-layout">
      <Sidebar userName={user.nombre} role={user.rol} />

      <div className="app-layout__main">
        <TopBar
          title={meta.title}
          subtitle={meta.subtitle}
          userInitial={user.nombre.trim().charAt(0).toUpperCase()}
        />
        <div className="app-layout__content">
          {/* pacienteId solo aplica al rol paciente; doctorId al rol médico */}
          <Outlet context={{ pacienteId: user.pacienteId, doctorId: user.doctorId }} />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;