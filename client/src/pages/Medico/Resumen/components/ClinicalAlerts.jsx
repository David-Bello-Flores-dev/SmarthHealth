import React from 'react';
import { AlertTriangleIcon, AlertCircleIcon, ClockIcon } from '@/components/layout/Icons';

const ALERT_CONFIG = {
  warning: { icon: AlertTriangleIcon, className: 'clinical-alert--warning' },
  critical: { icon: AlertCircleIcon, className: 'clinical-alert--critical' },
  info: { icon: ClockIcon, className: 'clinical-alert--info' },
};

export const ClinicalAlerts = ({ alertas }) => {
  return (
    <section className="clinical-alerts">
      <h3>Alertas clínicas</h3>

      {alertas.length === 0 ? (
        <p className="clinical-alerts__empty">Sin alertas por ahora.</p>
      ) : (
        <ul className="clinical-alerts__list">
          {alertas.map((alerta) => {
            const config = ALERT_CONFIG[alerta.tipo] ?? ALERT_CONFIG.info;
            const Icon = config.icon;
            return (
              <li key={alerta.id} className={`clinical-alert ${config.className}`}>
                <Icon width={16} height={16} />
                <div>
                  <strong>{alerta.paciente}</strong>
                  <p>{alerta.mensaje}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};