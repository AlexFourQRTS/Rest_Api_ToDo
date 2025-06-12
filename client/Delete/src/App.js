import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import News from "./pages/News/News";
import Portfolio from "./pages/Portfolio/Portfolio";
import WhyUs from "./pages/WhyUs/WhyUs";
import Skills from "./pages/Skills/Skills";
import Blog from "./pages/Blog/Blog";

import { FileCloud } from "./pages/FileCloud/FileCloud";

import FAQ from "./pages/FQA/FAQ";

import FooterPage from "./pages/Footer/Footer";

import {NotFoundPage} from "./pages/NotFoundPage/NotFoundPage";

import styles from "./App.module.css";

function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <BrowserRouter>
      <div className={styles.app}>

        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <div className={styles.app__main}>

          <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />

          <main
            className={`${styles.content} ${isSidebarOpen ? styles["content--sidebar-open"] : styles["content--sidebar-closed"]
              }`}
          >
            <div className={styles.content__wrapper}>
              <Routes>
                <Route path={routes.home} element={<Home />} />
                <Route path={routes.about} element={<About />} />
                <Route path={routes.news} element={<News />} />
                <Route path={routes.portfolio} element={<Portfolio />} />
                <Route path={routes.whyus} element={<WhyUs />} />
                <Route path={routes.skills} element={<Skills />} />

                <Route path={routes.blog} element={<Blog />} />

                <Route path={routes.filecloud} element={<FileCloud />} />
                <Route path={routes.faq} element={<FAQ />} />

                <Route path="*" element={<NotFoundPage />} />

              </Routes>
            </div>
          </main>
        </div>
        <FooterPage isSidebarOpen={isSidebarOpen} />
      </div>
    </BrowserRouter>
  );
}

export default App;