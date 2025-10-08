import React from 'react';
import { 
  Wifi, 
  Database, 
  Shield, 
  Smartphone, 
  Zap, 
  FileText,
  Share2,
  Bell,
  Clipboard,
  Users,
  Key,
  Eye,
  Battery,
  Bluetooth,
  Usb,
  Gamepad2,
  Presentation,
  CreditCard
} from 'lucide-react';
// Removed CSS module import

const WebAPIInfo = ({ webAPIInfo, mediaInfo, storageInfo, securityInfo, sensorsInfo }) => {
  const getIcon = (apiName) => {
    const iconMap = {
      fetch: <Wifi size={16} />,
      promises: <Zap size={16} />,
      asyncAwait: <Zap size={16} />,
      webWorkers: <Smartphone size={16} />,
      sharedWorkers: <Smartphone size={16} />,
      webSockets: <Wifi size={16} />,
      serverSentEvents: <Wifi size={16} />,
      webRTC: <Wifi size={16} />,
      pushManager: <Bell size={16} />,
      notifications: <Bell size={16} />,
      clipboard: <Clipboard size={16} />,
      share: <Share2 size={16} />,
      contacts: <Users size={16} />,
      credentials: <Key size={16} />,
      permissions: <Eye size={16} />,
      wakeLock: <Battery size={16} />,
      bluetooth: <Bluetooth size={16} />,
      usb: <Usb size={16} />,
      serial: <Usb size={16} />,
      hid: <Usb size={16} />,
      gamepad: <Gamepad2 size={16} />,
      presentation: <Presentation size={16} />,
      payment: <CreditCard size={16} />
    };
    return iconMap[apiName] || <FileText size={16} />;
  };

  const renderAPISection = (title, icon, apis, data) => {
    return (
      <div className="mb-6">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
          {icon}
          <span>{title}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apis.map(api => (
            <div key={api} className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
              <span className="flex items-center space-x-2 text-gray-300">
                {getIcon(api)}
                <span>{api}</span>
              </span>
              <span className={`text-sm font-medium ${
                data[api] ? 'text-green-400' : 'text-red-400'
              }`}>
                {data[api] ? '✅ Поддерживается' : '❌ Не поддерживается'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="card p-6"
    >
      {/* Основные Web APIs */}
      {renderAPISection(
        'Основные Web APIs',
        <Zap size={20} className="text-gray-300" />,
        ['fetch', 'promises', 'asyncAwait', 'webWorkers', 'sharedWorkers', 'webSockets', 'serverSentEvents', 'webRTC'],
        webAPIInfo
      )}

      {/* Медиа APIs */}
      {renderAPISection(
        'Медиа APIs',
        <Smartphone size={20} className="text-gray-300" />,
        ['mediaDevices', 'getUserMedia', 'mediaSession', 'mediaCapabilities', 'mediaRecorder', 'webAudio'],
        mediaInfo
      )}

      {/* Хранилище */}
      {renderAPISection(
        'Хранилище',
        <Database size={20} className="text-gray-300" />,
        ['localStorage', 'sessionStorage', 'indexedDB', 'webSQL', 'cookies', 'cacheStorage', 'serviceWorker'],
        storageInfo
      )}

      {/* Безопасность */}
      {renderAPISection(
        'Безопасность',
        <Shield size={20} className="text-gray-300" />,
        ['isSecureContext', 'origin', 'protocol', 'hostname', 'port', 'pathname', 'search', 'hash', 'referrer'],
        securityInfo
      )}

      {/* Датчики */}
      {renderAPISection(
        'Датчики',
        <Smartphone size={20} className="text-gray-300" />,
        ['accelerometer', 'gyroscope', 'magnetometer', 'absoluteOrientation', 'relativeOrientation', 'geolocation', 'vibration', 'battery', 'proximity', 'ambientLight'],
        sensorsInfo
      )}

      {/* Дополнительные APIs */}
      {renderAPISection(
        'Дополнительные APIs',
        <FileText size={20} className="text-gray-300" />,
        ['pushManager', 'notifications', 'clipboard', 'share', 'contacts', 'credentials', 'permissions', 'wakeLock', 'bluetooth', 'usb', 'serial', 'hid', 'gamepad', 'presentation', 'payment'],
        webAPIInfo
      )}

      {/* Статистика поддержки */}
      <div className="mb-6">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
          <FileText size={20} className="text-gray-300" />
          <span>Статистика поддержки</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Всего APIs:</span>
            <span className="text-white font-semibold">
              {Object.keys(webAPIInfo).length + Object.keys(mediaInfo).length + Object.keys(storageInfo).length + Object.keys(securityInfo).length + Object.keys(sensorsInfo).length}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Поддерживается:</span>
            <span className="text-green-400 font-semibold">
              {Object.values(webAPIInfo).filter(Boolean).length + 
               Object.values(mediaInfo).filter(Boolean).length + 
               Object.values(storageInfo).filter(Boolean).length + 
               Object.values(securityInfo).filter(Boolean).length + 
               Object.values(sensorsInfo).filter(Boolean).length}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Процент поддержки:</span>
            <span className="text-gray-300 font-semibold">
              {Math.round(
                ((Object.values(webAPIInfo).filter(Boolean).length + 
                  Object.values(mediaInfo).filter(Boolean).length + 
                  Object.values(storageInfo).filter(Boolean).length + 
                  Object.values(securityInfo).filter(Boolean).length + 
                  Object.values(sensorsInfo).filter(Boolean).length) /
                (Object.keys(webAPIInfo).length + Object.keys(mediaInfo).length + Object.keys(storageInfo).length + Object.keys(securityInfo).length + Object.keys(sensorsInfo).length)) * 100
              )}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebAPIInfo; 