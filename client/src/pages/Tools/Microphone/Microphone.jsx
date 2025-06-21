import React from "react";
import { motion } from "framer-motion";
import styles from "./Microphone.module.css";
import Hero from "../../../components/UI/Hero/Hero";

const Microphone = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className={styles.microphone}>
      <motion.section
        className={styles.intro}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Hero 
          title="Микрофон" 
          subtitle="Страница микрофона в разработке" 
        />
      </motion.section>
      
      <motion.section
        className={styles.content}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.developmentMessage}>
          <h2>🚧 В разработке</h2>
          <p>Функционал микрофона находится в разработке. Скоро здесь появится возможность работы с аудио и записью звука.</p>
        </div>
      </motion.section>
    </div>
  );
};

export default Microphone; 