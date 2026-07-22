import React from 'react';
import { MedicationsList } from './MedicationsList';
import './Prescriptions.css';

export const RecetaCard = ({ receta }) => {
  const fechaEmision = new Date(receta.fechaEmision).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  const fechaNacimiento = new Date(receta.paciente.fechaNacimiento).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <section className="receta-card">
      <div className="receta-card__brandbar">
        <div className="receta-card__brand">
          <span className="receta-card__brand-icon">⚡</span>
          <div>
            <strong>SmartHealth</strong>
            <p>Salud inteligente y automatizada</p>
            {/* TODO: BACKEND - dirección de la clínica emisora, si aplica multi-sucursal */}
            <p className="receta-card__brand-address">Av. Reforma 450, Col. Juárez · Ciudad de México</p>
          </div>
        </div>
        <div className="receta-card__folio">
          <span>Folio</span>
          <strong>{receta.id}</strong>
          <small>{fechaEmision}</small>
        </div>
      </div>

      <div className="receta-card__parties">
        <div>
          <span className="receta-card__label">Médico prescriptor</span>
          <strong>{receta.medico.nombre}</strong>
          <p>{receta.medico.especialidad}</p>
          <p className="receta-card__muted">Cédula prof. {receta.medico.cedula}</p>
        </div>
        <div>
          <span className="receta-card__label">Paciente</span>
          <strong>{receta.paciente.nombre}</strong>
          <p className="receta-card__muted">Fecha de nacimiento: {fechaNacimiento}</p>
        </div>
      </div>

      <div className="receta-card__diagnostico">
        <span className="receta-card__label">Diagnóstico:</span> {receta.diagnostico}
      </div>

      <div className="receta-card__meds">
        <span className="receta-card__label">Medicamentos prescritos</span>
        <MedicationsList medicamentos={receta.medicamentos} />
      </div>
    </section>
  );
};