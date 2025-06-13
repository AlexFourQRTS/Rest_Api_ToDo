import React from "react";
import { Link } from "react-router-dom";
import { routes } from "../../../../routes";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const menuItems = [
    {
      icon: "user",
      title: "Моя сторінка",
      path: routes.profile,
    },
    {
      icon: "message-circle",
      title: "Повідомлення",
      path: routes.chat,
    },
    {
      icon: "users",
      title: "Друзі",
      path: "/friends",
    },
    {
      icon: "image",
      title: "Фотографії",
      path: "/photos",
    },
    {
      icon: "music",
      title: "Музика",
      path: "/music",
    },
    {
      icon: "video",
      title: "Відео",
      path: "/videos",
    },
    {
      icon: "file",
      title: "Файли",
      path: routes.filecloud,
    },
    {
      icon: "bookmark",
      title: "Збережені матеріали",
      path: "/saved",
    },
    {
      icon: "settings",
      title: "Налаштування",
      path: "/settings",
    },
  ];

  return (
    <div className={styles.sidebar}>
      <nav className={styles.nav}>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={styles.navItem}
            activeClassName={styles.active}
          >
            <i data-feather={item.icon} className={styles.icon}></i>
            <span className={styles.title}>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 