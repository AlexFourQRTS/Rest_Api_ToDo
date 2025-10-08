import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FaHome, 
  FaEnvelope, 
  FaUserFriends, 
  FaComments, 
  FaCog 
} from 'react-icons/fa';
import { authApi } from '../../api';
import { routes } from '../../routes';
import { ProfileHeader } from 'pages/Profile/components/ProfileHeader/ProfileHeader';
import { QuickLinks } from 'pages/Profile/components/QuickLinks/QuickLinks';
import AuthPage from 'pages/Profile/auth/AuthPage';
import Chat from 'pages/Profile/components/Chat/Chat';
import ChangePasswordForm from 'pages/Profile/components/ChangePasswordForm/ChangePasswordForm';
import AdminPage from 'pages/Profile/Admin/AdminPage';
// Removed CSS module import

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedItem = searchParams.get('tab') || 'overview';

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
    navigate(routes.profile);
  };

  const handleLoginSuccess = (data) => {
    setUserData(data);
  };

  const renderGuestContent = () => {
    const featureDescriptions = {

      overview: {
        title: 'Особистий кабінет',
        description: 'Ваш особистий простір, де ви можете керувати своїми налаштуваннями та переглядати статистику.',
        icon: <FaHome />
      },

      messages: {
        title: 'Повідомлення',
        description: 'Безпечний обмін повідомленнями з іншими користувачами. Зберігайте історію спілкування та важливі контакти.',
        icon: <FaEnvelope />
      },

      friends: {
        title: 'Друзі',
        description: 'Зберігайте список друзів та спілкуйтеся з ними. Додавайте нових знайомих та керуйте своїми контактами.',
        icon: <FaUserFriends />
      },
 
      chat: {
        title: 'Беседка',
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
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="text-gray-300 text-3xl">
            {feature.icon}
          </div>
          <h2 className="text-2xl font-bold text-white">{feature.title}</h2>
        </div>
        <div className="space-y-6">
          <p className="text-gray-300">{feature.description}</p>
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Увійдіть для доступу до всіх функцій</h3>
            <AuthPage onAuthSuccess={handleLoginSuccess} />
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
      case 'settings':
        return <ChangePasswordForm />;
      case 'admin':
        return <AdminPage user={userData} />;
      default:
        return <div>Розділ в розробці</div>;
    }
  };

  if (loading) {
    return <div>Завантаження...</div>;
  }

  return (
    <div className="min-h-screen">
      <main className="p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Profile; 