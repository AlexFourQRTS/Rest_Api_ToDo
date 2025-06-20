import React from 'react';
import { FaUserFriends } from 'react-icons/fa';
import styles from './ProfileHeader.module.css';

export const ProfileHeader = ({ userData, onLogout }) => {
  return (
    <div className={styles.profileHeader}>
      <div className={styles.profileHeaderContent}>
        <div className={styles.avatar}>
          <FaUserFriends className={styles.avatarIcon} />
        </div>
        <div className={styles.profileHeaderInfo}>
          <h1>
            {userData.email}
            {userData.role === 'admin' && <span className={styles.adminBadge}>Адміністратор</span>}
          </h1>
          <span className={styles.status}>Онлайн</span>
        </div>
      </div>
      <button onClick={onLogout} className={styles.logoutButton}>
        Вийти
      </button>
    </div>
  );
}; 