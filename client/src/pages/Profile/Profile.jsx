import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBars, 
  FaHome, 
  FaEnvelope, 
  FaCloud, 
  FaSave, 
  FaUserFriends, 
  FaImages, 
  FaVideo, 
  FaComments, 
  FaCog 
} from 'react-icons/fa';
import { authApi } from '../../api/authApi';
import { ProfileSidebar } from './components/ProfileSidebar/ProfileSidebar';
import { ProfileHeader } from './components/ProfileHeader/ProfileHeader';
import { QuickLinks } from './components/QuickLinks/QuickLinks';
import { AuthForm } from '../../components/Auth/AuthForm';
import { Chat } from '../../components/Chat/Chat';
import styles from './Profile.module.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await authApi.getProfile();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    authApi.logout();
    setUserData(null);
    navigate('/');
  };

  const handleLoginSuccess = (data) => {
    setUserData(data);
    setIsSidebarOpen(false);
  };

  const handleRegisterSuccess = (data) => {
    setUserData(data);
    setIsSidebarOpen(false);
  };

  const renderGuestContent = () => {
    const featureDescriptions = {
      overview: {
        title: 'Особистий кабінет',
        description: 'Ваш особистий простір, де ви можете керувати своїми налаштуваннями та переглядати статистику.',
        icon: <FaHome />
      },
      messages: {
        title: 'Особисті повідомлення',
        description: 'Безпечний обмін повідомленнями з іншими користувачами. Зберігайте історію спілкування та важливі контакти.',
        icon: <FaEnvelope />
      },
      files: {
        title: 'Особисті файли',
        description: 'Зберігайте та організовуйте свої файли в хмарному сховищі. Легкий доступ з будь-якого пристрою.',
        icon: <FaCloud />
      },
      saved: {
        title: 'Збережені матеріали',
        description: 'Зберігайте важливі матеріали, статті та посилання для подальшого використання.',
        icon: <FaSave />
      },
      friends: {
        title: 'Друзі',
        description: 'Зберігайте список друзів та спілкуйтеся з ними. Додавайте нових знайомих та керуйте своїми контактами.',
        icon: <FaUserFriends />
      },
      photos: {
        title: 'Фото',
        description: 'Зберігайте та організовуйте свої фотографії. Створюйте альбоми та діліться ними з друзями.',
        icon: <FaImages />
      },
      videos: {
        title: 'Відео',
        description: 'Зберігайте відео та створюйте плейлисти. Діліться відео з друзями та переглядайте їх онлайн.',
        icon: <FaVideo />
      },
      chat: {
        title: 'Чат',
        description: 'Миттєвий обмін повідомленнями з друзями та колегами. Групові чати та обмін файлами.',
        icon: <FaComments />
      },
      settings: {
        title: 'Налаштування',
        description: 'Налаштуйте свій профіль, приватність та сповіщення. Керуйте своїми даними та налаштуваннями безпеки.',
        icon: <FaCog />
      }
    };

    const feature = featureDescriptions[selectedItem];

    return (
      <div className={styles.featurePage}>
        <div className={styles.featureHeader}>
          <div className={styles.featureIcon}>
            {feature.icon}
          </div>
          <h2>{feature.title}</h2>
        </div>
        <div className={styles.featureContent}>
          <p className={styles.featureDescription}>{feature.description}</p>
          <div className={styles.authSection}>
            <h3>Увійдіть для доступу до всіх функцій</h3>
            <AuthForm
              onLoginSuccess={handleLoginSuccess}
              onRegisterSuccess={handleRegisterSuccess}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!userData) {
      return renderGuestContent();
    }

    switch (selectedItem) {
      case 'overview':
        return (
          <>
            <ProfileHeader userData={userData} onLogout={handleLogout} />
            <QuickLinks />
          </>
        );
      case 'chat':
        return <Chat />;
      default:
        return <div>Розділ в розробці</div>;
    }
  };

  if (loading) {
    return <div>Завантаження...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <button 
        className={styles.menuToggle}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle menu"
      >
        <FaBars />
      </button>
      <ProfileSidebar
        userData={userData}
        selectedItem={selectedItem}
        onSelectItem={(item) => {
          setSelectedItem(item);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className={styles.mainContent}>
        {renderContent()}
      </main>
    </div>
  );
};

export default Profile; 