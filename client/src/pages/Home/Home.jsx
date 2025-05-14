import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import translations from "./homeTranslations.json";
import styles from "./Home.module.css";
import * as feather from "feather-icons";

const languages = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "uk", name: "Українська" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "pt", name: "Português" },
];

const routesInfo = [

  {
    path: "/about",
    id: "about",
    title: "about_title",
    description: "about_description",
    
  },
  {
    path: "/services",
    id: "services",
    title: "services_title",
    description: "services_description",
    
  },
  {
    path: "/portfolio",
    id: "portfolio",
    title: "portfolio_title",
    description: "portfolio_description",
    
  },
  {
    path: "/whyus",
    id: "whyus",
    title: "whyus_title",
    description: "whyus_description",
    
  },
  {
    path: "/skills",
    id: "skills",
    title: "skills_title",
    description: "skills_description",
    
  },
  {
    path: "/contact",
    id: "contact",
    title: "contact_title",
    description: "contact_description",
    
  },
  {
    path: "/faq",
    id: "faq",
    title: "faq_title",
    description: "faq_description",
    
  },
];

const Home = () => {
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

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 1, ease: "easeInOut" } },
  };

  const textVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 1.2 } },
  };

  const personVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 1.5 } },
  };

  return (
    <div className={styles.home}>
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
        <div className={styles.routes}>
          {routesInfo.map((route, index) => (
            <motion.div
              key={route.id}
              className={styles.routeCard}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              {/* <img
                src={`https://cdn.simpleicons.org/${route.icon}`}
                alt={route.id}
                className={styles.routeIcon}
              /> */}
              <h2 className={styles.routeTitle}>{t[route.title]}</h2>
              <p className={styles.routeDescription}>{t[route.description]}</p>
              <Link to={route.path} className={styles.routeLink}>
                {t.explore}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.animationSection}
          initial="hidden"
          animate="visible"
        >
          <svg
            className={styles.houseSvg}
            viewBox="0 0 200 150"
            fill="none"
            stroke="#e18145"
            strokeWidth="3"
          >
            {/* Roof */}
            <motion.path
              d="M50 80 L100 30 L150 80"
              variants={pathVariants}
            />
            {/* Walls */}
            <motion.path
              d="M50 80 L50 120 L150 120 L150 80"
              variants={pathVariants}
              transition={{ delay: 0.3 }}
            />
            {/* Door */}
            <motion.path
              d="M90 120 L90 90 L110 90 L110 120"
              variants={pathVariants}
              transition={{ delay: 0.6 }}
            />
          </svg>
          <motion.h2
            className={styles.pandaText}
            variants={textVariants}
          >
            Panda
          </motion.h2>
          <motion.div
            className={styles.personSvg}
            variants={personVariants}
          >
            <svg viewBox="0 0 50 50" fill="none" stroke="#333333" strokeWidth="2">
              {/* Head */}
              <circle cx="25" cy="15" r="5" fill="#e18145" />
              {/* Body */}
              <path d="M25 20 L25 35" />
              {/* Arm pointing */}
              <path d="M25 25 L35 30" />
              {/* Legs */}
              <path d="M25 35 L20 45 M25 35 L30 45" />
            </svg>
          </motion.div>
          <motion.p
            className={styles.buildText}
            variants={textVariants}
            transition={{ delay: 1.8 }}
          >
            {t.build_message}
          </motion.p>
        </motion.div>
      </motion.section>

    </div>
  );
};

export default Home;