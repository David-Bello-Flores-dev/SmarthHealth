import React from 'react';
import { Button } from '../../../components/Button';

export const Navbar = () => {
  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 py-4">
      <div className="public-container flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-brand-dark">
          <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h1.5l2.42-4.148a1.5 1.5 0 012.58.08L14.08 17.42a1.5 1.5 0 002.58.08L19.5 12h1.5" />
          </svg>
          <span>SmartHealth</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#servicios" className="nav-link">Servicios</a>
          <a href="#equipo" className="nav-link">Equipo</a>
          <a href="#contacto" className="nav-link">Contacto</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-700 hover:text-brand-primary text-sm font-medium cursor-pointer">
            Iniciar sesión
          </button>
          
          {/* Le metemos la nueva clase btn-cta-blue aquí */}
          <Button variant="primary" className="btn-login-blue px-6 py-2">
            Solicitar cita
          </Button>
        </div>
      </div>
    </nav>
  );
};