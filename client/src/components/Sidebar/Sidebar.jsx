import React from "react";
import { Link, useLocation } from "react-router-dom";
import * as feather from "feather-icons";
import styles from "./Sidebar.module.css";
import { routes } from "../../routes";

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  const location = useLocation();

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
          <li className={styles.sidebar__item}>
            <SidebarLink to={routes.news} label="News" icon="briefcase" />
          </li>

          <li className={styles.sidebar__item}>
            <SidebarLink to={routes.portfolio} label="Portfolio" icon="folder" />
          </li>

          <li className={styles.sidebar__item}>
            <SidebarLink to={routes.chat} label="Chat" icon="message-circle" />
          </li>

          <li className={styles.sidebar__item}>
            <SidebarLink to={routes.skills} label="Skills" icon="code" />
          </li>

          <li className={styles.sidebar__item}>
            <SidebarLink to={routes.blog} label="Blog" icon="book-open" />
          </li>

          <li className={styles.sidebar__item}>
            <SidebarLink to={routes.filecloud} label="FileCloud" icon="cloud" />
          </li>

          <li className={styles.sidebar__item}>
            <SidebarLink to={routes.about} label="About Me" icon="user" />
          </li>

          <li className={styles.sidebar__item}>
            <SidebarLink to={routes.faq} label="FAQ" icon="help-circle" />
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
