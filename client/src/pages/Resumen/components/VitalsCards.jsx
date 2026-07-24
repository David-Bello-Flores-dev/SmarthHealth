import React from 'react';
import { HeartIcon, GaugeIcon, ThermometerIcon, DropletIcon } from '../../../components/layout/Icons';

const ESTATUS_LABEL = {
  normal: 'Normal',
  elevado: 'Elevado',
  bajo: 'Bajo',
};

const VitalCard = ({ icon: Icon, iconClass, label, value, unit, estatus }) => (
  <div className="vital-card">
    <span className={`vital-card__icon ${iconClass}`}>
      <Icon width={18} height={18} />
    </span>
    <div>
      <p className="vital-card__label">{label}</p>
      <p className="vital-card__value">
        {value} <span>{unit}</span>
      </p>
      <span className={`vital-card__status vital-card__status--${estatus}`}>
        {ESTATUS_LABEL[estatus] ?? estatus}
      </span>
    </div>
  </div>
);

export const VitalsCards = ({ signosVitales }) => {
  const { frecuenciaCardiaca, presionArterial, temperatura, glucosa } = signosVitales;

  return (
    <div className="vitals-cards">
      <VitalCard
        icon={HeartIcon}
        iconClass="vital-card__icon--heart"
        label="Frec. Cardíaca"
        value={frecuenciaCardiaca.valor}
        unit={frecuenciaCardiaca.unidad}
        estatus={frecuenciaCardiaca.estatus}
      />
      <VitalCard
        icon={GaugeIcon}
        iconClass="vital-card__icon--pressure"
        label="Presión Arterial"
        value={`${presionArterial.sistolica}/${presionArterial.diastolica}`}
        unit={presionArterial.unidad}
        estatus={presionArterial.estatus}
      />
      <VitalCard
        icon={ThermometerIcon}
        iconClass="vital-card__icon--temp"
        label="Temperatura"
        value={temperatura.valor}
        unit={temperatura.unidad}
        estatus={temperatura.estatus}
      />
      <VitalCard
        icon={DropletIcon}
        iconClass="vital-card__icon--glucose"
        label="Glucosa"
        value={glucosa.valor}
        unit={glucosa.unidad}
        estatus={glucosa.estatus}
      />
    </div>
  );
};