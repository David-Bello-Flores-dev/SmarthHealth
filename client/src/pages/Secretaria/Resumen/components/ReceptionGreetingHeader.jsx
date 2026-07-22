import React from 'react';
import { useAuth } from '@/context/AuthContext';

const hoyFormateado = () =>
  new Date().toLocaleDateString('es-MX', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

export const ReceptionGreetingHeader = () => {
  const { user } = useAuth();
  return (
    <div className="reception-greeting">
      <h1>Buenos días, {user?.nombre?.split(' ')[0] ?? ''} </h1>
      <p>{hoyFormateado()}</p>
    </div>
  );
};