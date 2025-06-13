import React, { useState } from 'react';
import styles from './Auth.module.css';
import Button from '../../components/UI/Button/Button';
import { authApi } from '../Profile/api/authApi';

const Register = ({ onRegisterSuccess, onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await authApi.register(email, password);
      localStorage.setItem('token', data.token);
      onRegisterSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.authForm}>
      <h2>Реєстрація</h2>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Введіть ваш email"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Введіть ваш пароль"
          />
        </div>
        <Button type="submit" className={styles.submitButton}>
          Зареєструватися
        </Button>
      </form>
      <p className={styles.switchAuth}>
        Вже маєте акаунт?{' '}
        <button onClick={onLoginClick} className={styles.switchButton}>
          Увійти
        </button>
      </p>
    </div>
  );
};

export default Register; 