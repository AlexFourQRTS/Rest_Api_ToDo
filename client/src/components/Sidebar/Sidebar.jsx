import React from "react";
import { Link, useLocation } from "react-router-dom";
import * as feather from "feather-icons";
import styles from "./Sidebar.module.css";
import { routes } from "../../routes";

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  const location = useLocation();

  const navLinks = [
    { to: routes.news, label: "Новини", icon: "briefcase" },
    { to: routes.portfolio, label: "Портфоліо", icon: "folder" },
    { to: routes.chat, label: "Чат", icon: "message-circle" },
    { to: routes.skills, label: "Навички", icon: "code" },
    { to: routes.blog, label: "Блог", icon: "book-open" },
    { to: routes.filecloud, label: "Файли", icon: "cloud" },
    { to: routes.about, label: "Про нас", icon: "user" },
    { to: routes.faq, label: "FAQ", icon: "help-circle" },
  ];

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

  return (
    <aside className={`${styles.sidebar} ${isSidebarOpen ? styles["sidebar--open"] : styles["sidebar--closed"]}`}>
      <nav className={styles.sidebar__nav}>
        <ul className={styles.sidebar__list}>
          {navLinks.map((link, index) => (
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
