import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import localizationService from '../utils/localization.js';
import { 
  initializeLanguage, 
  setLanguage as setLanguageAction,
  selectCurrentLanguage, 
  selectIsInitialized 
} from '../store/slices/languageSlice';

// Хук для использования локализации в React компонентах
// Теперь синхронизирован с Redux
export const useLocalization = () => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);
  const isInitialized = useSelector(selectIsInitialized);

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
        
        // Синхронизируем с Redux
        const finalLanguage = localizationService.getCurrentLanguage();
        dispatch(initializeLanguage(finalLanguage));
      } catch (error) {
        console.warn('Failed to initialize localization:', error);
        dispatch(initializeLanguage());
      }
    };

    if (!isInitialized) {
      initializeLocalization();
    }

    // Подписываемся на изменения языка из localizationService
    const unsubscribe = localizationService.subscribe((language) => {
      // Обновления теперь идут через Redux, не нужно локальное состояние
    });

    return unsubscribe;
  }, [dispatch, isInitialized]);

  // Функция для перевода
  const t = (key, fallback = '') => {
    return localizationService.t(key, fallback);
  };

  // Функция для смены языка (теперь через Redux)
  const setLanguage = (language) => {
    // Redux обновит состояние и синхронизирует с localizationService
    // через languageSlice reducer
    dispatch(setLanguageAction(language));
  };

  // Получение текущего языка (из Redux)
  const getCurrentLanguage = () => {
    return currentLanguage;
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