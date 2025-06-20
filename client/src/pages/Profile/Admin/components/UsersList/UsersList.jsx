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
        setUsers(data);
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