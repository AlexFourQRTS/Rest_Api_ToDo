import React, { useState } from 'react';
// Removed CSS module import
import Button from 'components/UI/Button/Button';
import { authApi } from 'api/AuthApi_fix';

const Login = ({ onLoginSuccess, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await authApi.login({ email, password });
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Вхід</h2>
      {error && <div className="bg-red-900/20 border border-red-500 text-red-400 p-3 rounded-lg mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <Button type="submit" className="btn-primary w-full">
          Увійти
        </Button>
      </form>
      <p className="text-center text-gray-300 mt-4">
        Немає акаунту?{' '}
        <button onClick={onRegisterClick} className="text-gray-300 hover:text-gray-300 underline">
          Зареєструватися
        </button>
      </p>
    </div>
  );
};

export default Login; 