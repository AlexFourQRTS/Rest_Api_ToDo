import { createSlice } from '@reduxjs/toolkit';
import localizationService from '../../utils/localization';

// Получаем начальный язык из localizationService или localStorage
const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage) {
    return savedLanguage;
  }
  
  const serviceLanguage = localizationService.getCurrentLanguage();
  if (serviceLanguage) {
    return serviceLanguage;
  }
  
  // Определяем язык по браузеру
  const browserLang = navigator.language.split('-')[0];
  const supportedLanguages = ['uk', 'en', 'ru'];
  return supportedLanguages.includes(browserLang) ? browserLang : 'en';
};

const initialState = {
  currentLanguage: getInitialLanguage(),
  isInitialized: false,
  supportedLanguages: [
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ],
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      const newLanguage = action.payload;
      state.currentLanguage = newLanguage;
      
      // Сохраняем в localStorage
      localStorage.setItem('selectedLanguage', newLanguage);
      
      // Синхронизируем с localizationService
      localizationService.setLanguage(newLanguage);
    },
    initializeLanguage: (state, action) => {
      if (action.payload) {
        state.currentLanguage = action.payload;
      }
      state.isInitialized = true;
    },
    setSupportedLanguages: (state, action) => {
      state.supportedLanguages = action.payload;
    },
  },
});

export const { setLanguage, initializeLanguage, setSupportedLanguages } = languageSlice.actions;

// Selectors
export const selectCurrentLanguage = (state) => state.language.currentLanguage;
export const selectIsInitialized = (state) => state.language.isInitialized;
export const selectSupportedLanguages = (state) => state.language.supportedLanguages;

export default languageSlice.reducer;

