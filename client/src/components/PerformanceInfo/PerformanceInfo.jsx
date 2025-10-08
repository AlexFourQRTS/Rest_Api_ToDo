import React from 'react';
import { Activity, HardDrive, Clock, Navigation } from 'lucide-react';
// Removed CSS module import

const PerformanceInfo = ({ performanceInfo }) => {
  if (!performanceInfo) {
    return (
      <div 
        className="card p-6"
      >
        <div className="text-center">
          <h3 className="text-red-400 text-lg font-semibold mb-2">❌ Информация недоступна</h3>
          <p className="text-gray-300">Данные о производительности не могут быть получены в этом браузере.</p>
        </div>
      </div>
    );
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString('ru-RU');
  };

  const calculateLoadTime = () => {
    if (!performanceInfo.timing) return 'N/A';
    const timing = performanceInfo.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    return `${loadTime}ms`;
  };

  const calculateDOMReadyTime = () => {
    if (!performanceInfo.timing) return 'N/A';
    const timing = performanceInfo.timing;
    const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
    return `${domReadyTime}ms`;
  };

  return (
    <div 
      className="card p-6"
    >
      {/* Информация о памяти */}
      {performanceInfo.memory && (
        <div className="mb-6">
          <h3 className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
            <HardDrive size={20} className="text-gray-300" />
            <span>Использование памяти</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Используется:</span>
              <span className="text-white">{performanceInfo.memory.usedJSHeapSize}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Всего выделено:</span>
              <span className="text-white">{performanceInfo.memory.totalJSHeapSize}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Лимит:</span>
              <span className="text-white">{performanceInfo.memory.jsHeapSizeLimit}</span>
            </div>
          </div>
        </div>
      )}

      {/* Время загрузки */}
      <div className="mb-6">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
          <Clock size={20} className="text-gray-300" />
          <span>Время загрузки</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Полная загрузка:</span>
            <span className="text-white">{calculateLoadTime()}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">DOM готов:</span>
            <span className="text-white">{calculateDOMReadyTime()}</span>
          </div>
          {performanceInfo.timing && (
            <>
              <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-300">Начало навигации:</span>
                <span className="text-white">{formatTime(performanceInfo.timing.navigationStart)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-300">DNS запрос:</span>
                <span className="text-white">
                  {performanceInfo.timing.domainLookupEnd - performanceInfo.timing.domainLookupStart}ms
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-300">Подключение:</span>
                <span className="text-white">
                  {performanceInfo.timing.connectEnd - performanceInfo.timing.connectStart}ms
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-300">Ответ сервера:</span>
                <span className="text-white">
                  {performanceInfo.timing.responseEnd - performanceInfo.timing.responseStart}ms
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Информация о навигации */}
      {performanceInfo.navigation && (
        <div className="mb-6">
          <h3 className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
            <Navigation size={20} className="text-gray-300" />
            <span>Навигация</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Тип навигации:</span>
              <span className="text-white">{performanceInfo.navigation.type}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Количество редиректов:</span>
              <span className="text-white">{performanceInfo.navigation.redirectCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Общая производительность */}
      <div className="mb-6">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
          <Activity size={20} className="text-gray-300" />
          <span>Общая производительность</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Performance API:</span>
            <span className="text-white">
              {window.performance ? '✅ Поддерживается' : '❌ Не поддерживается'}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Memory API:</span>
            <span className="text-white">
              {performanceInfo.memory ? '✅ Поддерживается' : '❌ Не поддерживается'}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Timing API:</span>
            <span className="text-white">
              {performanceInfo.timing ? '✅ Поддерживается' : '❌ Не поддерживается'}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Navigation API:</span>
            <span className="text-white">
              {performanceInfo.navigation ? '✅ Поддерживается' : '❌ Не поддерживается'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceInfo; 