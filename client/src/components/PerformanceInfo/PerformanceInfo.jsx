import React from 'react';
import { motion } from 'framer-motion';
import { Activity, HardDrive, Clock, Navigation } from 'lucide-react';
import styles from './PerformanceInfo.module.css';

const PerformanceInfo = ({ performanceInfo }) => {
  if (!performanceInfo) {
    return (
      <motion.div 
        className={styles.performanceInfo}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className={styles.error}>
          <h3>❌ Информация недоступна</h3>
          <p>Данные о производительности не могут быть получены в этом браузере.</p>
        </div>
      </motion.div>
    );
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString('ru-RU');
  };

  const calculateLoadTime = () => {
    if (!performanceInfo.timing) return 'N/A';
    const timing = performanceInfo.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    return `${loadTime}ms`;
  };

  const calculateDOMReadyTime = () => {
    if (!performanceInfo.timing) return 'N/A';
    const timing = performanceInfo.timing;
    const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
    return `${domReadyTime}ms`;
  };

  return (
    <motion.div 
      className={styles.performanceInfo}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Информация о памяти */}
      {performanceInfo.memory && (
        <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
          <HardDrive size={20} />
          Использование памяти
        </h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Используется:</span>
              <span className={styles.value}>{performanceInfo.memory.usedJSHeapSize}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Всего выделено:</span>
              <span className={styles.value}>{performanceInfo.memory.totalJSHeapSize}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Лимит:</span>
              <span className={styles.value}>{performanceInfo.memory.jsHeapSizeLimit}</span>
            </div>
          </div>
        </div>
      )}

      {/* Время загрузки */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <Clock size={20} />
          Время загрузки
        </h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Полная загрузка:</span>
            <span className={styles.value}>{calculateLoadTime()}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>DOM готов:</span>
            <span className={styles.value}>{calculateDOMReadyTime()}</span>
          </div>
          {performanceInfo.timing && (
            <>
              <div className={styles.infoItem}>
                <span className={styles.label}>Начало навигации:</span>
                <span className={styles.value}>{formatTime(performanceInfo.timing.navigationStart)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>DNS запрос:</span>
                <span className={styles.value}>
                  {performanceInfo.timing.domainLookupEnd - performanceInfo.timing.domainLookupStart}ms
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Подключение:</span>
                <span className={styles.value}>
                  {performanceInfo.timing.connectEnd - performanceInfo.timing.connectStart}ms
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Ответ сервера:</span>
                <span className={styles.value}>
                  {performanceInfo.timing.responseEnd - performanceInfo.timing.responseStart}ms
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Информация о навигации */}
      {performanceInfo.navigation && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Navigation size={20} />
            Навигация
          </h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Тип навигации:</span>
              <span className={styles.value}>{performanceInfo.navigation.type}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Количество редиректов:</span>
              <span className={styles.value}>{performanceInfo.navigation.redirectCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Общая производительность */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <Activity size={20} />
          Общая производительность
        </h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Performance API:</span>
            <span className={styles.value}>
              {window.performance ? '✅ Поддерживается' : '❌ Не поддерживается'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Memory API:</span>
            <span className={styles.value}>
              {performanceInfo.memory ? '✅ Поддерживается' : '❌ Не поддерживается'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Timing API:</span>
            <span className={styles.value}>
              {performanceInfo.timing ? '✅ Поддерживается' : '❌ Не поддерживается'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Navigation API:</span>
            <span className={styles.value}>
              {performanceInfo.navigation ? '✅ Поддерживается' : '❌ Не поддерживается'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PerformanceInfo; 