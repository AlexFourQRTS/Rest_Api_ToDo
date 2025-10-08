import React, { useEffect, useState } from 'react';
import useLocalization from '../../hooks/useLocalization';

const LocalizationProvider = ({ children }) => {
  const { isInitialized } = useLocalization();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Показываем лоадер только если локализация еще не инициализирована
    if (isInitialized) {
      // Небольшая задержка для плавного перехода
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  // Показываем лоадер пока локализация не готова
  if (showLoader || !isInitialized) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-purple-950 to-purple-900 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Загрузка...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default LocalizationProvider; 