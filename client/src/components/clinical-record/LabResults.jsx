import React from 'react';
import './ClinicalRecord.css'

const formatearRango = (min, max, unidad) => {
  if (min && max) return `Ref: ${min} - ${max} ${unidad}`;
  if (max) return `Ref: < ${max} ${unidad}`;
  return `Ref: ${min}+ ${unidad}`;
};

export const LabResults = ({ resultados, ultimaToma }) => {
  const fecha = new Date(ultimaToma).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <section className="lab-results">
      <div className="lab-results__header">
        <h3>Resultados de Laboratorio</h3>
        <span className="lab-results__date">Última toma {fecha}</span>
      </div>

      <ul className="lab-results__list">
        {/* TODO: BACKEND - el campo "estatus" ('normal' | 'elevado' | 'bajo') idealmente
            debería calcularse en backend comparando valor vs. rango, no en el front */}
        {resultados.map((r) => (
          <li key={r.id} className="lab-results__row">
            <span className={`lab-dot lab-dot--${r.estatus}`} />
            <span className="lab-results__name">{r.nombre}</span>
            <span className="lab-results__ref">
              {formatearRango(r.refMin, r.refMax, r.refUnidad)}
            </span>
            <span className="lab-results__value">{r.valor}</span>
            <span className={`status-badge status-badge--${r.estatus}`}>
              {r.estatus === 'elevado' ? 'Elevado' : r.estatus === 'bajo' ? 'Bajo' : 'Normal'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};