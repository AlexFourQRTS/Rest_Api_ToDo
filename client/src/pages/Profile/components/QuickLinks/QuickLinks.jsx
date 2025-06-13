import React from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaCloud, FaBook, FaQuestionCircle } from 'react-icons/fa';
import styles from './QuickLinks.module.css';

export const QuickLinks = () => {
  const links = [
    {
      to: '/chat',
      icon: <FaComments />,
      title: 'Чат',
      description: 'Спілкування з друзями та колегами'
    },
    {
      to: '/files',
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
      to: '/faq',
      icon: <FaQuestionCircle />,
      title: 'FAQ',
      description: 'Часті питання та відповіді'
    }
  ];

  return (
    <div className={styles.section}>
      <h2>Швидкий доступ</h2>
      <div className={styles.linksGrid}>
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.to}
            className={styles.quickLink}
          >
            <div className={styles.quickLinkIcon}>
              {link.icon}
            </div>
            <div className={styles.quickLinkContent}>
              <h3>{link.title}</h3>
              <p>{link.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}; 