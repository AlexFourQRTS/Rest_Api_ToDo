import { createSlice } from '@reduxjs/toolkit';
import localizationService from '../../utils/localization';


const getInitialLanguage = () => {
  return 'en';
};

const initialState = {
  currentLanguage: 'en', 
  isInitialized: true,  
  supportedLanguages: [
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ],
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {

    setLanguage: (state, action) => {
      const newLanguage = 'en'; 
      state.currentLanguage = newLanguage;
      localStorage.setItem('selectedLanguage', newLanguage);
      localizationService.setLanguage(newLanguage);
    },
    initializeLanguage: (state) => {
      state.currentLanguage = 'en';
      state.isInitialized = true;
    },
    
    setSupportedLanguages: (state, action) => {
      state.supportedLanguages = action.payload;
    },
  },
});

export const { setLanguage, initializeLanguage, setSupportedLanguages } = languageSlice.actions;

export const selectCurrentLanguage = (state) => state.language.currentLanguage;
export const selectIsInitialized = (state) => state.language.isInitialized;
export const selectSupportedLanguages = (state) => state.language.supportedLanguages;

export default languageSlice.reducer;