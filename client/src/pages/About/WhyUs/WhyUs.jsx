import React, { useState } from "react";
import { motion } from "framer-motion";
import translations from "./whyChooseMeTranslations.json";
import styles from "./WhyUs.module.css";
import Hero from "../../../components/UI/Hero/Hero";

const languages = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "uk", name: "Українська" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "pt", name: "Português" },
];

const reasons = [
  {
    id: "versatility",
    title: "versatility_title",
    description: "versatility_description",
    icon: "react",
  },
  {
    id: "flexibility",
    title: "flexibility_title",
    description: "flexibility_description",
    icon: "electron",
  },
  {
    id: "practicality",
    title: "practicality_title",
    description: "practicality_description",
    icon: "git",
  },
  {
    id: "independence",
    title: "independence_title",
    description: "independence_description",
    icon: "jira",
  },
  {
    id: "deployment",
    title: "deployment_title",
    description: "deployment_description",
    icon: "docker",
  },
  {
    id: "innovation",
    title: "innovation_title",
    description: "innovation_description",
    icon: "ollama",
  },
];

const WhyUs = () => {
  const [language, setLanguage] = useState("en");
  const t = translations[language];

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className={styles.whyChooseMe}>
      <motion.div
        className={styles.languageSwitcher}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={styles.languageSelect}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </motion.div>

      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >

        <Hero title={t.title}
        subtitle={t.intro} />
        
        <div className={styles.reasons}>
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.id}
              className={styles.reasonCard}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={`https://cdn.simpleicons.org/${reason.icon}`}
                alt={reason.id}
                className={styles.reasonIcon}
              />
              <h2 className={styles.reasonTitle}>{t[reason.title]}</h2>
              <p className={styles.reasonDescription}>{t[reason.description]}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default WhyUs;