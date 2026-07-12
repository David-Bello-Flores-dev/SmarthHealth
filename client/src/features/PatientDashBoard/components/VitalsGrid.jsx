import React from 'react';
import { Card } from '../../../components/Card';
import { HeartIcon, ActivityIcon, ThermometerIcon, DropletIcon } from './Icons';

const TONE_CLASS = {
  red: 'vital-icon-red',
  blue: 'vital-icon-blue',
  orange: 'vital-icon-orange',
  green: 'vital-icon-green',
};

// Estructura fija de tarjetas (etiquetas, unidades e íconos son parte del diseño,
// no datos del paciente). TODO: llenar "value" y "status" desde la API / Redux.
const DEFAULT_VITALS = [
  {
    id: 'heart-rate',
    label: 'Frec. Cardiaca',
    value: '',
    unit: 'bpm',
    status: { type: 'delta', text: '' },
    icon: HeartIcon,
    tone: 'red',
  },
  {
    id: 'blood-pressure',
    label: 'Presión Arterial',
    value: '',
    unit: 'mmHg',
    status: { type: 'normal', text: '' },
    icon: ActivityIcon,
    tone: 'blue',
  },
  {
    id: 'temperature',
    label: 'Temperatura',
    value: '',
    unit: '°C',
    status: { type: 'normal', text: '' },
    icon: ThermometerIcon,
    tone: 'orange',
  },
  {
    id: 'glucose',
    label: 'Glucosa',
    value: '',
    unit: 'mg/dL',
    status: { type: 'delta', text: '' },
    icon: DropletIcon,
    tone: 'green',
  },
];

export const VitalsGrid = ({ vitals = DEFAULT_VITALS }) => {
  return (
    <div className="vitals-grid">
      {vitals.map(({ id, label, value, unit, status, icon: Icon, tone }) => (
        <Card key={id} className="vital-card">
          <span className={`vital-icon-box ${TONE_CLASS[tone]}`}>
            <Icon width={18} height={18} />
          </span>
          <p className="vital-label">{label}</p>
          <p className="vital-value-row">
            <span className="vital-value">{value || '—'}</span>
            {value && <span className="vital-unit">{unit}</span>}
          </p>
          {status.text && (
            <p className={status.type === 'normal' ? 'vital-status-normal' : 'vital-status-delta'}>
              {status.text}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
};

export default VitalsGrid;
