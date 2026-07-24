import React, { useEffect, useRef, useState } from 'react';
import { SearchIcon } from '@/components/layout/Icons';
import './PatientSearchBar.css'

export const PatientSearchBar = ({ doctorId, onSearch, onSelectPatient }) => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let activo = true;
    onSearch(doctorId, query).then((res) => {
      if (activo) setResultados(res);
    });
    return () => { activo = false; };
  }, [doctorId, query, onSearch]);

  // Cierra el dropdown al hacer clic fuera del buscador
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (paciente) => {
    onSelectPatient(paciente.id, paciente.nombre);
    setQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="patient-search-bar" ref={containerRef}>
      <div className="patient-search-bar__input-wrapper">
        <SearchIcon width={16} height={16} />
        <input
          type="text"
          placeholder="Buscar paciente por nombre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
        />
      </div>

      {showDropdown && resultados.length > 0 && (
        <ul className="patient-search-bar__dropdown">
          {resultados.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => handleSelect(p)}>
                {p.nombre}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};