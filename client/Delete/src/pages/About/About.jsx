import React, { useState } from "react";
import { motion } from "framer-motion";
import translations from "./translations.json";
import styles from "./About.module.css";
import Hero from "../../components/UI/Hero/Hero";

const skills = [
  { name: "Docker", icon: "https://cdn.simpleicons.org/docker/0db7ed" },
  { name: "React", icon: "https://cdn.simpleicons.org/react/61dafb" },
  { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/000000" },
  { name: "NestJS", icon: "https://cdn.simpleicons.org/nestjs/e0234e" },
  { name: "Express", icon: "https://cdn.simpleicons.org/express/000000" },
  { name: "WebSocket", icon: "https://cdn.simpleicons.org/socketdotio/010101" },
  { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/336791" },
  { name: "MongoDB", icon: "https://cdn.simpleicons.org/mongodb/47a248" },
  { name: "Nginx", icon: "https://cdn.simpleicons.org/nginx/009639" },
  { name: "Ollama", icon: "https://cdn.simpleicons.org/ollama/000000" },
  { name: "Electron", icon: "https://cdn.simpleicons.org/electron/9feaf5" },
];

const tools = [
  { name: "Linux Mint", icon: "https://cdn.simpleicons.org/linuxmint/87cf3e" },
  { name: "Git", icon: "https://cdn.simpleicons.org/git/f05032" },
  { name: "Notion", icon: "https://cdn.simpleicons.org/notion/000000" },
  { name: "Jira", icon: "https://cdn.simpleicons.org/jira/0052cc" },
];

const services = [
  { name: "Web Development" },
  { name: "Desktop Apps" },
  { name: "Server Deployment" },
  { name: "Parsers" },
  { name: "API Integration" },
  { name: "SEO Optimization" },
  { name: "Security Consulting" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "uk", name: "Українська" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "pt", name: "Português" },
];

const About = () => {
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
    <div className={styles.about}>
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

        <Hero title={t.title}
        subtitle={t.intro} />
        
      </motion.section>

      <motion.section
        className={styles.skills}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className={styles.subtitle}>{t.skills}</h2>
        <div className={styles.skillsGrid}>
          {skills.map((skill) => (
            <motion.div
              key={skill.name}
              className={styles.skillItem}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <img
                src={skill.icon}
                alt={`${skill.name} icon`}
                className={styles.skillIcon}
              />
              <span>{t.skillNames[skill.name]}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className={styles.tools}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className={styles.subtitle}>{t.tools}</h2>
        <div className={styles.toolsGrid}>
          {tools.map((tool) => (
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
        className={styles.services}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className={styles.subtitle}>{t.services}</h2>
        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <motion.div
              key={service.name}
              className={styles.serviceItem}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <span>{t.serviceNames[service.name]}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className={styles.projects}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className={styles.subtitle}>{t.projects}</h2>
        <ul className={styles.projectList}>
          {t.projectItems.map((item, index) => (
            <motion.li
              key={index}
              className={styles.projectItem}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ul>
      </motion.section>

      <motion.section
        className={styles.philosophy}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className={styles.subtitle}>{t.philosophy}</h2>
        <p className={styles.text}>{t.philosophyText}</p>
      </motion.section>
    </div>
  );
};

export default About;