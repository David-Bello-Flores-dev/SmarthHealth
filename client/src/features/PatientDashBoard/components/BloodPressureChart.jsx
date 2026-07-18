import React, { useId } from 'react';
import { Card } from '../../../components/Card';

const Y_MIN = 60;
const Y_MAX = 140;
const Y_TICKS = [60, 80, 100, 120, 140];

const CHART_WIDTH = 700;
const CHART_HEIGHT = 260;
const PLOT_LEFT = 44;
const PLOT_RIGHT = 668;
const PLOT_TOP = 20;
const PLOT_BOTTOM = 200;

const xForIndex = (index, total) =>
  total <= 1 ? PLOT_LEFT : PLOT_LEFT + (index * (PLOT_RIGHT - PLOT_LEFT)) / (total - 1);

const yForValue = (value) =>
  PLOT_BOTTOM - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * (PLOT_BOTTOM - PLOT_TOP);

const buildLinePath = (values) =>
  values
    .map((value, index) => `${index === 0 ? 'M' : 'L'} ${xForIndex(index, values.length)} ${yForValue(value)}`)
    .join(' ');

const buildAreaPath = (values) => {
  const line = buildLinePath(values);
  const lastX = xForIndex(values.length - 1, values.length);
  const firstX = xForIndex(0, values.length);
  return `${line} L ${lastX} ${PLOT_BOTTOM} L ${firstX} ${PLOT_BOTTOM} Z`;
};

// TODO: months/systolic/diastolic deben venir de la API / Redux.
// Formato esperado: months = ['Ene', 'Feb', ...], systolic/diastolic = [120, 122, ...]
// (mismo largo que months). Mientras no haya datos, la gráfica se muestra
// solo con la cuadrícula y los ejes, sin líneas.
export const BloodPressureChart = ({ months = [], systolic = [], diastolic = [] }) => {
  const gradientId = useId();
  const hasData = months.length > 0 && systolic.length === months.length;

  return (
    <Card className="chart-panel">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Presión Arterial</h3>
          <p className="chart-subtitle">Últimos 6 meses</p>
        </div>
        <div className="chart-legend">
          <span className="chart-legend-item">
            <span className="chart-legend-dot chart-legend-dot-systolic" />
            Sistólica
          </span>
          <span className="chart-legend-item">
            <span className="chart-legend-dot chart-legend-dot-diastolic" />
            Diastólica
          </span>
        </div>
      </div>

      <div className="chart-svg-wrapper">
        <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="w-full h-auto">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Gridlines y etiquetas del eje Y (siempre visibles, son parte del diseño) */}
          {Y_TICKS.map((tick) => (
            <g key={tick}>
              <line
                x1={PLOT_LEFT}
                x2={PLOT_RIGHT}
                y1={yForValue(tick)}
                y2={yForValue(tick)}
                className="chart-gridline"
              />
              <text x={PLOT_LEFT - 10} y={yForValue(tick) + 4} className="chart-axis-label" textAnchor="end">
                {tick}
              </text>
            </g>
          ))}

          {/* Etiquetas del eje X */}
          {months.map((month, index) => (
            <text
              key={month}
              x={xForIndex(index, months.length)}
              y={PLOT_BOTTOM + 22}
              className="chart-axis-label"
              textAnchor="middle"
            >
              {month}
            </text>
          ))}

          {hasData && (
            <>
              {/* Área bajo la sistólica */}
              <path d={buildAreaPath(systolic)} fill={`url(#${gradientId})`} />

              {/* Línea diastólica */}
              {diastolic.length === months.length && (
                <path d={buildLinePath(diastolic)} className="chart-line-diastolic" fill="none" />
              )}

              {/* Línea sistólica */}
              <path d={buildLinePath(systolic)} className="chart-line-systolic" fill="none" />
            </>
          )}
        </svg>

        {!hasData && (
          <p className="chart-empty">Aún no hay registros de presión arterial.</p>
        )}
      </div>
    </Card>
  );
};

export default BloodPressureChart;
