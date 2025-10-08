import React from 'react';
import UsersList from 'pages/Profile/Admin/components/UsersList/UsersList';
// Removed CSS module import

const AdminPage = ({ user }) => {
  // Assuming the user object has a 'role' property
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Доступ заборонено</h2>
          <p className="text-gray-300">Ця сторінка доступна лише для адміністраторів.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container-custom py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Панель адміністратора</h1>
        </header>
        <div>
          <UsersList />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;



