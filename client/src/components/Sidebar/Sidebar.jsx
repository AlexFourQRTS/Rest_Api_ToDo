import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as feather from "feather-icons";
import styles from "./Sidebar.module.css";
import { routes } from "../../routes";
import { ChevronDown } from "lucide-react";

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  React.useEffect(() => {
    feather.replace();
  }, [isSidebarOpen]);

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

  const DropdownMenu = () => {
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
          className={`${styles.sidebar__dropdownButton} ${isDropdownOpen ? styles.active : ""}`}
          onClick={toggleDropdown}
        >
          <i data-feather="user" className={styles.sidebar__icon}></i>
          <span>Про мене</span>
          <ChevronDown size={16} className={`${styles.sidebar__dropdownIcon} ${isDropdownOpen ? styles.rotated : ""}`} />
        </button>
        {isDropdownOpen && (
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
    <aside className={`${styles.sidebar} ${isSidebarOpen ? styles["sidebar--open"] : styles["sidebar--closed"]}`}>
      <nav className={styles.sidebar__nav}>
        <ul className={styles.sidebar__list}>
          <li className={styles.sidebar__item}>
            <DropdownMenu />
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
