import React, { useState, useEffect, useRef } from "react";
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
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const location = useLocation();
  const aboutDropdownRef = useRef(null);
  const toolsDropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target)) {
        setIsAboutDropdownOpen(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target)) {
        setIsToolsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsAboutDropdownOpen(false);
    setIsToolsDropdownOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleAboutDropdown = () => {
    setIsAboutDropdownOpen(!isAboutDropdownOpen);
    if (isToolsDropdownOpen) setIsToolsDropdownOpen(false);
  };

  const toggleToolsDropdown = () => {
    setIsToolsDropdownOpen(!isToolsDropdownOpen);
    if (isAboutDropdownOpen) setIsAboutDropdownOpen(false);
  };

  const NavLink = ({ to, label, icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`${styles.navLink} ${isActive ? styles.active : ""}`}
        onClick={() => {
          setIsAboutDropdownOpen(false);
          setIsToolsDropdownOpen(false);
        }}
      >
        {icon && <i data-feather={icon} className={styles.navIcon}></i>}
        <span>{label}</span>
      </Link>
    );
  };

  const AboutDropdownMenu = () => {
    const dropdownItems = [
      { to: routes.about, label: "Про мене", icon: "user" },
      { to: routes.portfolio, label: "Портфоліо", icon: "folder" },
      { to: routes.skills, label: "Навички", icon: "code" },
      { to: routes.whyus, label: "Сервіси", icon: "briefcase" },
      { to: routes.news, label: "Новини", icon: "briefcase" }
    ];

    return (
      <div className={styles.dropdown} ref={aboutDropdownRef}>
        <button 
          className={`${styles.dropdownButton} ${isAboutDropdownOpen ? styles.active : ""}`}
          onClick={toggleAboutDropdown}
        >
          <span>Про мене</span>
          <ChevronDown size={16} className={`${styles.dropdownIcon} ${isAboutDropdownOpen ? styles.rotated : ""}`} />
        </button>
        {isAboutDropdownOpen && (
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

  const ToolsDropdownMenu = () => {
    const dropdownItems = [
      { to: routes.camera, label: "Камера", icon: "camera" },
      { to: routes.microphone, label: "Микрофон", icon: "mic" },
      { to: routes.converter, label: "Конвертор", icon: "refresh-cw" },
      { to: routes.ip, label: "Ваш IP", icon: "globe" },
      { to: routes.tone_generator, label: "Тон-генератор", icon: "bar-chart-2" },
      { to: routes.paint, label: "Paint", icon: "edit-3" }
    ];

    return (
      <div className={styles.dropdown} ref={toolsDropdownRef}>
        <button 
          className={`${styles.dropdownButton} ${isToolsDropdownOpen ? styles.active : ""}`}
          onClick={toggleToolsDropdown}
        >
          <span>Інструменти</span>
          <ChevronDown size={16} className={`${styles.dropdownIcon} ${isToolsDropdownOpen ? styles.rotated : ""}`} />
        </button>
        {isToolsDropdownOpen && (
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

        {!isMobile && (
          <ul className={styles.navMenu}>
            <li className={styles.navItem}>
              <AboutDropdownMenu />
            </li>
            <li className={styles.navItem}>
              <ToolsDropdownMenu />
            </li>
            <li className={styles.navItem}>
              <NavLink to={routes.chat} label="Чат" icon="message-circle" />
            </li>
            <li className={styles.navItem}>
              <NavLink to={routes.games} label="Ігри" icon="play" />
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