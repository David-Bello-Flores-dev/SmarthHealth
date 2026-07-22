import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// TODO: BACKEND - si el rol viene del token/servidor, allowedRoles debe validarse
// contra user.rol tal como lo devuelve el login, sin asumir strings fijos aquí.
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Si no se especifica allowedRoles, cualquier usuario autenticado pasa
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};