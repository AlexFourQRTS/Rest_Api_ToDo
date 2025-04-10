import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { routes } from "./routes";
import "./style.css";

import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./pages/User/UserPage";
import AdminPage from "./pages/Admin/AdminPage";
import FooterPage from "./pages/Footer/Footer";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const updateAuth = (newToken, newRole) => {
    setToken(newToken);
    setRole(newRole);
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-layout">
      <BrowserRouter>
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <Link to={routes.home} className="sidebar-brand">
              Panda
            </Link>
          </div>
          <nav className="sidebar-nav">
            <ul className="nav-links">
              <SidebarLink to={routes.home} label="Главная" closeSidebar={() => setIsSidebarOpen(false)} />
              {token ? (
                <>
                  {role === "admin" && (
                    <SidebarLink to={routes.admin} label="Админ" closeSidebar={() => setIsSidebarOpen(false)} />
                  )}
                  {role === "user" && (
                    <SidebarLink to={routes.user} label="Пользователь" closeSidebar={() => setIsSidebarOpen(false)} />
                  )}
                  <li className="nav-item">
                    <button className="logout-button" onClick={handleLogout}>
                      Выйти
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <SidebarLink to={routes.login} label="Авторизация" closeSidebar={() => setIsSidebarOpen(false)} />
                  <SidebarLink to={routes.register} label="Регистрация" closeSidebar={() => setIsSidebarOpen(false)} />
                </>
              )}
            </ul>
          </nav>
        </aside>

        <div className="sidebar-toggle-text" onClick={toggleSidebar}>
          {isSidebarOpen ? '' : '☰'}
        </div>

        <div className={`content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="content-wrapper">
            <Routes>
              <Route path={routes.login} element={<AuthPage onLogin={updateAuth} />} />
              <Route path={routes.register} element={<RegisterPage />} />
              <Route path={routes.home} element={<Home />} />

              <Route element={<PrivateRoute allowedRoles={['user']} />}>
                <Route path={routes.user} element={<UserPage />} />
              </Route>

              <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                <Route path={routes.admin} element={<AdminPage />} />
              </Route>
            </Routes>
          </div>
          <FooterPage />
        </div>
      </BrowserRouter>
    </div>
  );
}

const SidebarLink = ({ to, label, closeSidebar }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li className="nav-item">
      <Link
        to={to}
        className={`nav-link ${isActive ? 'active' : ''}`}
        onClick={closeSidebar}
      >
        {label}
      </Link>
    </li>
  );
};

export default App;
