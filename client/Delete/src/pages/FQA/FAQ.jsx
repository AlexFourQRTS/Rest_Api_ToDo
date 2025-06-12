import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import translations from "./faqTranslations.json";
import styles from "./FAQ.module.css";

 import Hero from "../../components/UI/Hero/Hero";

const languages = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "uk", name: "Українська" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "pt", name: "Português" },
];

const faqItems = [
  { id: "design_tools", question: "design_tools_question", answer: "design_tools_answer" },
  { id: "ui_ux", question: "ui_ux_question", answer: "ui_ux_answer" },
  { id: "markup", question: "markup_question", answer: "markup_answer" },
  { id: "frontend", question: "frontend_question", answer: "frontend_answer" },
  { id: "backend", question: "backend_question", answer: "backend_answer" },
  { id: "databases", question: "databases_question", answer: "databases_answer" },
  { id: "websockets", question: "websockets_question", answer: "websockets_answer" },
  { id: "devops", question: "devops_question", answer: "devops_answer" },
  { id: "testing", question: "testing_question", answer: "testing_answer" },
  { id: "scrapers", question: "scrapers_question", answer: "scrapers_answer" },
  { id: "api", question: "api_question", answer: "api_answer" },
  { id: "desktop_apps", question: "desktop_apps_question", answer: "desktop_apps_answer" },
  { id: "ai_ml", question: "ai_ml_question", answer: "ai_ml_answer" },
  { id: "other_tech", question: "other_tech_question", answer: "other_tech_answer" },
];

const FAQ = () => {
  const [language, setLanguage] = useState("en");
  const [openAccordion, setOpenAccordion] = useState(null);
  const t = translations[language];

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const accordionVariants = {
    closed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  };

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id? null : id);
  };

  return (
    <div className={styles.faq}>
     
     <Hero title={t.title}
     subtitle={t.intro}/>
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
        
        <div className={styles.accordion}>
          {faqItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={styles.accordionItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div>
                <motion.div
                  className={styles.accordionHeader}
                  onClick={() => toggleAccordion(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{t[item.question]}</span>
                  <span>{openAccordion === item.id? "−" : "+"}</span>
                </motion.div>

                <AnimatePresence>
                  {openAccordion === item.id && (
                    <motion.div
                      className={styles.accordionContent}
                      variants={accordionVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <p>{t[item.answer]}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default FAQ;