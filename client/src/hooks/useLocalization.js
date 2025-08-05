import { useState, useEffect } from 'react';
import localizationService from '../utils/localization.js';

// Хук для использования локализации в React компонентах
export const useLocalization = () => {
  const [currentLanguage, setCurrentLanguage] = useState(localizationService.getCurrentLanguage());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Инициализация локализации при первом рендере
    const initializeLocalization = async () => {
      try {
        // Сначала пробуем загрузить сохраненный язык
        const savedLanguage = localizationService.loadSavedLanguage();
        
        if (!savedLanguage) {
          // Если нет сохраненного, определяем по геолокации
          await localizationService.initialize();
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.warn('Failed to initialize localization:', error);
        setIsInitialized(true);
      }
    };

    initializeLocalization();

    // Подписываемся на изменения языка
    const unsubscribe = localizationService.subscribe((language) => {
      setCurrentLanguage(language);
    });

    return unsubscribe;
  }, []);

  // Функция для перевода
  const t = (key, fallback = '') => {
    return localizationService.t(key, fallback);
  };

  // Функция для смены языка
  const setLanguage = (language) => {
    localizationService.setLanguage(language);
  };

  // Получение текущего языка
  const getCurrentLanguage = () => {
    return localizationService.getCurrentLanguage();
  };

  // Получение списка поддерживаемых языков
  const getSupportedLanguages = () => {
    return localizationService.getSupportedLanguages();
  };

  return {
    t,
    setLanguage,
    getCurrentLanguage,
    getSupportedLanguages,
    currentLanguage,
    isInitialized
  };
};

export default useLocalization; 