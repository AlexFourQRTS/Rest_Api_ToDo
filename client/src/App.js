import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { routes } from "./routes";
import * as feather from "feather-icons";

import Home from "./pages/Home/Home";
import AuthPage from "./pages/AuthPage/AuthPage";
import RegisterPage from "./pages/Register/Register";
import UserPage from "./pages/User/UserPage";
import AdminPage from "./pages/Admin/AdminPage";

import About from "./pages/About/About";
import Services from "./pages/Services/Services";
import Portfolio from "./pages/Portfolio/Portfolio";
import WhyUs from "./pages/WhyUs/WhyUs";
import Skills from "./pages/Skills/Skills";
import Testimonials from "./pages/Testimonials/Testimonials";
import Contact from "./pages/Contact/Contact";
import FAQ from "./pages/FQA/FAQ";
import FooterPage from "./pages/Footer/Footer";

import styles from "./styles/App.module.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    feather.replace();
  }, [isSidebarOpen]);

  const updateAuth = (newToken, newRole) => {
    setToken(newToken);
    setRole(newRole);
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <nav className={styles.navbar}>
          <div className={styles.navbar__toggle} onClick={toggleSidebar}>
            {isSidebarOpen ? "X" : "☰"}
          </div>
          <div className={styles.navbar__brand}>
            <Link to={routes.home} className={styles.navbar__brand_link}>
              Panda
            </Link>
          </div>
          {/* <div className={styles.navbar__links}>
            <SidebarLink
              to={routes.home}
              label="Главная"
              icon="home"
              closeSidebar={() => setIsSidebarOpen(false)}
            />
          </div> */}
        </nav>

        <div className={styles.app__main}>
          <aside
            className={`${styles.sidebar} ${
              isSidebarOpen ? styles["sidebar--open"] : styles["sidebar--closed"]
            }`}
          >
            <nav className={styles.sidebar__nav}>
              <ul className={styles.sidebar__list}>
                <li className={styles.sidebar__item}>
                  <SidebarLink
                    to={routes.about}
                    label="About Me"
                    icon="user"
                    closeSidebar={() => setIsSidebarOpen(false)}
                  />
                </li>
                <li className={styles.sidebar__item}>
                  <SidebarLink
                    to={routes.services}
                    label="Services"
                    icon="briefcase"
                    closeSidebar={() => setIsSidebarOpen(false)}
                  />
                </li>
                <li className={styles.sidebar__item}>
                  <SidebarLink
                    to={routes.portfolio}
                    label="Portfolio"
                    icon="folder"
                    closeSidebar={() => setIsSidebarOpen(false)}
                  />
                </li>
                <li className={styles.sidebar__item}>
                  <SidebarLink
                    to={routes.whyus}
                    label="Why Choose Us"
                    icon="check-circle"
                    closeSidebar={() => setIsSidebarOpen(false)}
                  />
                </li>

                <li className={styles.sidebar__item}>
                  <SidebarLink
                    to={routes.skills}
                    label="Skills"
                    icon="code"
                    closeSidebar={() => setIsSidebarOpen(false)}
                  />
                </li>
                
                <li className={styles.sidebar__item}>
                  <SidebarLink
                    to={routes.testimonials}
                    label="Testimonials"
                    icon="file-text"
                    closeSidebar={() => setIsSidebarOpen(false)}
                  />
                </li>
                <li className={styles.sidebar__item}>
                  <SidebarLink
                    to={routes.contact}
                    label="Contact"
                    icon="phone"
                    closeSidebar={() => setIsSidebarOpen(false)}
                  />
                </li>
                <li className={styles.sidebar__item}>
                  <SidebarLink
                    to={routes.faq}
                    label="FAQ"
                    icon="edit"
                    closeSidebar={() => setIsSidebarOpen(false)}
                  />
                </li>
              </ul>
            </nav>
          </aside>

          <main
            className={`${styles.content} ${
              isSidebarOpen
                ? styles["content--sidebar-open"]
                : styles["content--sidebar-closed"]
            }`}
          >
            <div className={styles.content__wrapper}>
              <Routes>
                <Route path={routes.login} element={<AuthPage onLogin={updateAuth} />} />
                <Route path={routes.register} element={<RegisterPage />} />
                <Route path={routes.home} element={<Home />} />
                <Route path={routes.about} element={<About />} />
                <Route path={routes.services} element={<Services />} />
                <Route path={routes.portfolio} element={<Portfolio />} />
                <Route path={routes.whyus} element={<WhyUs />} />
                <Route path={routes.skills} element={<Skills />} />
                <Route path={routes.testimonials} element={<Testimonials />} />
                <Route path={routes.contact} element={<Contact />} />
                <Route path={routes.faq} element={<FAQ />} />
                <Route element={<PrivateRoute allowedRoles={["user"]} />}>
                  <Route path={routes.user} element={<UserPage />} />
                </Route>
                <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                  <Route path={routes.admin} element={<AdminPage />} />
                </Route>
              </Routes>
            </div>
          </main>
        </div>

        <FooterPage isSidebarOpen={isSidebarOpen} />
      </div>
    </BrowserRouter>
  );
}

const SidebarLink = ({ to, label, icon, closeSidebar }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`${styles.sidebar__link} ${
        isActive ? styles["sidebar__link--active"] : ""
      }`}
      onClick={closeSidebar}
    >
      {icon && <i data-feather={icon} className={styles.sidebar__icon}></i>}
      <span>{label}</span>
    </Link>
  );
};

export default App;