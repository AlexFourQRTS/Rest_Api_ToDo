import React from 'react';
import { Monitor, Smartphone, Tablet, Globe, Wifi, Cpu } from 'lucide-react';
// Removed CSS module import

const BrowserInfo = ({ browserInfo, systemInfo, connectionInfo }) => {
  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'Mobile': return <Smartphone size={20} />;
      case 'Tablet': return <Tablet size={20} />;
      case 'Desktop': return <Monitor size={20} />;
      default: return <Monitor size={20} />;
    }
  };



  const formatTimezoneOffset = (offset) => {
    const hours = Math.abs(Math.floor(offset / 60));
    const minutes = Math.abs(offset % 60);
    const sign = offset > 0 ? '-' : '+';
    return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card p-6">
      {/* Информация о браузере */}
      <div 
        className="mb-6"
      >
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
          <Globe size={20} className="text-gray-300" />
          <span>Информация о браузере</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Браузер:</span>
            <span className="text-white">{browserInfo.name} {browserInfo.version}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Движок:</span>
            <span className="text-white">{browserInfo.engine}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">ОС:</span>
            <span className="text-white">{browserInfo.os}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Устройство:</span>
            <span className="text-white flex items-center space-x-2">
              {getDeviceIcon(browserInfo.device)}
              <span>{browserInfo.device}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Системная информация */}
      <div 
        className="mb-6"
      >
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
          <Cpu size={20} className="text-gray-300" />
          <span>Системная информация</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Платформа:</span>
            <span className="text-white">{systemInfo.platform}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Язык:</span>
            <span className="text-white">{systemInfo.language}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Процессоры:</span>
            <span className="text-white">{systemInfo.hardwareConcurrency || 'Unknown'}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Память:</span>
            <span className="text-white">
              {systemInfo.deviceMemory ? `${systemInfo.deviceMemory} GB` : 'Unknown'}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Разрешение экрана:</span>
            <span className="text-white">
              {systemInfo.screenResolution.width} × {systemInfo.screenResolution.height}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Размер окна:</span>
            <span className="text-white">
              {systemInfo.viewportSize.width} × {systemInfo.viewportSize.height}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Глубина цвета:</span>
            <span className="text-white">{systemInfo.colorDepth} bit</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Часовой пояс:</span>
            <span className="text-white">
              {systemInfo.timezone} ({formatTimezoneOffset(systemInfo.timezoneOffset)})
            </span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Touch Points:</span>
            <span className="text-white">{systemInfo.maxTouchPoints || 0}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Cookies:</span>
            <span className="text-white">
              {systemInfo.cookieEnabled ? 'Включены' : 'Отключены'}
            </span>
          </div>
        </div>
      </div>

      {/* Информация о подключении */}
      <div 
        className="mb-6"
      >
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
          <Wifi size={20} className="text-gray-300" />
          <span>Сетевое подключение</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Статус:</span>
            <span className={`text-white ${connectionInfo.onLine ? 'text-green-400' : 'text-red-400'}`}>
              {connectionInfo.onLine ? '🟢 Онлайн' : '🔴 Офлайн'}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Тип соединения:</span>
            <span className="text-white">{connectionInfo.effectiveType}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Скорость загрузки:</span>
            <span className="text-white">
              {connectionInfo.downlink !== 'unknown' ? `${connectionInfo.downlink} Mbps` : 'Unknown'}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">RTT:</span>
            <span className="text-white">
              {connectionInfo.rtt !== 'unknown' ? `${connectionInfo.rtt} ms` : 'Unknown'}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Экономия данных:</span>
            <span className="text-white">
              {connectionInfo.saveData ? 'Включена' : 'Отключена'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserInfo; 