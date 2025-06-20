import React, { useState } from "react";
import translations from "./skillsTranslations.json";
import styles from "./Skills.module.css";
import Hero from "../../../components/UI/Hero/Hero";

const servicesIcons = [
  { name: "Parsers Development", icon: "https://cdn.simpleicons.org/puppeteer/40c4ff" },
  { name: "Mini Servers", icon: "https://cdn.simpleicons.org/nginx/009639" },
  { name: "Blog Creation", icon: "https://cdn.simpleicons.org/wordpress/21759b" },
  { name: "API Integration", icon: "https://cdn.simpleicons.org/postman/ff6c37" },
  { name: "SEO Metadata", icon: "https://cdn.simpleicons.org/googlesearchconsole/458cf7" },
  { name: "Data Processing", icon: "https://cdn.simpleicons.org/python/3776ab" },
];

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
  { name: "Puppeteer", icon: "https://cdn.simpleicons.org/puppeteer/40c4ff" },
];

const tools = [
  { name: "Linux Mint", icon: "https://cdn.simpleicons.org/linuxmint/87cf3e" },
  { name: "Git", icon: "https://cdn.simpleicons.org/git/f05032" },
  { name: "Notion", icon: "https://cdn.simpleicons.org/notion/000000" },
  { name: "Jira", icon: "https://cdn.simpleicons.org/jira/0052cc" },
];

const languages = [
  
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "pt", name: "Português" },
];

const Skills = () => {
  const [language, setLanguage] = useState("en"); // English by default
  const t = translations[language];

  return (
    <div className={styles.services}>
      <div className={styles.languageSwitcher}>
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
      </div>

      <section className={styles.intro}>
        <Hero title={t.title} />
      </section>

      <section className={styles.servicesList}>
        <h2 className={styles.sectionTitle}>{t.servicesSection}</h2>
        <div className={styles.servicesGrid}>
          {t.services.map((service, index) => (
            <div key={service.name} className={styles.serviceItem}>
              <img
                src={servicesIcons[index].icon}
                alt={`${service.name} icon`}
                className={styles.serviceIcon}
              />
              <h3 className={styles.serviceTitle}>{service.name}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.skillsList}>
        <h2 className={styles.sectionTitle}>{t.skillsSection}</h2>
        <div className={styles.servicesGrid}>
          {skills.map((skill) => (
            <div key={skill.name} className={styles.serviceItem}>
              <img
                src={skill.icon}
                alt={`${skill.name} icon`}
                className={styles.serviceIcon}
              />
              <h3 className={styles.serviceTitle}>{skill.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.toolsList}>
        <h2 className={styles.sectionTitle}>{t.toolsSection}</h2>
        <div className={styles.servicesGrid}>
          {tools.map((tool) => (
            <div key={tool.name} className={styles.serviceItem}>
              <img
                src={tool.icon}
                alt={`${tool.name} icon`}
                className={styles.serviceIcon}
              />
              <h3 className={styles.serviceTitle}>{tool.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <a href="/contact" className={styles.ctaButton}>
          {t.cta}
        </a>
      </section>
    </div>
  );
};

export default Skills;