import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';

export const WeeklyAppointmentsChart = ({ datos }) => {
  return (
    <section className="weekly-chart">
      <div className="weekly-chart__header">
        <h3>Citas de la semana</h3>
        <p>Semana del 8 al 14 de Junio</p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={datos} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f5" />
          <XAxis dataKey="dia" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={30} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            formatter={(value, name) => [value, name === 'agendadas' ? 'Agendadas' : 'Completadas']}
          />
          <Legend
            formatter={(value) => (value === 'agendadas' ? 'Agendadas' : 'Completadas')}
            wrapperStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="agendadas" fill="#16213E" radius={[4, 4, 0, 0]} />
          <Bar dataKey="completadas" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};