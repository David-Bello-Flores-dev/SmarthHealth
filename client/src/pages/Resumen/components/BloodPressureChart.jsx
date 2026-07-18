import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';

export const BloodPressureChart = ({ datos }) => {
  return (
    <section className="bp-chart">
      <div className="bp-chart__header">
        <div>
          <h3>Presión Arterial</h3>
          <p>Últimos 6 meses</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={datos} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="sistolica" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2f5fd1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2f5fd1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="diastolica" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5FBFA0" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#5FBFA0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f5" />
          <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={36} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            formatter={(value, name) => [`${value} mmHg`, name === 'sistolica' ? 'Sistólica' : 'Diastólica']}
          />
          <Legend
            formatter={(value) => (value === 'sistolica' ? 'Sistólica' : 'Diastólica')}
            wrapperStyle={{ fontSize: 12 }}
          />
          <Area type="monotone" dataKey="sistolica" stroke="#2f5fd1" fill="url(#sistolica)" strokeWidth={2} />
          <Area type="monotone" dataKey="diastolica" stroke="#5FBFA0" fill="url(#diastolica)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
};