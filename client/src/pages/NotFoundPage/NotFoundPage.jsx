import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../routes"
import styles from "./NotFoundPage.module.css";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const [easterEggContent, setEasterEggContent] = useState(null);
  const statsRef = useRef(null);


  useEffect(() => {
    console.log("404 Error Page visited:", {
      url: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });
  }, []);

  useEffect(() => {
    const floatingCodes = document.querySelectorAll(`.${styles.floatingCode}`);
    const handleMouseEnter = (e) => {
      e.target.style.color = "rgba(249, 115, 22, 0.3)";
      e.target.style.transform = "scale(1.2)";
    };
    const handleMouseLeave = (e) => {
      e.target.style.color = "rgba(249, 115, 22, 0.1)";
      e.target.style.transform = "scale(1)";
    };

    floatingCodes.forEach((code) => {
      code.addEventListener("mouseenter", handleMouseEnter);
      code.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      floatingCodes.forEach((code) => {
        code.removeEventListener("mouseenter", handleMouseEnter);
        code.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);


  const handleQuickNavClick = (e) => {
    const item = e.currentTarget;
    const ripple = document.createElement("div");
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(249, 115, 22, 0.3);
      pointer-events: none;
      transform: scale(0);
      animation: ${styles.ripple} 0.6s linear;
      width: 100px;
      height: 100px;
      left: ${e.nativeEvent.offsetX - 50}px;
      top: ${e.nativeEvent.offsetY - 50}px;
    `;
    item.appendChild(ripple);
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  };

  return (
    <main className={styles.mainContent}>
    
        <div className={styles.errorAnimation}>
          <div >
            <div className={styles.errorCode}>404</div>
            <div className={styles.errorPanda}>🐼</div>
            <div className={styles.errorGlitch}></div>
          </div>
        </div>

        <div className={styles.errorContent}>
          <h1>Oops! Страница не найдена</h1>
          <p className={styles.errorMessage}>
            Кажется, страница, которую вы ищете, заблудилась в цифровом бамбуковом лесу. Не волнуйтесь, даже лучшие разработчики иногда теряются!
          </p>

          <div className={styles.errorSuggestions}>
            <h3>Что произошло?</h3>
            <ul className={styles.errorReasons}>
              <li>URL мог быть введён неправильно</li>
              <li>Страница могла быть перемещена или удалена</li>
              <li>Вы могли перейти по устаревшей ссылке</li>
              <li>Страница ещё в разработке</li>
            </ul>
          </div>

          <div className={styles.errorActions}>
            <h3>Что можно сделать?</h3>
            <div className={styles.actionButtons}>
              <Link to={routes.home} className={`${styles.actionBtn} ${styles.primary}`}>
                <span className={styles.btnIcon}>🏠</span>
                На главную
              </Link>
              <button
                onClick={() => navigate(-1)}
                className={`${styles.actionBtn} ${styles.secondary}`}
              >
                <span className={styles.btnIcon}>⬅️</span>
                Назад
              </button>
              <Link
                to={routes.contact}
                className={`${styles.actionBtn} ${styles.secondary}`}
              >
                <span className={styles.btnIcon}>📧</span>
                Сообщить о проблеме
              </Link>
            </div>
          </div>

          <div className={styles.quickLinks}>
            <h3>Быстрая навигация</h3>
            <div className={styles.navGrid}>
              <Link
                to={routes.about}
                className={styles.quickNavItem}
                onClick={handleQuickNavClick}
              >
                <div className={styles.navIcon}>👤</div>
                <span>Обо мне</span>
              </Link>
              <Link
                to={routes.testimonials}
                className={styles.quickNavItem}
                onClick={handleQuickNavClick}
              >
                <div className={styles.navIcon}>📖</div>
                <span>Блог</span>
              </Link>
              <Link
                to={routes.portfolio}
                className={styles.quickNavItem}
                onClick={handleQuickNavClick}
              >
                <div className={styles.navIcon}>🎬</div>
                <span>Портфолио</span>
              </Link>
              <Link
                to={routes.filecloud}
                className={styles.quickNavItem}
                onClick={handleQuickNavClick}
              >
                <div className={styles.navIcon}>📊</div>
                <span>FileCloud</span>
              </Link>
              <Link
                to={routes.experiments}
                className={styles.quickNavItem}
                onClick={handleQuickNavClick}
              >
                <div className={styles.navIcon}>🧪</div>
                <span>Эксперименты</span>
              </Link>
              <Link
                to={routes.whyus}
                className={styles.quickNavItem}
                onClick={handleQuickNavClick}
              >
                <div className={styles.navIcon}>💬</div>
                <span>Чат</span>
              </Link>
            </div>
          </div>

          

          <div className={styles.easterEgg}>


          <div className={styles.floatingElements}>
            <div className={styles.floatingCode}>{`{ }`}</div>
            <div className={styles.floatingCode}>{`</>`}</div>
            <div className={styles.floatingCode}>console.log();</div>
            <div className={styles.floatingCode}>async/await</div>
            <div className={styles.floatingCode}>React.js</div>
            <div className={styles.floatingCode}>404</div>
          </div>
        </div>
      </div>
    </main>
  );
};


