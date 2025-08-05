import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  Database, 
  Shield, 
  Smartphone, 
  Zap, 
  FileText,
  Share2,
  Bell,
  Clipboard,
  Users,
  Key,
  Eye,
  Battery,
  Bluetooth,
  Usb,
  Gamepad2,
  Presentation,
  CreditCard
} from 'lucide-react';
import styles from './WebAPIInfo.module.css';

const WebAPIInfo = ({ webAPIInfo, mediaInfo, storageInfo, securityInfo, sensorsInfo }) => {
  const getIcon = (apiName) => {
    const iconMap = {
      fetch: <Wifi size={16} />,
      promises: <Zap size={16} />,
      asyncAwait: <Zap size={16} />,
      webWorkers: <Smartphone size={16} />,
      sharedWorkers: <Smartphone size={16} />,
      webSockets: <Wifi size={16} />,
      serverSentEvents: <Wifi size={16} />,
      webRTC: <Wifi size={16} />,
      pushManager: <Bell size={16} />,
      notifications: <Bell size={16} />,
      clipboard: <Clipboard size={16} />,
      share: <Share2 size={16} />,
      contacts: <Users size={16} />,
      credentials: <Key size={16} />,
      permissions: <Eye size={16} />,
      wakeLock: <Battery size={16} />,
      bluetooth: <Bluetooth size={16} />,
      usb: <Usb size={16} />,
      serial: <Usb size={16} />,
      hid: <Usb size={16} />,
      gamepad: <Gamepad2 size={16} />,
      presentation: <Presentation size={16} />,
      payment: <CreditCard size={16} />
    };
    return iconMap[apiName] || <FileText size={16} />;
  };

  const renderAPISection = (title, icon, apis, data) => {
    return (
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          {icon}
          {title}
        </h3>
        <div className={styles.infoGrid}>
          {apis.map(api => (
            <div key={api} className={styles.infoItem}>
              <span className={styles.label}>
                {getIcon(api)}
                {api}
              </span>
              <span className={`${styles.value} ${data[api] ? styles.supported : styles.notSupported}`}>
                {data[api] ? '✅ Поддерживается' : '❌ Не поддерживается'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className={styles.webAPIInfo}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Основные Web APIs */}
      {renderAPISection(
        'Основные Web APIs',
        <Zap size={20} />,
        ['fetch', 'promises', 'asyncAwait', 'webWorkers', 'sharedWorkers', 'webSockets', 'serverSentEvents', 'webRTC'],
        webAPIInfo
      )}

      {/* Медиа APIs */}
      {renderAPISection(
        'Медиа APIs',
        <Smartphone size={20} />,
        ['mediaDevices', 'getUserMedia', 'mediaSession', 'mediaCapabilities', 'mediaRecorder', 'webAudio'],
        mediaInfo
      )}

      {/* Хранилище */}
      {renderAPISection(
        'Хранилище',
        <Database size={20} />,
        ['localStorage', 'sessionStorage', 'indexedDB', 'webSQL', 'cookies', 'cacheStorage', 'serviceWorker'],
        storageInfo
      )}

      {/* Безопасность */}
      {renderAPISection(
        'Безопасность',
        <Shield size={20} />,
        ['isSecureContext', 'origin', 'protocol', 'hostname', 'port', 'pathname', 'search', 'hash', 'referrer'],
        securityInfo
      )}

      {/* Датчики */}
      {renderAPISection(
        'Датчики',
        <Smartphone size={20} />,
        ['accelerometer', 'gyroscope', 'magnetometer', 'absoluteOrientation', 'relativeOrientation', 'geolocation', 'vibration', 'battery', 'proximity', 'ambientLight'],
        sensorsInfo
      )}

      {/* Дополнительные APIs */}
      {renderAPISection(
        'Дополнительные APIs',
        <FileText size={20} />,
        ['pushManager', 'notifications', 'clipboard', 'share', 'contacts', 'credentials', 'permissions', 'wakeLock', 'bluetooth', 'usb', 'serial', 'hid', 'gamepad', 'presentation', 'payment'],
        webAPIInfo
      )}

      {/* Статистика поддержки */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <FileText size={20} />
          Статистика поддержки
        </h3>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Всего APIs:</span>
            <span className={styles.statValue}>
              {Object.keys(webAPIInfo).length + Object.keys(mediaInfo).length + Object.keys(storageInfo).length + Object.keys(securityInfo).length + Object.keys(sensorsInfo).length}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Поддерживается:</span>
            <span className={styles.statValue}>
              {Object.values(webAPIInfo).filter(Boolean).length + 
               Object.values(mediaInfo).filter(Boolean).length + 
               Object.values(storageInfo).filter(Boolean).length + 
               Object.values(securityInfo).filter(Boolean).length + 
               Object.values(sensorsInfo).filter(Boolean).length}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Процент поддержки:</span>
            <span className={styles.statValue}>
              {Math.round(
                ((Object.values(webAPIInfo).filter(Boolean).length + 
                  Object.values(mediaInfo).filter(Boolean).length + 
                  Object.values(storageInfo).filter(Boolean).length + 
                  Object.values(securityInfo).filter(Boolean).length + 
                  Object.values(sensorsInfo).filter(Boolean).length) /
                (Object.keys(webAPIInfo).length + Object.keys(mediaInfo).length + Object.keys(storageInfo).length + Object.keys(securityInfo).length + Object.keys(sensorsInfo).length)) * 100
              )}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WebAPIInfo; 