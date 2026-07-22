import React from 'react';

// TODO: BACKEND - la fecha debería formatearse en el cliente a partir de la hora del servidor
// si en algún momento importa la zona horaria del paciente, no solo new Date() local.
const hoyFormateado = () =>
  new Date().toLocaleDateString('es-MX', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });

export const GreetingHeader = ({ nombre, onNuevaCita }) => {
  return (
    <div className="greeting-header">
      <div>
        <h1>Buenos días, {nombre}</h1>
        <p className="greeting-header__date">{hoyFormateado()}</p>
      </div>
      <button type="button" className="btn-nueva-cita" onClick={onNuevaCita}>
        + Nueva cita
      </button>
    </div>
  );
};