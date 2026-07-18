import React from 'react';
import { Card } from '../../../components/Card';

export const Services = () => {
  const coreFeatures = [
    { 
      title: 'Citas Inteligentes', 
      desc: 'Agende y gestione citas médicas con confirmaciones y recordatorios automáticos.',
      colorClass: 'icon-box-purple',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 5c0-1.1.9-2 2-2h8a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2V5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v2M8 3v2M6 9h12M9 13h1m3 0h1m3 0h1m-8 4h1m3 0h1" />
        </svg>
      )
    },
    { 
      title: 'Expedientes Digitales', 
      desc: 'Historial clínico completo y seguro, accesible desde cualquier dispositivo.',
      colorClass: 'icon-box-green',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      title: 'Datos Protegidos', 
      desc: 'Cifrado de extremo a extremo cumpliendo con normativas de privacidad.',
      colorClass: 'icon-box-indigo',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    { 
      title: 'Monitoreo Continuo', 
      desc: 'Seguimiento de signos vitales y alertas clínicas automáticas.',
      colorClass: 'icon-box-cyan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      title: 'Multi-rol', 
      desc: 'Paneles diferenciados para pacientes, médicos y personal administrativo.',
      colorClass: 'icon-box-pink',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      title: 'Disponible 24/7', 
      desc: 'Acceso ininterrumpido para consultas de emergencia y gestión clínica.',
      colorClass: 'icon-box-amber',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <section id="servicios" className="bg-bg-light section-padding">
      <div className="public-container flex flex-col gap-12">
        <div className="text-center flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Plataforma Completa</span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Todo lo que necesitas en salud digital</h2>
        </div>

        <div className="grid-services">
          {coreFeatures.map((feat, index) => (
            <Card key={index} className="flex flex-col gap-4 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs hover:translate-y-[-4px] transition-all duration-200">
              {/* Aquí inyecta de forma dinámica la clase de color que le corresponde */}
              <div className={feat.colorClass}>
                {feat.icon}
              </div>
              <h3 className="font-bold text-lg text-brand-dark">{feat.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feat.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};