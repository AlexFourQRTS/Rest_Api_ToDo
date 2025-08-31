// import React from 'react';
// import { motion } from 'framer-motion';
// import { MessageCircle, Code, Coffee, Clock } from 'lucide-react';
// import styles from './Chat.module.css';

// const Chat = () => {
//   return (
//     <div className={styles.chatContainer}>
//       <motion.div 
//         className={styles.header}
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className={styles.iconContainer}>
//           <MessageCircle size={48} className={styles.icon} />
//         </div>
//         <h1 className={styles.title}>💬 Чат</h1>
//         <p className={styles.subtitle}>Система обмена сообщениями</p>
//       </motion.div>

//       <motion.div 
//         className={styles.content}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//       >
//         <div className={styles.developmentCard}>
//           <div className={styles.developmentIcon}>
//             <Code size={64} />
//           </div>
          
//           <h2 className={styles.developmentTitle}>
//             🚧 В разработке
//           </h2>
          
//           <p className={styles.developmentDescription}>
//             Система чата находится в активной разработке. 
//             Мы работаем над созданием удобного интерфейса для обмена сообщениями.
//           </p>

//           <div className={styles.features}>
//             <div className={styles.feature}>
//               <div className={styles.featureIcon}>
//                 <MessageCircle size={24} />
//               </div>
//               <div className={styles.featureText}>
//                 <h3>Обмен сообщениями</h3>
//                 <p>Мгновенная отправка и получение сообщений</p>
//               </div>
//             </div>

//             <div className={styles.feature}>
//               <div className={styles.featureIcon}>
//                 <Coffee size={24} />
//               </div>
//               <div className={styles.featureText}>
//                 <h3>Удобный интерфейс</h3>
//                 <p>Современный дизайн с темной темой</p>
//               </div>
//             </div>

//             <div className={styles.feature}>
//               <div className={styles.featureIcon}>
//                 <Clock size={24} />
//               </div>
//               <div className={styles.featureText}>
//                 <h3>История сообщений</h3>
//                 <p>Сохранение и просмотр истории переписки</p>
//               </div>
//             </div>
//           </div>

//           <div className={styles.progress}>
//             <div className={styles.progressBar}>
//               <div className={styles.progressFill}></div>
//             </div>
//             <p className={styles.progressText}>Прогресс разработки: 35%</p>
//           </div>

//           <div className={styles.estimatedTime}>
//             <p>⏰ Ориентировочное время запуска: <strong>2-3 недели</strong></p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Chat; 