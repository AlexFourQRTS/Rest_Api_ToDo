import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { routes } from "../routes";
import "../style.css"; // Импортируем файл стилей

const NavBar = ({ token, role, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogoutClick = () => {
    onLogout();
    navigate(routes.home);
  };

  const isActive = (path) => {
    return currentPath === path ? "active" : "";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-menu">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to={routes.home} className={`nav-link ${isActive(routes.home)}`}>
                Panda
              </Link>
            </li>

            {/* Ссылки, которые будут видны всегда */}
            <li className="nav-item">
              <Link to={routes.files} className={`nav-link ${isActive(routes.files)}`}>
                Файлы
              </Link>
            </li>

            <li className="nav-item">
              <Link to={routes.videos} className={`nav-link ${isActive(routes.videos)}`}>
                Видео
              </Link>
            </li>

            <li className="nav-item">
              <Link to={routes.music} className={`nav-link ${isActive(routes.music)}`}>
                Музыка
              </Link>
            </li>

            <li className="nav-item">
              <Link to={routes.chat} className={`nav-link ${isActive(routes.chat)}`}>
                Чат
              </Link>
            </li>

            <li className="nav-item">
              <Link to={routes.profile} className={`nav-link ${isActive(routes.profile)}`}>
                Личный кабинет
              </Link>
            </li>

            <li className="nav-item">
              <Link to={routes.settings} className={`nav-link ${isActive(routes.settings)}`}>
                Настройки
              </Link>
            </li>

            <li className="nav-item">
              <Link to={routes.notifications} className={`nav-link ${isActive(routes.notifications)}`}>
                Уведомления
              </Link>
            </li>

            <li className="nav-item">
              <Link to={routes.help} className={`nav-link ${isActive(routes.help)}`}>
                Помощь
              </Link>
            </li>

            <li className="nav-item">
              <Link to={routes.blog} className={`nav-link ${isActive(routes.blog)}`}>
                Блог
              </Link>
            </li>

            <li className="nav-item">
              <Link to={routes.news} className={`nav-link ${isActive(routes.news)}`}>
                Новости
              </Link>
            </li>

            <li className="nav-item">
              <Link to={routes.friends} className={`nav-link ${isActive(routes.friends)}`}>
                Друзья
              </Link>
            </li>

            <li className="nav-item">
              <Link to={routes.messages} className={`nav-link ${isActive(routes.messages)}`}>
                Сообщения
              </Link>
            </li>

            {token ? (
              <>
                {/* Admin */}
                {role === "admin" && (
                  <li className="nav-item">
                    <Link to={routes.admin} className={`nav-link ${isActive(routes.admin)}`}>
                      Админ
                    </Link>
                  </li>
                  
                )}
                {/* User */}
                {role === "user" && (
                  <li className="nav-item">
                    <Link to={routes.user} className={`nav-link ${isActive(routes.user)}`}>
                      Пользователь
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button onClick={handleLogoutClick} className="logout-button">
                    Выйти
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to={routes.register} className={`nav-link ${isActive(routes.register)}`}>
                  Регистрация
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;