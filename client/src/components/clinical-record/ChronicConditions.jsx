import React from 'react';
import './ClinicalRecord.css'

export const ChronicConditions = ({ padecimientos }) => {
  if (!padecimientos?.length) return null;

  return (
    <section className="chronic-conditions">
      <span className="patient-card__label">Padecimientos crónicos</span>
      <div className="pill-group">
        {/* TODO: BACKEND - si cada padecimiento requiere fecha de diagnóstico o médico tratante,
            cambiar a objetos {nombre, desde, medico} y ajustar el render */}
        {padecimientos.map((p) => (
          <span key={p} className="pill pill--info">{p}</span>
        ))}
      </div>
    </section>
  );
};