import React from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaCloud, FaBook, FaQuestionCircle } from 'react-icons/fa';
// Removed CSS module import

export const QuickLinks = () => {
  const links = [
    {
      to: '/chat',
      icon: <FaComments />,
      title: 'Беседка',
      description: 'Спілкування з друзями та колегами'
    },
    {
      to: '/filecloud',
      icon: <FaCloud />,
      title: 'Файли',
      description: 'Доступ до ваших файлів'
    },
    {
      to: '/blog',
      icon: <FaBook />,
      title: 'Блог',
      description: 'Останні новини та статті'
    },
    {
      to: '/games',
      icon: <FaBook />,
      title: 'Емулятор',
      description: 'Эмулятор - тут наш олдскул'
    },

    {
      to: '/games',
      icon: <FaBook />,
      title: 'Программы',
      description: 'Программы для win7 / 10 / 11'
    },

        {
      to: '/games',
      icon: <FaBook />,
      title: 'Алавар',
      description: 'Внезапно игры от алавар'
    },

  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Швидкий доступ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.to}
            className="card p-4 hover:shadow-2xl hover:scale-105 group"
          >
            <div className="flex items-center space-x-4">
              <div className="text-gray-300 text-2xl group-hover:text-gray-300 transition-colors">
                {link.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{link.title}</h3>
                <p className="text-gray-300 text-sm">{link.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}; 