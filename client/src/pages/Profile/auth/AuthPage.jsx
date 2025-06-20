import React from 'react';
import AuthForm from './components/AuthForm/AuthForm';
import styles from './AuthPage.module.css';

const AuthPage = ({ onAuthSuccess }) => {
  return (
    <div className={styles.authPage}>
      <AuthForm onLoginSuccess={onAuthSuccess} onRegisterSuccess={onAuthSuccess} />
    </div>
  );
};

export default AuthPage; 