import React, { useState } from "react";
import { motion } from "framer-motion";
import translations from "./translations.json";
import styles from "./Tools.module.css";
import Hero from "../../components/UI/Hero/Hero";

const developmentTools = [
  { name: "VS Code", icon: "https://cdn.simpleicons.org/visualstudiocode/007acc" },
  { name: "WebStorm", icon: "https://cdn.simpleicons.org/webstorm/000000" },
  { name: "Postman", icon: "https://cdn.simpleicons.org/postman/ff6c37" },
  { name: "Insomnia", icon: "https://cdn.simpleicons.org/insomnia/4000bf" },
  { name: "DBeaver", icon: "https://cdn.simpleicons.org/dbeaver/372923" },
  { name: "MongoDB Compass", icon: "https://cdn.simpleicons.org/mongodb/47a248" },
];

const designTools = [
  { name: "Figma", icon: "https://cdn.simpleicons.org/figma/f24e1e" },
  { name: "Adobe XD", icon: "https://cdn.simpleicons.org/adobexd/ff61f6" },
  { name: "Sketch", icon: "https://cdn.simpleicons.org/sketch/fdb300" },
  { name: "InVision", icon: "https://cdn.simpleicons.org/invision/ff3366" },
];

const testingTools = [
  { name: "Jest", icon: "https://cdn.simpleicons.org/jest/c21325" },
  { name: "Cypress", icon: "https://cdn.simpleicons.org/cypress/17202c" },
  { name: "Playwright", icon: "https://cdn.simpleicons.org/playwright/2ead33" },
  { name: "Selenium", icon: "https://cdn.simpleicons.org/selenium/43b02a" },
];

const deploymentTools = [
  { name: "Docker", icon: "https://cdn.simpleicons.org/docker/0db7ed" },
  { name: "Kubernetes", icon: "https://cdn.simpleicons.org/kubernetes/326ce5" },
  { name: "AWS", icon: "https://cdn.simpleicons.org/amazonaws/232f3e" },
  { name: "Vercel", icon: "https://cdn.simpleicons.org/vercel/000000" },
  { name: "Netlify", icon: "https://cdn.simpleicons.org/netlify/00c7b7" },
  { name: "Heroku", icon: "https://cdn.simpleicons.org/heroku/430098" },
];

const monitoringTools = [
  { name: "Sentry", icon: "https://cdn.simpleicons.org/sentry/362d59" },
  { name: "LogRocket", icon: "https://cdn.simpleicons.org/logrocket/764abc" },
  { name: "New Relic", icon: "https://cdn.simpleicons.org/newrelic/008c99" },
  { name: "Grafana", icon: "https://cdn.simpleicons.org/grafana/f46800" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "uk", name: "Українська" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "pt", name: "Português" },
];

const Tools = () => {
  const [language, setLanguage] = useState("en");
  const t = translations[language];

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.05, y: -5, transition: { duration: 0.2 } },
  };

  return (
    <div className={styles.tools}>
      <motion.div
        className={styles.languageSwitcher}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
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
        className={styles.intro}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Hero title={t.title} subtitle={t.intro} />
      </motion.section>

      <motion.section
        className={styles.developmentTools}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className={styles.subtitle}>{t.developmentTools}</h2>
        <div className={styles.toolsGrid}>
          {developmentTools.map((tool) => (
            <motion.div
              key={tool.name}
              className={styles.toolItem}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <img
                src={tool.icon}
                alt={`${tool.name} icon`}
                className={styles.toolIcon}
              />
              <span>{t.toolNames[tool.name]}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className={styles.designTools}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className={styles.subtitle}>{t.designTools}</h2>
        <div className={styles.toolsGrid}>
          {designTools.map((tool) => (
            <motion.div
              key={tool.name}
              className={styles.toolItem}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <img
                src={tool.icon}
                alt={`${tool.name} icon`}
                className={styles.toolIcon}
              />
              <span>{t.toolNames[tool.name]}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className={styles.testingTools}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className={styles.subtitle}>{t.testingTools}</h2>
        <div className={styles.toolsGrid}>
          {testingTools.map((tool) => (
            <motion.div
              key={tool.name}
              className={styles.toolItem}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <img
                src={tool.icon}
                alt={`${tool.name} icon`}
                className={styles.toolIcon}
              />
              <span>{t.toolNames[tool.name]}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className={styles.deploymentTools}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className={styles.subtitle}>{t.deploymentTools}</h2>
        <div className={styles.toolsGrid}>
          {deploymentTools.map((tool) => (
            <motion.div
              key={tool.name}
              className={styles.toolItem}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <img
                src={tool.icon}
                alt={`${tool.name} icon`}
                className={styles.toolIcon}
              />
              <span>{t.toolNames[tool.name]}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className={styles.monitoringTools}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className={styles.subtitle}>{t.monitoringTools}</h2>
        <div className={styles.toolsGrid}>
          {monitoringTools.map((tool) => (
            <motion.div
              key={tool.name}
              className={styles.toolItem}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <img
                src={tool.icon}
                alt={`${tool.name} icon`}
                className={styles.toolIcon}
              />
              <span>{t.toolNames[tool.name]}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className={styles.description}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className={styles.subtitle}>{t.description}</h2>
        <p className={styles.text}>{t.descriptionText}</p>
      </motion.section>
    </div>
  );
};

export default Tools; 