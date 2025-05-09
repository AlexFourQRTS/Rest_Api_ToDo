import React, { useState } from "react";
import { motion } from "framer-motion";
import translations from "./portfolioTranslations.json";
import styles from "./Portfolio.module.css";

const languages = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "uk", name: "Українська" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "pt", name: "Português" },
];

const projects = [
  {
    id: "admin_panel",
    title: "admin_panel_title",
    task: "admin_panel_task",
    tech: ["React", "WebSocket", "Bootstrap", "Express", "Nginx"],
  },
  {
    id: "parser",
    title: "parser_title",
    task: "parser_task",
    tech: ["Puppeteer", "Electron", "Node.js", "MongoDB"],
  },
  {
    id: "image_server",
    title: "image_server_title",
    task: "image_server_task",
    tech: ["Node.js", "Express", "MongoDB", "Nginx"],
  },
  {
    id: "blog",
    title: "blog_title",
    task: "blog_task",
    tech: ["React", "Next.js", "PostgreSQL", "Tailwind CSS"],
  },
  {
    id: "api_integration",
    title: "api_integration_title",
    task: "api_integration_task",
    tech: ["Node.js", "Express", "React", "REST"],
  },
  {
    id: "seo_metadata",
    title: "seo_metadata_title",
    task: "seo_metadata_task",
    tech: ["Next.js", "PostgreSQL", "Node.js"],
  },
  {
    id: "desktop_app",
    title: "desktop_app_title",
    task: "desktop_app_task",
    tech: ["Electron", "React", "Node.js"],
  },
  {
    id: "site_deployment",
    title: "site_deployment_title",
    task: "site_deployment_task",
    tech: ["Docker", "Nginx", "Git", "Linux"],
  },
  {
    id: "local_llm",
    title: "local_llm_title",
    task: "local_llm_task",
    tech: ["Ollama", "Node.js", "Linux"],
  },
];

const Portfolio = () => {
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
    <div className={styles.portfolio}>
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
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.text}>{t.intro}</p>
        <div className={styles.projects}>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className={styles.projectCard}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <h2 className={styles.projectTitle}>{t[project.title]}</h2>
              <p className={styles.projectTask}>
                <strong>{t.task_label}</strong> {t[project.task]}
              </p>
              <div className={styles.techList}>
                {project.tech.map((tech) => (
                  <div key={tech} className={styles.techItem}>
                    <img
                      src={`https://cdn.simpleicons.org/${tech.toLowerCase()}`}
                      alt={tech}
                      className={styles.techIcon}
                    />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Portfolio;