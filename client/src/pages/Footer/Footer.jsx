import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, GitlabIcon, GithubIcon } from "lucide-react";
import styles from "./Footer.module.css";
import { FaLinkedin, FaTelegram } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: GithubIcon, href: "https://github.com/AlexFourQRTS", label: "GitHub" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/oleksandr-maliuk-620206225/", label: "LinkedIn" },
    { icon: FaTelegram, href: "https://t.me/BrahmaDzen", label: "Telegramm" }
  ];

  const quickLinks = [
    { name: "Головна", href: "/" },
    // { name: "Портфоліо", href: "/portfolio" },
    { name: "Обсуждение", href: "/chat" },
    { name: "Ігри", href: "/games" },
    // { name: "Навички", href: "/skills" },
    { name: "Блог", href: "/blog" },
    { name: "Файли", href: "/filecloud" },
    // { name: "Про нас", href: "/about" },
    // { name: "FAQ", href: "/faq" }
  ];

  const services = [
    // "Розробка",
    // "Консультації",
    // "Навчання"
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__gradient} />
      <div className={styles.footer__gradientPrimary} />
      <div className={styles.footer__container}>
        <div className={styles.footer__grid}>
          <div className={styles.footer__company}>
            <h3 className={styles.footer__companyTitle}>
              <div>
                <span className={styles.footer__companyTitleGradient}>DEV</span>  Hub
              </div>
              
            </h3>
            <p className={styles.footer__companyDescription}>
               
            </p>
            <div className={styles.footer__socialLinks}>
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className={styles.footer__socialLink}
                    aria-label={social.label}
                  >
                    <Icon size={18} className={styles.footer__socialLinkIcon} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className={styles.footer__navigation}>
            <h3 className={styles.footer__navigationTitle}>Навігація</h3>
            <ul className={styles.footer__navigationList}>
              {quickLinks.map((link, index) => (
                <li key={index} className={styles.footer__navigationItem}>
                  <Link to={link.href} className={styles.footer__navigationLink}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* <div className={styles.footer__services}>
            <h3 className={styles.footer__servicesTitle}>Сервіси</h3>
            <ul className={styles.footer__servicesList}>
              {services.map((service, index) => (
                <li key={index} className={styles.footer__servicesItem}>
                  <Link to={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`} className={styles.footer__servicesLink}>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          <div className={styles.footer__contact}>
            <h3 className={styles.footer__contactTitle}>Контакти</h3>
            <div className={styles.footer__contactInfo}>
              <div className={styles.footer__contactItem}>
                <Mail size={18} className={styles.footer__contactIcon} />
                <span className={styles.footer__contactText}>xvergox@gmail.com</span>
              </div>
              <div className={styles.footer__contactItem}>
                <Phone size={18} className={styles.footer__contactIcon} />
                <span className={styles.footer__contactText}>+380 95 469 96 56</span>
              </div>
               <div className={styles.footer__contactItem}>
                <Phone size={18} className={styles.footer__contactIcon} />
                <span className={styles.footer__contactText}>+380 97 556 53 71</span>
              </div>
              <div className={styles.footer__contactItem}>
                <MapPin size={18} className={styles.footer__contactIcon} />
                <span className={styles.footer__contactText}>Одесса, Україна</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer__divider}>

          <div className={styles.footer__bottom}>
            <p className={styles.footer__copyright}>
              © {currentYear} <span className={styles.footer__copyrightName}>Oleksandr Maliuk</span> Всі права захищені.
            </p>
            <div className={styles.footer__legalLinks}>
              <Link to="/privacy" className={styles.footer__legalLink}>Політика конфіденційності</Link>
              <Link to="/terms" className={styles.footer__legalLink}>Умови використання</Link>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;