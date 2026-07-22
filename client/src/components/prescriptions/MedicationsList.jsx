import React from 'react';

export const MedicationsList = ({ medicamentos }) => {
  return (
    <ul className="med-list">
      {medicamentos.map((m, idx) => (
        <li key={m.id} className="med-list__item">
          <span className="med-list__number">{idx + 1}</span>
          <div>
            <p className="med-list__title">
              {m.nombre} <span>{m.dosis}</span>
            </p>
            <p className="med-list__meta">
              Vía {m.via} &nbsp;·&nbsp; Frecuencia: {m.frecuencia} &nbsp;·&nbsp; Duración: {m.duracion}
            </p>
            {m.instrucciones && (
              <p className="med-list__instructions">Instrucciones: {m.instrucciones}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};