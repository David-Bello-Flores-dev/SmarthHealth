import React from 'react';
import { SearchIcon } from '@/components/layout/Icons';

export const PatientsFilterBar = ({ query, onQueryChange, soloAlertas, onToggleAlertas, total }) => {
  return (
    <div className="patients-filter-bar">
      <div className="patients-filter-bar__search">
        <SearchIcon width={16} height={16} />
        <input
          type="text"
          placeholder="Buscar paciente por nombre..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      <label className="patients-filter-bar__checkbox">
        <input
          type="checkbox"
          checked={soloAlertas}
          onChange={(e) => onToggleAlertas(e.target.checked)}
        />
        Solo con alertas clínicas
      </label>

      <span className="patients-filter-bar__count">{total} paciente{total !== 1 ? 's' : ''}</span>
    </div>
  );
};