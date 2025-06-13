import React from 'react';
import styles from './PreviewFeatures.module.css';

const PreviewFeatures = () => {
  const features = [
    {
      icon: 'user',
      title: 'Особистий кабінет',
      description: 'Налаштування профілю, аватар, особиста інформація'
    },
    {
      icon: 'message-circle',
      title: 'Особисті повідомлення',
      description: 'Доступ до чату та особистих повідомлень'
    },
    {
      icon: 'cloud',
      title: 'Особисті файли',
      description: 'Зберігання та керування вашими файлами'
    },
    {
      icon: 'bookmark',
      title: 'Збережені матеріали',
      description: 'Доступ до збережених статей та матеріалів'
    }
  ];

  return (
    <div className={styles.previewFeatures}>
      <div className={styles.guestInfo}>
        <p className={styles.guestMessage}>
          Ви переглядаєте сторінку профілю як гість
        </p>
      </div>
      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <i data-feather={feature.icon} className={styles.featureIcon}></i>
            </div>
            <div className={styles.featureContent}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviewFeatures; 