import React, { useState, useEffect } from 'react';
import { authApi } from 'api/authApi';
import styles from './UsersList.module.css';

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
    return <div className={styles.message}>Завантаження...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.usersListContainer}>
      <h2>Список користувачів</h2>
      <ul className={styles.usersList}>
        {users.map((user) => (
          <li key={user.id} className={styles.userItem}>
            <span className={styles.userEmail}>{user.email}</span>
            <span className={styles.userRole}>{user.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList; 