import React from "react";
// Removed CSS module import
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
    { id: 'messages', label: 'Повідомлення', icon: <FaEnvelope /> },
    { id: 'friends', label: 'Друзі', icon: <FaUserFriends /> },
    { id: 'chat', label: 'Беседка', icon: <FaComments /> },
  ];

  if (userData && userData.role === 'admin') {
    menuItems.push({ id: 'admin', label: 'Адмін-панель', icon: <FaUsers /> });
  }

  return (
    <>
      <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800/90 backdrop-blur-md ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center">
              <FaUserFriends className="text-white text-xl" />
            </div>
            <div>
              {userData ? (
                <>
                  <h2 className="text-white font-semibold">{userData.email}</h2>
                  <p className="text-gray-300 text-sm">Онлайн</p>
                </>
              ) : (
                <>
                  <h2 className="text-white font-semibold">Гість</h2>
                  <p className="text-gray-400 text-sm">Увійдіть для доступу до всіх функцій</p>
                </>
              )}
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedItem === item.id 
                    ? 'bg-slate-600/20 text-white border border-slate-500/30' 
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
                onClick={() => onSelectItem(item.id)}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30" onClick={onClose} />}
    </>
  );
};

export default ProfileSidebar; 