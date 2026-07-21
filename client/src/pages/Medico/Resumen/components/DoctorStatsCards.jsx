import React from 'react';
import { UsersIcon, CalendarIcon, PillIcon, TrendingUpIcon } from '@/components/layout/Icons';

const StatCard = ({ icon: Icon, iconClass, value, label, sublabel, sublabelClass }) => (
  <div className="stat-card">
    <span className={`stat-card__icon ${iconClass}`}>
      <Icon width={18} height={18} />
    </span>
    <p className="stat-card__value">{value}</p>
    <p className="stat-card__label">{label}</p>
    <p className={`stat-card__sublabel ${sublabelClass ?? ''}`}>{sublabel}</p>
  </div>
);

export const DoctorStatsCards = ({ stats }) => {
  return (
    <div className="doctor-stats-cards">
      <StatCard
        icon={UsersIcon}
        iconClass="stat-card__icon--patients"
        value={stats.pacientesHoy}
        label="Pacientes hoy"
        sublabel={`${stats.pacientesHoyAtendidos} atendidos`}
        sublabelClass="stat-card__sublabel--muted"
      />
      <StatCard
        icon={CalendarIcon}
        iconClass="stat-card__icon--week"
        value={stats.citasSemana}
        label="Esta semana"
        sublabel={`${stats.citasSemanaCompletadas} completadas`}
        sublabelClass="stat-card__sublabel--success"
      />
      <StatCard
        icon={PillIcon}
        iconClass="stat-card__icon--prescriptions"
        value={stats.recetasEmitidasMes}
        label="Recetas emitidas"
        sublabel="Este mes"
        sublabelClass="stat-card__sublabel--success"
      />
      <StatCard
        icon={TrendingUpIcon}
        iconClass="stat-card__icon--satisfaction"
        value={`${stats.satisfaccionPromedio}%`}
        label="Satisfacción"
        sublabel="Promedio anual"
        sublabelClass="stat-card__sublabel--success"
      />
    </div>
  );
};