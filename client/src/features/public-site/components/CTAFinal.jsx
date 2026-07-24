import React from 'react';
import { Button } from '../../../components/Button';

export const CTAFinal = () => {
  return (
    <>
      <section className="bg-bg-light py-16">
        <div className="public-container">
          <div className="cta-box">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Comienza hoy mismo
            </h2>
            <p className="text-blue-100 text-sm md:text-base max-w-xl">
              Únete a más de 12,000 pacientes que ya gestionan su salud de forma inteligente con SmartHealth.
            </p>
            <div className="flex justify-center mt-2">
              <Button variant="secondary" className="btn-cta-white px-8 py-3 font-bold">
                Crear cuenta gratuita
              </Button>
            </div>
          </div>
        </div>
      </section>
      <footer className="footer-dark border-t border-slate-900" id="contacto"> 
        <div className="public-container py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-bold text-lg text-white">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h1.5l2.42-4.148a1.5 1.5 0 012.58.08L14.08 17.42a1.5 1.5 0 002.58.08L19.5 12h1.5" />
              </svg>
              <span>SmartHealth</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Salud inteligente y automatizada para clínicas modernas.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="footer-title">Plataforma</h4>
            <a href="#" className="text-slate-300 hover:text-white text-sm transition-colors block">Citas médicas</a> 
            <a href="#" className="text-slate-300 hover:text-white text-sm transition-colors block">Expedientes clínicos</a> 
            <a href="#" className="text-slate-300 hover:text-white text-sm transition-colors block">Recetas digitales</a> 
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="footer-title">Contacto</h4>
            <span className="text-slate-300 text-sm font-medium">+52 55 1234 5678</span> 
            <span className="text-slate-300 text-sm">info@smarthealth.mx</span> 
            <span className="text-slate-400 text-xs mt-1">Ciudad de México, MX</span> 
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="footer-title">Legal</h4>
            <a href="#" className="text-slate-300 hover:text-white text-sm transition-colors block">Privacidad</a> 
            <a href="#" className="text-slate-300 hover:text-white text-sm transition-colors block">Términos de uso</a> 
            <a href="#" className="text-slate-300 hover:text-white text-sm transition-colors block">HIPAA Compliance</a> 
          </div>
        </div>
        <div className="text-center py-6 text-xs text-slate-500 border-t border-slate-800">
          &copy; 2026 SmartHealth. Todos los derechos reservados. 
        </div>
      </footer>
    </>
  );
};