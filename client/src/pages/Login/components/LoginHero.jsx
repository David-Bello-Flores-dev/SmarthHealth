import React from 'react';
import { ActivityIcon } from '../../../components/layout/Icons';

export const LoginHero = () => {
  return (
    <div className="login-hero">
      <div className="login-hero__brand">
        <span className="login-hero__logo">
          <ActivityIcon width={22} height={22} />
        </span>
        <span>SmartHealth</span>
      </div>

      <h1 className="login-hero__title">Tu salud, siempre a la mano</h1>
      <p className="login-hero__subtitle">
        Consulta tu expediente, resultados de laboratorio, recetas y citas médicas
        desde un solo lugar, sin depender del consultorio.
      </p>

      <ul className="login-hero__features">
        <li>Expediente clínico completo y actualizado</li>
        <li>Recetas digitales siempre disponibles</li>
        <li>Gestión de citas en minutos</li>
      </ul>
    </div>
  );
};