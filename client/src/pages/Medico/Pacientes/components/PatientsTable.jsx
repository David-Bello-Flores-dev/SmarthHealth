import React from 'react';
import { EyeIcon, FilePlusIcon, AlertTriangleIcon } from '@/components/layout/Icons';

const formatearFecha = (isoDate) =>
  new Date(isoDate).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

const getIniciales = (nombre) =>
  nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

export const PatientsTable = ({ pacientes, onVerExpediente, onNuevaReceta }) => {
  if (pacientes.length === 0) {
    return <div className="patients-table__empty">No se encontraron pacientes con ese criterio.</div>;
  }

  return (
    <div className="patients-table-wrapper">
      <table className="patients-table">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Edad</th>
            <th>Última visita</th>
            <th>Padecimiento principal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => (
            <tr key={p.id}>
              <td>
                <div className="patients-table__patient">
                  <span className="patients-table__avatar">{getIniciales(p.nombre)}</span>
                  <div>
                    <strong>{p.nombre}</strong>
                    {p.tieneAlerta && (
                      <span className="patients-table__alert-tag">
                        <AlertTriangleIcon width={12} height={12} /> Alerta clínica
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td>{p.edad} años</td>
              <td>{formatearFecha(p.ultimaVisita)}</td>
              <td>{p.padecimientoPrincipal}</td>
              <td>
                <div className="patients-table__actions">
                  <button
                    type="button"
                    className="patients-table__action-btn"
                    onClick={() => onVerExpediente(p)}
                    title="Ver expediente"
                  >
                    <EyeIcon width={15} height={15} />
                  </button>
                  <button
                    type="button"
                    className="patients-table__action-btn"
                    onClick={() => onNuevaReceta(p)}
                    title="Nueva receta"
                  >
                    <FilePlusIcon width={15} height={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};