import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Tablet, Globe, Wifi, Cpu } from 'lucide-react';
import styles from './BrowserInfo.module.css';

const BrowserInfo = ({ browserInfo, systemInfo, connectionInfo }) => {
  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'Mobile': return <Smartphone size={20} />;
      case 'Tablet': return <Tablet size={20} />;
      case 'Desktop': return <Monitor size={20} />;
      default: return <Monitor size={20} />;
    }
  };



  const formatTimezoneOffset = (offset) => {
    const hours = Math.abs(Math.floor(offset / 60));
    const minutes = Math.abs(offset % 60);
    const sign = offset > 0 ? '-' : '+';
    return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.browserInfo}>
      {/* Информация о браузере */}
      <motion.div 
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className={styles.sectionTitle}>
          <Globe size={20} />
          Информация о браузере
        </h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Браузер:</span>
            <span className={styles.value}>{browserInfo.name} {browserInfo.version}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Движок:</span>
            <span className={styles.value}>{browserInfo.engine}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>ОС:</span>
            <span className={styles.value}>{browserInfo.os}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Устройство:</span>
            <span className={styles.value}>
              {getDeviceIcon(browserInfo.device)}
              {browserInfo.device}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Системная информация */}
      <motion.div 
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className={styles.sectionTitle}>
          <Cpu size={20} />
          Системная информация
        </h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Платформа:</span>
            <span className={styles.value}>{systemInfo.platform}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Язык:</span>
            <span className={styles.value}>{systemInfo.language}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Процессоры:</span>
            <span className={styles.value}>{systemInfo.hardwareConcurrency || 'Unknown'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Память:</span>
            <span className={styles.value}>
              {systemInfo.deviceMemory ? `${systemInfo.deviceMemory} GB` : 'Unknown'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Разрешение экрана:</span>
            <span className={styles.value}>
              {systemInfo.screenResolution.width} × {systemInfo.screenResolution.height}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Размер окна:</span>
            <span className={styles.value}>
              {systemInfo.viewportSize.width} × {systemInfo.viewportSize.height}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Глубина цвета:</span>
            <span className={styles.value}>{systemInfo.colorDepth} bit</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Часовой пояс:</span>
            <span className={styles.value}>
              {systemInfo.timezone} ({formatTimezoneOffset(systemInfo.timezoneOffset)})
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Touch Points:</span>
            <span className={styles.value}>{systemInfo.maxTouchPoints || 0}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Cookies:</span>
            <span className={styles.value}>
              {systemInfo.cookieEnabled ? 'Включены' : 'Отключены'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Информация о подключении */}
      <motion.div 
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className={styles.sectionTitle}>
          <Wifi size={20} />
          Сетевое подключение
        </h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Статус:</span>
            <span className={`${styles.value} ${styles.status}`}>
              {connectionInfo.onLine ? '🟢 Онлайн' : '🔴 Офлайн'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Тип соединения:</span>
            <span className={styles.value}>{connectionInfo.effectiveType}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Скорость загрузки:</span>
            <span className={styles.value}>
              {connectionInfo.downlink !== 'unknown' ? `${connectionInfo.downlink} Mbps` : 'Unknown'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>RTT:</span>
            <span className={styles.value}>
              {connectionInfo.rtt !== 'unknown' ? `${connectionInfo.rtt} ms` : 'Unknown'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Экономия данных:</span>
            <span className={styles.value}>
              {connectionInfo.saveData ? 'Включена' : 'Отключена'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BrowserInfo; 