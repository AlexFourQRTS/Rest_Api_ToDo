import React from "react";
import styles from "./ProfileSidebar.module.css";
import { 
  FaHome, 
  FaUsers, 
  FaImages, 
  FaVideo, 
  FaCog, 
  FaComments,
  FaEnvelope,
  FaCloud,
  FaSave,
  FaUserFriends,
} from 'react-icons/fa';

export const ProfileSidebar = ({ userData, selectedItem, onSelectItem, isOpen, onClose }) => {
  const menuItems = [
    { id: 'overview', label: 'Особистий кабінет', icon: <FaHome /> },
    { id: 'messages', label: 'Особисті повідомлення', icon: <FaEnvelope /> },
    { id: 'files', label: 'Особисті файли', icon: <FaCloud /> },
    { id: 'saved', label: 'Збережені матеріали', icon: <FaSave /> },
    { id: 'friends', label: 'Друзі', icon: <FaUserFriends /> },
    { id: 'photos', label: 'Фото', icon: <FaImages /> },
    { id: 'videos', label: 'Відео', icon: <FaVideo /> },
    { id: 'chat', label: 'Чат', icon: <FaComments /> },
    { id: 'settings', label: 'Налаштування', icon: <FaCog /> },
  ];

  if (userData && userData.role === 'admin') {
    menuItems.push({ id: 'admin', label: 'Адмін-панель', icon: <FaUsers /> });
  }

  return (
    <>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <FaUserFriends className={styles.avatarIcon} />
          </div>
          <div className={styles.userDetails}>
            {userData ? (
              <>
                <h2>{userData.email}</h2>
                <p>Онлайн</p>
              </>
            ) : (
              <>
                <h2>Гість</h2>
                <p>Увійдіть для доступу до всіх функцій</p>
              </>
            )}
          </div>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.menu}>
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`${styles.menuItem} ${
                  selectedItem === item.id ? styles.active : ''
                }`}
                onClick={() => onSelectItem(item.id)}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <span className={styles.menuLabel}>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
    </>
  );
};

export default ProfileSidebar; 