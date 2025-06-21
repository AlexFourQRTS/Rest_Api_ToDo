import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import * as feather from "feather-icons";
import styles from "./Sidebar.module.css";
import { routes } from "../../routes";
import { ChevronDown } from "lucide-react";

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  const location = useLocation();
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleAboutDropdown = () => {
    setIsAboutDropdownOpen(!isAboutDropdownOpen);
    if (isToolsDropdownOpen) setIsToolsDropdownOpen(false);
  };

  const toggleToolsDropdown = () => {
    setIsToolsDropdownOpen(!isToolsDropdownOpen);
    if (isAboutDropdownOpen) setIsAboutDropdownOpen(false);
  };

  React.useEffect(() => {
    feather.replace();
  }, [isSidebarOpen]);

  // Обработчик клика вне сайдбара
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, closeSidebar]);

  const SidebarLink = ({ to, label, icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`${styles.sidebar__link} ${isActive ? styles["sidebar__link--active"] : ""}`}
        onClick={closeSidebar}
      >
        {icon && <i data-feather={icon} className={styles.sidebar__icon}></i>}
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
      <div className={styles.sidebar__dropdown}>
        <button 
          className={`${styles.sidebar__dropdownButton} ${isAboutDropdownOpen ? styles.active : ""}`}
          onClick={toggleAboutDropdown}
        >
          <i data-feather="user" className={styles.sidebar__icon}></i>
          <span>Про мене</span>
          <ChevronDown size={16} className={`${styles.sidebar__dropdownIcon} ${isAboutDropdownOpen ? styles.rotated : ""}`} />
        </button>
        {isAboutDropdownOpen && (
          <div className={styles.sidebar__dropdownContent}>
            {dropdownItems.map((item) => (
              <SidebarLink
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
      <div className={styles.sidebar__dropdown}>
        <button 
          className={`${styles.sidebar__dropdownButton} ${isToolsDropdownOpen ? styles.active : ""}`}
          onClick={toggleToolsDropdown}
        >
          <i data-feather="tool" className={styles.sidebar__icon}></i>
          <span>Інструменти</span>
          <ChevronDown size={16} className={`${styles.sidebar__dropdownIcon} ${isToolsDropdownOpen ? styles.rotated : ""}`} />
        </button>
        {isToolsDropdownOpen && (
          <div className={styles.sidebar__dropdownContent}>
            {dropdownItems.map((item) => (
              <SidebarLink
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

  const mainNavLinks = [
    { to: routes.chat, label: "Чат", icon: "message-circle" },
    { to: routes.blog, label: "Блог", icon: "book-open" },
    { to: routes.filecloud, label: "Файли", icon: "cloud" },
    { to: routes.faq, label: "FAQ", icon: "help-circle" },
    { to: routes.profile, label: "Мій Профіль", icon: "user" },
  ];

  return (
    <aside ref={sidebarRef} className={`${styles.sidebar} ${isSidebarOpen ? styles["sidebar--open"] : styles["sidebar--closed"]}`}>
      <nav className={styles.sidebar__nav}>
        <ul className={styles.sidebar__list}>
          <li className={styles.sidebar__item}>
            <AboutDropdownMenu />
          </li>
          <li className={styles.sidebar__item}>
            <ToolsDropdownMenu />
          </li>
          {mainNavLinks.map((link, index) => (
            <li key={index} className={styles.sidebar__item}>
              <SidebarLink to={link.to} label={link.label} icon={link.icon} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
