import React, { useState } from 'react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';

// TODO: conectar con Redux
// import { useDispatch } from 'react-redux';
// import { login } from '../authSlice';

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a17.4 17.4 0 0 1-2.16 3.19M6.6 6.6C3.4 8.5 1 12 1 12s4 8 11 8a9.5 9.5 0 0 0 5.4-1.6M14.12 14.12A3 3 0 1 1 9.88 9.88" />
    <path d="M1 1l22 22" />
  </svg>
);

export const LoginForm = () => {
  // const dispatch = useDispatch();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) {
      next.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      next.email = 'Ingresa un correo válido';
    }
    if (!form.password) {
      next.password = 'La contraseña es obligatoria';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // await dispatch(login(form)).unwrap();
      console.log('Login payload:', form);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-panel">
      <div className="login-form-wrapper">
        <h2 className="login-form-title">Bienvenido de regreso</h2>
        <p className="login-form-subtitle">Ingresa con tu cuenta para continuar</p>

        <form onSubmit={handleSubmit} noValidate className="login-form-fields">
          <Input
            id="email"
            type="email"
            label="Correo electrónico"
            placeholder="tu@correo.com"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            autoComplete="email"
          />

          <div className="login-password-field">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="login-password-toggle"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <Button
            type="submit"
            variant="login-blue"
            className="w-full justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
          </Button>
        </form>

        <div className="login-footer">
          <p className="login-footer-text">
            ¿No tienes cuenta?{' '}
            <a href="/registro" className="login-footer-link">
              Regístrate aquí
            </a>
          </p>
          <a href="/" className="login-back-link">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
