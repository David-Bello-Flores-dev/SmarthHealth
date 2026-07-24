import React from 'react';

export const RecetaTabs = ({ recetas, selectedId, onSelect }) => {
  return (
    <div className="receta-tabs">
      {recetas.map((r) => (
        <button
          key={r.id}
          className={`receta-tabs__pill ${r.id === selectedId ? 'is-active' : ''}`}
          onClick={() => onSelect(r.id)}
        >
          {r.id}
        </button>
      ))}
    </div>
  );
};