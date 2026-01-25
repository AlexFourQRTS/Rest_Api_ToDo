import React, { useState } from 'react';
// Removed CSS module import
import Button from 'components/UI/Button/Button';
import { authApi } from 'api/AuthApi';

const Register = ({ onRegisterSuccess, onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }

    try {
      const user = await authApi.register({ email, password, name, confirmPassword });
      onRegisterSuccess(user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Реєстрація</h2>
      {error && <div className="bg-red-900/20 border border-red-500 text-red-400 p-3 rounded-lg mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-white mb-2">Ім'я</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Введіть ваше ім'я"
            className="input-field w-full"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-white mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Введіть ваш email"
            className="input-field w-full"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-white mb-2">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Введіть ваш пароль"
            className="input-field w-full"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-white mb-2">Підтвердіть пароль</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Підтвердіть ваш пароль"
            className="input-field w-full"
          />
        </div>
        <Button type="submit" className="btn-primary w-full">
          Зареєструватися
        </Button>
      </form>
      <p className="text-center text-gray-300 mt-4">
        Вже маєте акаунт?{' '}
        <button onClick={onLoginClick} className="text-gray-300 hover:text-gray-300 underline">
          Увійти
        </button>
      </p>
    </div>
  );
};

export default Register; 