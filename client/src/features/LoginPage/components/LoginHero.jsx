import React from 'react';

const ActivityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const STATS = [
  { value: '12,400+', label: 'Pacientes' },
  { value: '340', label: 'Médicos' },
  { value: '98.7%', label: 'Satisfacción' },
  { value: '24/7', label: 'Disponible' },
];

export const LoginHero = () => {
  return (
    <div className="login-hero">
      <div className="login-hero-brand">
        <span className="login-hero-logo">
          <ActivityIcon />
        </span>
        <span className="login-hero-brand-name">SmartHealth</span>
      </div>

      <div className="login-hero-copy">
        <h1 className="login-hero-title">
          Salud inteligente
          <br />
          y automatizada
        </h1>
        <p className="login-hero-subtitle">
          Gestiona citas, expedientes y recetas desde cualquier lugar, de forma segura y eficiente.
        </p>
      </div>

      <div className="login-stats-grid">
        {STATS.map((stat) => (
          <div key={stat.label} className="login-stat-card">
            <p className="login-stat-value">{stat.value}</p>
            <p className="login-stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginHero;
