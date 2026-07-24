import React from 'react';
import { LoginHero } from './components/LoginHero';
import { LoginForm } from './components/LoginForm';

export const LoginPage = () => {
  return (
    <div className="login-page">
      <LoginHero />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
