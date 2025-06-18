import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { routes } from "./routes";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { ToastProvider } from "./context/ToastContext";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import News from "./pages/News/News";
import Portfolio from "./pages/Portfolio/Portfolio";
import WhyUs from "./pages/WhyUs/WhyUs";
import Skills from "./pages/Skills/Skills";
import Blog from "./pages/Blog/Blog";
import Profile from "./pages/Profile/Profile";

import { FileCloud } from "./pages/FileCloud/FileCloud";
import FileDetail from "./pages/FileCloud/components/FileDetail/FileDetail";

import FAQ from "./pages/FQA/FAQ";

import FooterPage from "./pages/Footer/Footer";

import {NotFoundPage} from "./pages/NotFoundPage/NotFoundPage";

import styles from "./App.module.css";
import './utils/activityLogger';
import { logActivity } from './utils/activityLogger';

// Компонент для логирования изменений маршрута
const RouteChangeLogger = () => {
  const location = useLocation();

  useEffect(() => {
    logActivity('route_change', { path: location.pathname });
  }, [location]);

  return null;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <BrowserRouter>
      <ToastProvider>
        <div className={styles.app}>
          <Navbar onMenuClick={toggleSidebar} />
          <div className={styles.container}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className={styles.content}>
              <div className={styles.content__wrapper}>
                <RouteChangeLogger />
                <Routes>
                  <Route path={routes.home} element={<Home />} />
                  <Route path={routes.about} element={<About />} />
                  <Route path={routes.news} element={<News />} />
                  <Route path={routes.portfolio} element={<Portfolio />} />
                  <Route path={routes.whyus} element={<WhyUs />} />
                  <Route path={routes.skills} element={<Skills />} />
                  <Route path={routes.blog} element={<Blog />} />
                  <Route path={routes.filecloud} element={<FileCloud />} />
                  <Route path={routes.fileDetail} element={<FileDetail />} />
                  <Route path={routes.faq} element={<FAQ />} />
                  <Route path={routes.profile} element={<Profile />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
            </main>
          </div>
          <FooterPage />
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;