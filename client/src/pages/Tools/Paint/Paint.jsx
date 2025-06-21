import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PaintModal from './components/PaintModal';
import styles from './Paint.module.css';

const Paint = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={styles.paintContainer}>
      <motion.h1 
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        🔧 Flowchart & Diagram Builder
      </motion.h1>
      
      <motion.p 
        className={styles.subtitle}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Создавайте блок-схемы, диаграммы алгоритмов и технические схемы
      </motion.p>

      <motion.button
        className={styles.openButton}
        onClick={() => setShowModal(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Открыть редактор блок-схем
      </motion.button>

      {showModal && (
        <PaintModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Paint; 