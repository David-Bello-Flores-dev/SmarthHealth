import React from 'react';
import { FilePlusIcon } from '@/components/layout/Icons';

const hoyFormateado = () =>
  new Date().toLocaleDateString('es-MX', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });

export const DoctorGreetingHeader = ({ nombreMedico, pacientesHoy, onNuevaReceta }) => {
  return (
    <div className="doctor-greeting">
      <div>
        <h1>Buenos días, {nombreMedico} </h1>
        <p className="doctor-greeting__date">
          {hoyFormateado()} · {pacientesHoy} pacientes agendados
        </p>
      </div>
      <button type="button" className="btn-nueva-receta" onClick={onNuevaReceta}>
        <FilePlusIcon width={16} height={16} />
        Nueva receta
      </button>
    </div>
  );
};