import React, { useState } from 'react';
import { authApi } from '../../../../api/authApi';
// Removed CSS module import

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
    <div className="card p-6">
      <h3 className="text-xl font-bold text-white mb-6">Зміна пароля</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="oldPassword" className="block text-white mb-2">Старий пароль</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handleChange}
            required
            className="input-field w-full"
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-white mb-2">Новий пароль</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            required
            className="input-field w-full"
          />
        </div>
        <button type="submit" className="btn-primary w-full">Змінити пароль</button>
      </form>
      {message && <div className="bg-green-900/20 border border-green-500 text-green-400 p-3 rounded-lg mt-4">{message}</div>}
      {error && <div className="bg-red-900/20 border border-red-500 text-red-400 p-3 rounded-lg mt-4">{error}</div>}
    </div>
  );
};

export default ChangePasswordForm; 