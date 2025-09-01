import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Code, Coffee, Clock } from 'lucide-react';
import styles from './Chat.module.css';

const Chat = () => {
  return (
    <div className={styles.chatContainer}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

        <h1 className={styles.title}>💬 Беседка</h1>
        <p className={styles.subtitle}>Система обмена сообщениями</p>
      </motion.div>

      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={styles.developmentCard}>
          <div className={styles.developmentIcon}>
            <Code size={64} />
          </div>
          
          <h2 className={styles.developmentTitle}>
            🚧 В разработке
          </h2>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <MessageCircle size={24} />
              </div>
              <div className={styles.featureText}>
                <h3>Обмен сообщениями</h3>
                <p>Мгновенная отправка и получение сообщений</p>
              </div>
            </div>
      
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat; 