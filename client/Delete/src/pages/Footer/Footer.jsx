import React from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";
import styles from "./Footer.module.css";

export default function FooterPage() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: "https://github.com/AlexFourQRTS", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" }
  ];

  const quickLinks = [
    { name: "News", href: "/news" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Chat", href: "/chat" },
    { name: "Skills", href: "/skills" },
    { name: "Blog", href: "/blog" },
    { name: "FileCloud", href: "/filecloud" },
    { name: "About Me", href: "/about" },
    { name: "FAQ", href: "/faq" }
  ];

  const services = [
    "Web Development",
    "React Applications",
    "UI/UX Design",
    "API Development",
    "Database Solutions",
    "Cloud Services"
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__gradient} />
      <div className={styles.footer__gradientPrimary} />
      <div className={styles.footer__container}>
        <div className={styles.footer__grid}>
          <div className={styles.footer__company}>
            <h3 className={styles.footer__companyTitle}>
              <span className={styles.footer__companyTitleGradient}>🐼 Panda</span> Developer Hub
            </h3>
            <p className={styles.footer__companyDescription}>
              Creating modern web applications and solutions with cutting-edge technologies and best practices.
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
            <h3 className={styles.footer__navigationTitle}>Navigation</h3>
            <ul className={styles.footer__navigationList}>
              {quickLinks.map((link, index) => (
                <li key={index} className={styles.footer__navigationItem}>
                  <a href={link.href} className={styles.footer__navigationLink}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.footer__services}>
            <h3 className={styles.footer__servicesTitle}>Services</h3>
            <ul className={styles.footer__servicesList}>
              {services.map((service, index) => (
                <li key={index} className={styles.footer__servicesItem}>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.footer__contact}>
            <h3 className={styles.footer__contactTitle}>Contact</h3>
            <div className={styles.footer__contactInfo}>
              <div className={styles.footer__contactItem}>
                <Mail size={18} className={styles.footer__contactIcon} />
                <span className={styles.footer__contactText}>xvergox@gmail.com</span>
              </div>
              <div className={styles.footer__contactItem}>
                <Phone size={18} className={styles.footer__contactIcon} />
                <span className={styles.footer__contactText}>095 468 96 56</span>
              </div>
              <div className={styles.footer__contactItem}>
                <MapPin size={18} className={styles.footer__contactIcon} />
                <span className={styles.footer__contactText}>Odesa, Ukraine</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer__divider}>
          <div className={styles.footer__bottom}>
            <p className={styles.footer__copyright}>
              © {currentYear} <span className={styles.footer__copyrightName}>Alexander Malyuk</span>. All rights reserved.
            </p>
            <div className={styles.footer__legalLinks}>
              <a href="#" className={styles.footer__legalLink}>
                Privacy Policy
              </a>
              <a href="#" className={styles.footer__legalLink}>
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}