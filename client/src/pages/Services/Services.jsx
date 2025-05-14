import React, { useState } from "react";
import translations from "./servicesTranslations.json";
import styles from "./Services.module.css";

const servicesIcons = [
  { name: "Web Development", icon: "https://cdn.simpleicons.org/react/61dafb" },
  { name: "Desktop Applications", icon: "https://cdn.simpleicons.org/electron/9feaf5" },
  { name: "Admin Panels", icon: "https://cdn.simpleicons.org/nestjs/e0234e" },
  { name: "Data Parsers", icon: "https://cdn.simpleicons.org/puppeteer/40c4ff" },
  { name: "Server Setup", icon: "https://cdn.simpleicons.org/nginx/009639" },
  { name: "System Administration", icon: "https://cdn.simpleicons.org/linuxmint/87cf3e" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "pt", name: "Português" },

];

const Services = () => {
  const [language, setLanguage] = useState("en"); // Русский по умолчанию
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
        <h1 className={styles.title}>{t.title}</h1>
      </section>

      <section className={styles.servicesList}>
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

          {/* <a href="/contact" className={styles.ctaButton}>
            {t.cta}
          </a> */}
        </div>




      </section>
    </div>
  );
};

export default Services;