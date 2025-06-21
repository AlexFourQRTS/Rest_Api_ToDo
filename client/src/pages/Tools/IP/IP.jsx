import React from "react";
import { motion } from "framer-motion";
import styles from "./IP.module.css";
import Hero from "../../../components/UI/Hero/Hero";

const IP = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className={styles.ip}>
      <motion.section
        className={styles.intro}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Hero 
          title="Ваш IP" 
          subtitle="Страница IP адреса в разработке" 
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
          <p>Функционал отображения IP адреса находится в разработке. Скоро здесь появится информация о вашем IP адресе и геолокации.</p>
        </div>
      </motion.section>
    </div>
  );
};

export default IP; 