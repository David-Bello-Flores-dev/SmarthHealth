import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// TODO: BACKEND - Endpoint esperado: POST /api/auth/login  { email, password }
// Respuesta esperada: { token, user: { id, nombre, rol, pacienteId? } }
// "rol" define qué layout/rutas ve: 'paciente' | 'medico' | 'secretaria' (futuro)
// TODO: BACKEND - Endpoint esperado: POST /api/auth/login  { email, password }
// Respuesta esperada: { token, user: { id, nombre, rol, pacienteId? / doctorId? } }
async function loginRequest(email, password) {
  const res = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Credenciales inválidas');
  }

  return res.json();
}




const STORAGE_KEY = 'smarthealth_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // TODO: BACKEND - si usan JWT con expiración, aquí también hay que validar
    // que el token guardado no haya expirado antes de restaurar la sesión.
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw).user : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await loginRequest(email, password);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // TODO: BACKEND - si el backend maneja sesiones/refresh tokens, avisarle aquí
    // (POST /api/auth/logout) antes de limpiar el storage local.
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};