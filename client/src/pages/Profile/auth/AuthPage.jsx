import React from 'react';
import AuthForm from './components/AuthForm/AuthForm';
// Removed CSS module import

const AuthPage = ({ onAuthSuccess }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm onLoginSuccess={onAuthSuccess} onRegisterSuccess={onAuthSuccess} />
    </div>
  );
};

export default AuthPage; 