import React, { useEffect, useRef, useState } from 'react';
import { BellIcon } from './Icons';

// TODO: BACKEND - Endpoint esperado: GET /api/usuarios/:id/notificaciones
// Ejemplos de eventos a notificar: cita próxima en <24h, receta nueva emitida,
// resultado de laboratorio fuera de rango, cita cancelada por la contraparte.
const NOTIFICACIONES_MOCK = [];

export const NotificationsMenu = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tieneNotificaciones = NOTIFICACIONES_MOCK.length > 0;

  return (
    <div className="notifications-menu" ref={containerRef}>
      <button
        type="button"
        className="topbar-icon-btn"
        aria-label="Notificaciones"
        onClick={() => setOpen((o) => !o)}
      >
        <BellIcon width={18} height={18} />
        {tieneNotificaciones && <span className="topbar-notification-dot" />}
      </button>

      {open && (
        <div className="notifications-menu__dropdown">
          <div className="notifications-menu__header">
            <strong>Notificaciones</strong>
          </div>

          {tieneNotificaciones ? (
            <ul className="notifications-menu__list">
              {NOTIFICACIONES_MOCK.map((n) => (
                <li key={n.id}>{n.mensaje}</li>
              ))}
            </ul>
          ) : (
            <p className="notifications-menu__empty">No tienes notificaciones nuevas.</p>
          )}
        </div>
      )}
    </div>
  );
};