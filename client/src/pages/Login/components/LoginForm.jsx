import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// Mapea el rol devuelto por backend a la pantalla de entrada de cada portal.
// TODO: BACKEND - cuando existan los portales de médico/secretaria, agregar sus rutas aquí.
const HOME_BY_ROLE = {
  paciente: '/paciente/resumen',
  medico: '/medico/resumen',
  secretaria: '/secretaria/resumen',
};

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      const from = location.state?.from?.pathname;
      navigate(from || HOME_BY_ROLE[user.rol] || '/', { replace: true });
    } catch {
      // El mensaje de error ya queda expuesto en `error` desde el context
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Inicia sesión</h2>
      <p className="login-form__subtitle">Ingresa tus credenciales para continuar</p>

      {error && <div className="login-form__error">{error}</div>}

      <label className="login-form__field">
        <span>Correo electrónico</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          required
          autoComplete="email"
        />
      </label>

      <label className="login-form__field">
        <span>Contraseña</span>
        <div className="login-form__password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className="login-form__toggle-visibility"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </label>

      <div className="login-form__row">
        <label className="login-form__checkbox">
          <input type="checkbox" /> Recordarme
        </label>
        {/* TODO: BACKEND - conectar a flujo real de recuperación de contraseña */}
        <a href="/recuperar-password">¿Olvidaste tu contraseña?</a>
      </div>

      <button type="submit" className="login-form__submit" disabled={loading}>
        {loading ? 'Ingresando...' : 'Iniciar sesión'}
      </button>

      <p className="login-form__hint">
        Demo: <code>maria@smarthealth.com</code> / <code>123456</code>
      </p>
    </form>
  );
};