import React, { useState } from 'react';
import styles from './AuthForm.module.css';

export const AuthForm = ({ onLoginSuccess, onRegisterSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }

    try {
      if (isLogin) {
        // Handle login
        if (onLoginSuccess) {
          onLoginSuccess(formData);
        }
      } else {
        // Handle registration
        if (onRegisterSuccess) {
          onRegisterSuccess(formData);
        }
      }
    } catch (err) {
      setError(err.message || 'Сталася помилка');
    }
  };

  return (
    <div className={styles.authForm}>
      <h2>{isLogin ? 'Вхід' : 'Реєстрація'}</h2>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {!isLogin && (
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Підтвердження паролю</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <button type="submit" className={styles.submitButton}>
          {isLogin ? 'Увійти' : 'Зареєструватися'}
        </button>
      </form>
      <button
        className={styles.toggleButton}
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Створити новий акаунт' : 'Вже маєте акаунт? Увійти'}
      </button>
    </div>
  );
}; 