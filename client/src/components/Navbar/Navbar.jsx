import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import * as feather from "feather-icons";
import styles from "./Navbar.module.css";
import Button from "../UI/Button/Button";
import Sidebar from "../Sidebar/Sidebar";
import { Menu, X, ChevronDown } from "lucide-react";
import { routes } from "../../routes";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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

  const DropdownMenu = () => {
    const dropdownItems = [
      { to: routes.about, label: "Про мене", icon: "user" },
      { to: routes.portfolio, label: "Портфоліо", icon: "folder" },
      { to: routes.skills, label: "Навички", icon: "code" },
      { to: routes.whyus, label: "Сервіси", icon: "briefcase" },
      { to: routes.news, label: "Новини", icon: "briefcase" }
    ];

    return (
      <div className={styles.dropdown}>
        <button 
          className={`${styles.dropdownButton} ${isDropdownOpen ? styles.active : ""}`}
          onClick={toggleDropdown}
        >
          <span>Про мене</span>
          <ChevronDown size={16} className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.rotated : ""}`} />
        </button>
        {isDropdownOpen && (
          <div className={styles.dropdownContent}>
            {dropdownItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </div>
        )}
      </div>
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
              <DropdownMenu />
            </li>
            <li className={styles.navItem}>
              <NavLink to={routes.chat} label="Чат" icon="message-circle" />
            </li>
            <li className={styles.navItem}>
              <NavLink to={routes.blog} label="Блог" icon="book-open" />
            </li>
            <li className={styles.navItem}>
              <NavLink to={routes.filecloud} label="Файли" icon="cloud" />
            </li>
            <li className={styles.navItem}>
              <NavLink to={routes.faq} label="FAQ" icon="help-circle" />
            </li>
            <li className={styles.navItem}>
              <NavLink to={routes.profile} label="Мій Профіль" icon="user" />
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;