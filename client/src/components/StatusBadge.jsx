import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
  const normalized = status.toLowerCase();

  const variantMap = {
    confirmada: 'badge-success',
    normal: 'badge-success',
    pendiente: 'badge-warning',
    elevado: 'badge-danger',
    fuera_de_rango: 'badge-danger',
  };

  // Si no encuentra el estatus en el mapa, aplica el badge-default del CSS
  const badgeVariant = variantMap[normalized] || 'badge-default';

  return (
    <span className={`badge-base ${badgeVariant} ${className}`}>
      {status}
    </span>
  );
};