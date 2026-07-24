import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, FolderIcon } from '@/components/layout/Icons';

export const QuickAccessLinks = () => (
  <section className="quick-access">
    <h3>Accesos rápidos</h3>
    <Link to="/secretaria/citas" className="quick-access__item">
      <CalendarIcon width={18} height={18} />
      <div>
        <strong>Agendar / confirmar cita</strong>
        <p>Gestiona la agenda de todos los médicos</p>
      </div>
    </Link>
    <Link to="/secretaria/expedientes" className="quick-access__item">
      <FolderIcon width={18} height={18} />
      <div>
        <strong>Consultar expediente</strong>
        <p>Alergias, tipo de sangre y resultados de laboratorio</p>
      </div>
    </Link>
  </section>
);