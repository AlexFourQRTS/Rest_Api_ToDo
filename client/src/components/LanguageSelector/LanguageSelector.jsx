import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import useLocalization from '../../hooks/useLocalization';
import useLanguage from '../../hooks/useLanguage';
// Removed CSS module import

const LanguageSelector = () => {
  const { t } = useLocalization();
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center space-x-2 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700/50 transition-all ${
          isOpen ? 'bg-gray-700/50' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('openMenu')}
        onTouchStart={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = '';
        }}
      >
        <Globe size={16} className="text-gray-300" />
        <span className="text-lg">{currentLangData?.flag || '🌐'}</span>
        <span className="text-sm font-medium">{currentLanguage.toUpperCase()}</span>
        <ChevronDown 
          size={14} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 min-w-[200px]">
          {supportedLanguages.map((language) => (
            <button
              key={language.code}
              className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-700/50 transition-all first:rounded-t-lg last:rounded-b-lg ${
                language.code === currentLanguage ? 'bg-slate-600/20 text-gray-300' : 'text-white'
              }`}
              onClick={() => handleLanguageSelect(language.code)}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = '';
              }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm font-medium">{language.name}</span>
              </div>
              {language.code === currentLanguage && (
                <span className="text-gray-300">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 