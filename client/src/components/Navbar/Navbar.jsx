import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import Button from "../UI/Button/Button";
import Sidebar from "../Sidebar/Sidebar";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.navBrand}>
          <li>
            <NavLink to="/" exact activeClassName={styles.active}>
              <h1>🐼 Panda</h1>
            </NavLink>
          </li>
          <span>Developer Hub</span>
        </div>

        <div className={styles.menuButton}>
          <Button 
            onClick={toggleSidebar} 
            className={styles.menuButton}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        <Sidebar 
          isSidebarOpen={isOpen} 
          closeSidebar={() => setIsOpen(false)} 
        />

        <div>
          <ul className={`${styles.navMenu} ${isOpen ? styles.active : ""}`}>
            {/* <Button>=====</Button> */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;