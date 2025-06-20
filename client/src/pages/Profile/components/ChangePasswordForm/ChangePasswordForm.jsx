import React, { useState } from 'react';
import { authApi } from '../../../../api/authApi';
import styles from './ChangePasswordForm.module.css';

const ChangePasswordForm = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await authApi.changePassword(passwords);
      setMessage(response.message || 'Пароль успішно змінено');
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.message || 'Помилка зміни пароля');
    }
  };

  return (
    <div className={styles.changePasswordContainer}>
      <h3>Зміна пароля</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="oldPassword">Старий пароль</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="newPassword">Новий пароль</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Змінити пароль</button>
      </form>
      {message && <div className={styles.successMessage}>{message}</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default ChangePasswordForm; 