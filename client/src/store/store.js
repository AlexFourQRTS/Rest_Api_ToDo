import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './slices/languageSlice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

