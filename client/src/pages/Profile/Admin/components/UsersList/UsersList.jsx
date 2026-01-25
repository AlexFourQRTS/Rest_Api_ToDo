import React, { useState, useEffect } from 'react';
import { authApi } from 'api/AuthApi_fix';
// Removed CSS module import

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await authApi.getAdminUsers();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          // If data is not an array (e.g., null or an error object), set an empty array to prevent crash
          setUsers([]);
          if (data) { // If there's some data but it's not an array, it might be an error response
            console.error("Received unexpected data format for users:", data);
            setError('Не вдалося завантажити список користувачів: неправильний формат даних.');
          }
        }
      } catch (err) {
        setError(err.message || 'Не вдалося завантажити список користувачів.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-300">Завантаження...</div>;
  }

  if (error) {
    return <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Список користувачів</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
            <span className="text-white font-medium">{user.email}</span>
            <span className="px-2 py-1 bg-slate-600 text-white text-xs rounded-full">{user.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList; 