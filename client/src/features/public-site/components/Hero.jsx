import React from 'react';
import { Button } from '../../../components/Button';

export const Hero = () => {
  return (
    <section className="public-container section-padding grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Texto Izquierda */}
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark leading-tight">
          Salud inteligente <br />
          <span className="text-brand-primary">y automatizada</span>
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-lg">
          Gestión médica moderna para pacientes, médicos y clínicas. Citas, expedientes y recetas digitales en una sola plataforma segura.
        </p>
        <div className="flex items-center gap-4">
          <Button variant="primary" className="px-6 py-3 text-base">Solicitar cita ahora &gt;</Button>
          <Button variant="secondary" className="px-6 py-3 text-base">Iniciar sesión</Button>
        </div>
        
        {/* Estadísticas */}
        <div className="flex items-center gap-12 mt-6 border-t border-slate-100 pt-6">
          <div>
            <div className="text-3xl font-bold text-[--color-brand-dark]">12,400+</div>
            <div className="text-sm text-slate-500">Pacientes atendidos</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[--color-brand-dark]">340</div>
            <div className="text-sm text-slate-500">Médicos registrados</div>
          </div>
        </div>
      </div>

      {/* Imagen Derecha (Mockup Ilustrativo) */}
      <div className="bg-slate-200 rounded-2xl aspect-video lg:aspect-square w-full overflow-hidden shadow-md flex items-center justify-center text-slate-400 font-medium">
        [ Imagen del Médico / Laptop en consulta ]
      </div>
    </section>
  );
};