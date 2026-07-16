import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/Login/LoginPage';
import { ExpedienteClinico } from '../pages/ExpedienteClinico/ExpedienteClinico';
import { RecetasMedicas } from '../pages/RecetasMedicas/RecetasMedicas';
import { MisCitas } from '../pages/MisCitas/MisCitas';
import { Resumen } from '../pages/Resumen/Resumen';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute allowedRoles={['paciente']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/paciente/resumen" replace /> },
      { path: 'paciente/resumen', element: <Resumen /> },
      { path: 'paciente/citas', element: <MisCitas /> },
      { path: 'paciente/expediente', element: <ExpedienteClinico /> },
      { path: 'paciente/recetas', element: <RecetasMedicas /> },
      // { path: 'medico/...' }  ← aquí entrarán las pantallas de médico (opción 2)
    ],
  },
]);

export const AppRoutes = () => <RouterProvider router={router} />;