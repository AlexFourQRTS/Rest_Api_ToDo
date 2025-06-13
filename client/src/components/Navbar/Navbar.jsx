import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import * as feather from "feather-icons";
import styles from "./Navbar.module.css";
import Button from "../UI/Button/Button";
import Sidebar from "../Sidebar/Sidebar";
import { Menu, X } from "lucide-react";
import { routes } from "../../routes";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    feather.replace();
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const NavLink = ({ to, label, icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`${styles.navLink} ${isActive ? styles.active : ""}`}
      >
        {icon && <i data-feather={icon} className={styles.navIcon}></i>}
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.navBrand}>
          <li>
            <Link to="/" className={styles.navLink}>
              <h1>🐼 Панда</h1>
            </Link>
          </li>
          <span>Хаб Розробника</span>
        </div>

        {/* Бургер-кнопка і Sidebar тільки на мобільних/планшетах */}
        {isMobile && (
          <>
            <div className={styles.menuButton}>
              <Button 
                onClick={toggleSidebar} 
                className={styles.menuButton}
                aria-label={isOpen ? "Закрити меню" : "Відкрити меню"}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
            <Sidebar 
              isSidebarOpen={isOpen} 
              closeSidebar={() => setIsOpen(false)} 
            />
          </>
        )}

        {/* Меню на десктопі */}
        {!isMobile && (
          <ul className={styles.navMenu}>
            <li className={styles.navItem}>
              <NavLink to={routes.news} label="Новини" icon="briefcase" />
            </li>
            <li className={styles.navItem}>
              <NavLink to={routes.portfolio} label="Портфоліо" icon="folder" />
            </li>
            <li className={styles.navItem}>
              <NavLink to={routes.chat} label="Чат" icon="message-circle" />
            </li>
            <li className={styles.navItem}>
              <NavLink to={routes.skills} label="Навички" icon="code" />
            </li>
            <li className={styles.navItem}>
              <NavLink to={routes.blog} label="Блог" icon="book-open" />
            </li>
            <li className={styles.navItem}>
              <NavLink to={routes.filecloud} label="Файли" icon="cloud" />
            </li>
            <li className={styles.navItem}>
              <NavLink to={routes.about} label="Про мене" icon="user" />
            </li>
            <li className={styles.navItem}>
              <NavLink to={routes.faq} label="FAQ" icon="help-circle" />
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;