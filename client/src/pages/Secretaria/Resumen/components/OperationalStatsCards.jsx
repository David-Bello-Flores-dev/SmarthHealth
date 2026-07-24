import React from 'react';
import { CalendarIcon, CheckCircleIcon, ClockIcon, UsersIcon } from '@/components/layout/Icons';

const Card = ({ icon: Icon, iconClass, value, label }) => (
  <div className="op-stat-card">
    <span className={`op-stat-card__icon ${iconClass}`}><Icon width={18} height={18} /></span>
    <p className="op-stat-card__value">{value}</p>
    <p className="op-stat-card__label">{label}</p>
  </div>
);

export const OperationalStatsCards = ({ stats }) => (
  <div className="op-stats-cards">
    <Card icon={CalendarIcon} iconClass="op-stat-card__icon--total" value={stats.citasHoy} label="Citas hoy" />
    <Card icon={CheckCircleIcon} iconClass="op-stat-card__icon--confirmed" value={stats.confirmadas} label="Confirmadas" />
    <Card icon={ClockIcon} iconClass="op-stat-card__icon--pending" value={stats.pendientes} label="Pendientes" />
    <Card icon={UsersIcon} iconClass="op-stat-card__icon--new" value={stats.pacientesRegistradosHoy} label="Pacientes nuevos hoy" />
  </div>
);