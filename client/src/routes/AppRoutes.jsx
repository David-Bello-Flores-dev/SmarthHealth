import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '@/pages/Login/LoginPage';
import { ExpedienteClinico } from '@/pages/ExpedienteClinico/ExpedienteClinico';
import { RecetasMedicas } from '@/pages/RecetasMedicas/RecetasMedicas';
import { MisCitas } from '@/pages/MisCitas/MisCitas';
import { Resumen } from '@/pages/Resumen/Resumen';
import { ResumenMedico } from '@/pages/Medico/Resumen/ResumenMedico';
import { Agenda } from '@/pages/Medico/Agenda/Agenda';
import { Expedientes } from '@/pages/Medico/Expedientes/Expedientes';
import { Recetas } from '@/pages/Medico/Recetas/Recetas';
import { Pacientes } from '@/pages/Medico/Pacientes/Pacientes';
import { ResumenSecretaria } from '@/pages/Secretaria/Resumen/ResumenSecretaria';
import { CitasSecretaria } from '@/pages/Secretaria/Citas/CitasSecretaria';
import { ExpedientesSecretaria } from '@/pages/Secretaria/Expedientes/ExpedientesSecretaria';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      // Sin allowedRoles: cualquier usuario autenticado entra al layout.
      // El control de "quién ve qué" ya lo hace el propio Sidebar (menú por rol)
      // y, si algún día hace falta, se restringe ruta por ruta más abajo.
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/paciente/resumen" replace /> },

      // --- Paciente ---
      { path: 'paciente/resumen', element: <Resumen /> },
      { path: 'paciente/citas', element: <MisCitas /> },
      { path: 'paciente/expediente', element: <ExpedienteClinico /> },
      { path: 'paciente/recetas', element: <RecetasMedicas /> },

      // --- Médico ---
      { path: 'medico/resumen', element: <ResumenMedico /> },
      { path: 'medico/agenda', element: <Agenda /> },
      { path: 'medico/expedientes', element: <Expedientes /> },
      { path: 'medico/recetas', element: <Recetas /> },
      { path: 'medico/pacientes', element: <Pacientes /> },

      // --- Secretaaria ---
      { path: 'secretaria/resumen', element: <ResumenSecretaria /> },
      { path: 'secretaria/citas', element: <CitasSecretaria /> },
      { path: 'secretaria/expedientes', element: <ExpedientesSecretaria /> }
    ],
  },
]);

export const AppRoutes = () => <RouterProvider router={router} />;