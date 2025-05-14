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