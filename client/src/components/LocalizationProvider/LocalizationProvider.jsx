import React, { useEffect, useState } from 'react';
import useLocalization from '../../hooks/useLocalization';
import styles from './LocalizationProvider.module.css';

const LocalizationProvider = ({ children }) => {
  const { isInitialized, currentLanguage } = useLocalization();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Показываем лоадер только если локализация еще не инициализирована
    if (isInitialized) {
      // Небольшая задержка для плавного перехода
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  // Показываем лоадер пока локализация не готова
  if (showLoader || !isInitialized) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}>
          <div className={styles.spinner}></div>
          <p className={styles.loaderText}>Загрузка...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default LocalizationProvider; 