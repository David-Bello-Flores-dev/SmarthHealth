import React from 'react';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';

export const MedicalTeam = () => {
  const doctors = [
    { name: 'Dra. Valentina Cruz', specialty: 'Cardiología' },
    { name: 'Dr. Andrés Mora', specialty: 'Medicina General' },
    { name: 'Dra. Sofía Ramírez', specialty: 'Pediatría' },
  ];

  return (
    <section id="equipo" className="public-container section-padding flex flex-col gap-12">
      <div className="text-center flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[--color-brand-primary]">Especialistas Certificados</span>
        <h2 className="text-3xl md:text-4xl font-bold text-[--color-brand-dark]">Nuestro equipo médico</h2>
      </div>

      <div className="grid-team">
        {doctors.map((doc, index) => (
          <Card key={index} className="flex flex-col gap-4 text-center items-center">
            {/* Foto de perfil simulada */}
            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              [ Foto ]
            </div>
            <div>
              <h3 className="font-bold text-lg text-[--color-brand-dark]">{doc.name}</h3>
              <p className="text-sm text-slate-500 font-medium">{doc.specialty}</p>
            </div>
            <Button variant="secondary" className="w-full">Agendar cita</Button>
          </Card>
        ))}
      </div>
    </section>
  );
};