import React from "react";
import { FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import styles from "./Footer.module.css";

const FooterPage = ({ isSidebarOpen }) => {
  return (
    <footer className={`${styles.footer} ${isSidebarOpen ? styles["footer--hidden"] : ""}`}>
      <div className={styles.footer__container}>
        <div className={styles.footer__section}>
          <h4 className={styles.footer__title}>Контактная информация</h4>
          <hr className={styles.hr} />
          <p>
            <FaPhone className={styles.footer__icon} /> +38 (099) 123-45-67
          </p>
          <p>
            <FaEnvelope className={styles.footer__icon} /> xvergox@gmail.com
          </p>
          <p>Одесса, Украина</p>
        </div>

        <div className={styles.footer__section}>
          <h4 className={styles.footer__title}>Информация</h4>
          <hr className={styles.hr} />
          <ul className={styles.footer__list}>
            <li>
              <a href="#" className={styles.footer__link}>
                О нас
              </a>
            </li>
            <li>
              <a href="#" className={styles.footer__link}>
                Условия использования
              </a>
            </li>
            <li>
              <a href="#" className={styles.footer__link}>
                Политика конфиденциальности
              </a>
            </li>
          </ul>
        </div>

        
       
      </div>

      {/* <hr className={styles.hr} /> */}
      <div className={styles.footer__bottom}>
        <p>
          <a href="https://skydishch.fun" className={styles.footer__brand}>
            Skydishch.fun
          </a>
        </p>
        <p>© {new Date().getFullYear()} Все права защищены.</p>
      </div>
    </footer>
  );
};

export default FooterPage;