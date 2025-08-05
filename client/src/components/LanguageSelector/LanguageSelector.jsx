import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import useLocalization from '../../hooks/useLocalization';
import styles from './LanguageSelector.module.css';

const LanguageSelector = () => {
  const { t, setLanguage, getCurrentLanguage, getSupportedLanguages } = useLocalization();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = getCurrentLanguage();
  const supportedLanguages = getSupportedLanguages();

  // Закрытие дропдауна при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Закрытие дропдауна при смене страницы
  useEffect(() => {
    setIsOpen(false);
  }, [window.location.pathname]);

  const handleLanguageSelect = (languageCode) => {
    setLanguage(languageCode);
    setIsOpen(false);
  };

  const currentLangData = supportedLanguages.find(lang => lang.code === currentLanguage);

  return (
    <div className={styles.languageSelector} ref={dropdownRef}>
      <button
        className={`${styles.languageButton} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('openMenu')}
        onTouchStart={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = '';
        }}
      >
        <Globe size={16} className={styles.globeIcon} />
        <span className={styles.languageFlag}>{currentLangData?.flag || '🌐'}</span>
        <span className={styles.languageCode}>{currentLanguage.toUpperCase()}</span>
        <ChevronDown 
          size={14} 
          className={`${styles.dropdownIcon} ${isOpen ? styles.rotated : ''}`} 
        />
      </button>

      {isOpen && (
        <div className={styles.dropdownContent}>
          {supportedLanguages.map((language) => (
            <button
              key={language.code}
              className={`${styles.languageOption} ${
                language.code === currentLanguage ? styles.active : ''
              }`}
              onClick={() => handleLanguageSelect(language.code)}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = '';
              }}
            >
              <span className={styles.optionFlag}>{language.flag}</span>
              <span className={styles.optionName}>{language.name}</span>
              {language.code === currentLanguage && (
                <span className={styles.checkmark}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 