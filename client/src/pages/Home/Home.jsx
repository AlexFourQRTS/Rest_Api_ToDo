import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import translations from "./homeTranslations.json";
import styles from "./Home.module.css";
import * as feather from "feather-icons";
import Hero from "../../components/UI/Hero/Hero";

const languages = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "uk", name: "Українська" },
];

const routesInfo = [
  {
    path: "/skills",
    title: "skills_title",
    description: "skills_description",
    iconKey: "skills_icon",
  },
  {
    path: "/filecloud",
    title: "filecloud",
    description: "filecloud_description",
    iconKey: "filecloud_icon",
  },
  {
    path: "/games",
    title: "emul_page",
    description: "emul_page_description",
    iconKey: "emul_icon",
  },
  {
    path: "/alavar",
    title: "alavar_page",
    description: "alavar_page_description",
    iconKey: "alavar_icon",
  },
  {
    path: "/programs",
    title: "programm_page",
    description: "programm_page_description",
    iconKey: "programm_icon",
  },
  {
    path: "/forum",
    title: "forum_page",
    description: "forum_page_description",
    iconKey: "forum_icon",
  },
  {
    path: "/blog",
    title: "blog_page",
    description: "blog_description",
    iconKey: "blog_icon",
  },
  {
    path: "/:pathMatch(.*)*",
    title: "err_page",
    description: "err_page_description",
    iconKey: "err_icon",
  },
];

const Home = () => {
  const [language, setLanguage] = useState("en");
  const t = translations[language];

  useEffect(() => {
    feather.replace();
  }, [language]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const textVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 1.2 } },
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
        <Hero title={t.title} subtitle={t.intro} />

        <div className={styles.routes}>
          {routesInfo.map((route) => (
            <motion.div
              key={route.path}
              className={styles.routeCard}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ scale: 1.03 }}
            >


              {t[route.iconKey] && (
                <div
                  className={styles.routeIcon}
                  dangerouslySetInnerHTML={{
                    __html: feather.icons[t[route.iconKey]].toSvg({
                      strokeWidth: 2,
                      width: 40,
                      height: 40,
                    }),
                  }}
                />
              )}
              <h2 className={styles.routeTitle}>
                <p className={styles.routeDescription}>{t[route.description]}</p>
              </h2>

              <Link to={route.path} className={styles.routeLink}>
                {t[route.title]}
              </Link>
            </motion.div>
          ))}
        </div>

      </motion.section>
    </div>
  );
};

export default Home;