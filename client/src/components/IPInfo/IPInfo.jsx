import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Wifi, Clock, Copy, Check } from 'lucide-react';
import styles from './IPInfo.module.css';

const IPInfo = ({ ipData, isLoading, error }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <motion.div 
        className={styles.ipInfo}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Получение информации об IP адресе...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className={styles.ipInfo}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className={styles.error}>
          <h3>❌ Ошибка загрузки</h3>
          <p>{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={styles.ipInfo}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Основная информация об IP */}
      <div className={styles.mainSection}>
        <h3 className={styles.sectionTitle}>
          <Globe size={20} />
          Ваш IP адрес
        </h3>
        <div className={styles.ipDisplay}>
          <span className={styles.ipAddress}>{ipData.ip}</span>
          <button 
            className={styles.copyButton}
            onClick={() => copyToClipboard(ipData.ip)}
            title="Копировать IP"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Геолокация */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <MapPin size={20} />
          Геолокация
        </h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Страна:</span>
            <span className={styles.value}>
              {ipData.country} {ipData.countryFlag}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Регион:</span>
            <span className={styles.value}>{ipData.region || 'Unknown'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Город:</span>
            <span className={styles.value}>{ipData.city || 'Unknown'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Почтовый индекс:</span>
            <span className={styles.value}>{ipData.postal || 'Unknown'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Координаты:</span>
            <span className={styles.value}>
              {ipData.latitude && ipData.longitude 
                ? `${ipData.latitude}, ${ipData.longitude}`
                : 'Unknown'
              }
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Часовой пояс:</span>
            <span className={styles.value}>{ipData.timezone || 'Unknown'}</span>
          </div>
        </div>
      </div>

      {/* Сетевая информация */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <Wifi size={20} />
          Сетевая информация
        </h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Провайдер:</span>
            <span className={styles.value}>{ipData.org || 'Unknown'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>ASN:</span>
            <span className={styles.value}>{ipData.asn || 'Unknown'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Хост:</span>
            <span className={styles.value}>{ipData.hostname || 'Unknown'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Тип IP:</span>
            <span className={styles.value}>
              {ipData.ip?.includes(':') ? 'IPv6' : 'IPv4'}
            </span>
          </div>
        </div>
      </div>

      {/* Время запроса */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <Clock size={20} />
          Время запроса
        </h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Дата и время:</span>
            <span className={styles.value}>
              {formatDate(new Date().toISOString())}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IPInfo; 