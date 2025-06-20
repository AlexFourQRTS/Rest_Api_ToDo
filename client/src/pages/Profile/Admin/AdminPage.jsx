import React from 'react';
import UsersList from 'pages/Profile/Admin/components/UsersList/UsersList';
import styles from './AdminPage.module.css';

const AdminPage = ({ user }) => {
  // Assuming the user object has a 'role' property
  if (!user || user.role !== 'admin') {
    return (
      <div className={styles.adminPageContainer}>
        <div className={styles.accessDenied}>
          <h2>Доступ заборонено</h2>
          <p>Ця сторінка доступна лише для адміністраторів.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPageContainer}>
      <header className={styles.header}>
        <h1>Панель адміністратора</h1>
      </header>
      <div className={styles.content}>
        <UsersList />
      </div>
    </div>
  );
};

export default AdminPage;



