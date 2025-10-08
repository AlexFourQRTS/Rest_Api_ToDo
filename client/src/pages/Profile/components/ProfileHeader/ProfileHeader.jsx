import React from 'react';
import { FaUserFriends } from 'react-icons/fa';
// Removed CSS module import

export const ProfileHeader = ({ userData, onLogout }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center">
          <FaUserFriends className="text-white text-2xl" />
        </div>
        <div className="flex-1 ml-4">
          <h1 className="text-2xl font-bold text-white">
            {userData.email}
            {userData.role === 'admin' && <span className="ml-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full">Адміністратор</span>}
          </h1>
          <span className="text-gray-300 text-sm">Онлайн</span>
        </div>
      </div>
      <button onClick={onLogout} className="btn-primary bg-red-600 hover:bg-red-700">
        Вийти
      </button>
    </div>
  );
}; 