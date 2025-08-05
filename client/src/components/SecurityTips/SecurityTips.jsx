import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Smartphone,
  Monitor,
  Wifi,
  Key,
  User,
  Globe,
  CreditCard,
  FileText,
  Settings
} from 'lucide-react';
import styles from './SecurityTips.module.css';

const SecurityTips = () => {
  const securityTips = [
    {
      category: 'Пароли и аутентификация',
      icon: <Key size={20} />,
      tips: [
        {
          title: 'Используйте сложные пароли',
          description: 'Минимум 12 символов, включая буквы, цифры и специальные символы',
          type: 'good'
        },
        {
          title: 'Не используйте один пароль везде',
          description: 'Для каждого сайта создавайте уникальный пароль',
          type: 'good'
        },
        {
          title: 'Используйте менеджер паролей',
          description: 'Bitwarden, 1Password или KeePass для безопасного хранения',
          type: 'good'
        },
        {
          title: 'Включите двухфакторную аутентификацию',
          description: '2FA значительно повышает безопасность аккаунтов',
          type: 'good'
        }
      ]
    },
    {
      category: 'Браузер и интернет',
      icon: <Globe size={20} />,
      tips: [
        {
          title: 'Проверяйте HTTPS соединения',
          description: 'Убедитесь, что сайт использует защищенное соединение',
          type: 'good'
        },
        {
          title: 'Не переходите по подозрительным ссылкам',
          description: 'Особенно в письмах от неизвестных отправителей',
          type: 'warning'
        },
        {
          title: 'Используйте блокировщики рекламы',
          description: 'uBlock Origin защищает от вредоносной рекламы',
          type: 'good'
        },
        {
          title: 'Регулярно очищайте кэш и cookies',
          description: 'Удаляйте данные, которые могут содержать личную информацию',
          type: 'good'
        }
      ]
    },
    {
      category: 'Устройства и сети',
      icon: <Smartphone size={20} />,
      tips: [
        {
          title: 'Обновляйте операционную систему',
          description: 'Регулярные обновления закрывают уязвимости безопасности',
          type: 'good'
        },
        {
          title: 'Не подключайтесь к публичным Wi-Fi',
          description: 'Используйте VPN при необходимости подключения',
          type: 'warning'
        },
        {
          title: 'Используйте антивирусное ПО',
          description: 'Регулярно сканируйте устройство на вирусы',
          type: 'good'
        },
        {
          title: 'Делайте резервные копии',
          description: 'Регулярно сохраняйте важные данные',
          type: 'good'
        }
      ]
    },
    {
      category: 'Личные данные',
      icon: <User size={20} />,
      tips: [
        {
          title: 'Не делитесь личной информацией',
          description: 'Будьте осторожны с персональными данными в интернете',
          type: 'warning'
        },
        {
          title: 'Проверяйте настройки приватности',
          description: 'Регулярно просматривайте настройки в соцсетях',
          type: 'good'
        },
        {
          title: 'Не публикуйте геолокацию',
          description: 'Отключайте GPS в приложениях, где это не нужно',
          type: 'warning'
        },
        {
          title: 'Используйте псевдонимы',
          description: 'Создавайте отдельные email для разных сервисов',
          type: 'good'
        }
      ]
    },
    {
      category: 'Финансовая безопасность',
      icon: <CreditCard size={20} />,
      tips: [
        {
          title: 'Используйте виртуальные карты',
          description: 'Для онлайн покупок создавайте временные карты',
          type: 'good'
        },
        {
          title: 'Не сохраняйте данные карт',
          description: 'Избегайте сохранения платежной информации на сайтах',
          type: 'warning'
        },
        {
          title: 'Проверяйте выписки',
          description: 'Регулярно просматривайте банковские операции',
          type: 'good'
        },
        {
          title: 'Используйте надежные платежные системы',
          description: 'PayPal, Apple Pay или Google Pay для дополнительной защиты',
          type: 'good'
        }
      ]
    },
    {
      category: 'Социальные сети',
      icon: <Settings size={20} />,
      tips: [
        {
          title: 'Ограничивайте доступ к профилю',
          description: 'Настройте приватность аккаунта',
          type: 'good'
        },
        {
          title: 'Не принимайте всех подряд',
          description: 'Добавляйте в друзья только знакомых людей',
          type: 'warning'
        },
        {
          title: 'Проверяйте настройки приложений',
          description: 'Отзывайте доступ у неиспользуемых приложений',
          type: 'good'
        },
        {
          title: 'Не публикуйте конфиденциальную информацию',
          description: 'Избегайте постов о работе, доходах, планах',
          type: 'warning'
        }
      ]
    }
  ];

  const getTipIcon = (type) => {
    switch (type) {
      case 'good':
        return <CheckCircle size={16} className={styles.goodIcon} />;
      case 'warning':
        return <AlertTriangle size={16} className={styles.warningIcon} />;
      case 'bad':
        return <XCircle size={16} className={styles.badIcon} />;
      default:
        return <CheckCircle size={16} />;
    }
  };

  return (
    <motion.div 
      className={styles.securityTips}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Shield size={24} />
          Безопасность в интернете
        </h2>
        <p className={styles.subtitle}>
          Важные советы для защиты ваших данных и устройства
        </p>
      </div>

      <div className={styles.tipsGrid}>
        {securityTips.map((category, categoryIndex) => (
          <motion.div 
            key={category.category}
            className={styles.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
          >
            <h3 className={styles.categoryTitle}>
              {category.icon}
              {category.category}
            </h3>
            
            <div className={styles.tipsList}>
              {category.tips.map((tip, tipIndex) => (
                <motion.div 
                  key={tip.title}
                  className={styles.tipItem}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (tipIndex * 0.05) }}
                >
                  <div className={styles.tipIcon}>
                    {getTipIcon(tip.type)}
                  </div>
                  <div className={styles.tipContent}>
                    <h4 className={styles.tipTitle}>{tip.title}</h4>
                    <p className={styles.tipDescription}>{tip.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className={styles.legend}>
        <h4>Условные обозначения:</h4>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <CheckCircle size={16} className={styles.goodIcon} />
            <span>Рекомендуется</span>
          </div>
          <div className={styles.legendItem}>
            <AlertTriangle size={16} className={styles.warningIcon} />
            <span>Будьте осторожны</span>
          </div>
          <div className={styles.legendItem}>
            <XCircle size={16} className={styles.badIcon} />
            <span>Избегайте</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SecurityTips; 