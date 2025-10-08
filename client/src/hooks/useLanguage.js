import { useDispatch, useSelector } from 'react-redux';
import { 
  setLanguage as setLanguageAction, 
  selectCurrentLanguage,
  selectSupportedLanguages,
  selectIsInitialized 
} from '../store/slices/languageSlice';

/**
 * Хук для работы с языком приложения через Redux
 * Заменяет локальное состояние языка на глобальное
 */
export const useLanguage = () => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);
  const supportedLanguages = useSelector(selectSupportedLanguages);
  const isInitialized = useSelector(selectIsInitialized);

  const setLanguage = (languageCode) => {
    dispatch(setLanguageAction(languageCode));
  };

  return {
    currentLanguage,
    setLanguage,
    supportedLanguages,
    isInitialized,
  };
};

export default useLanguage;

