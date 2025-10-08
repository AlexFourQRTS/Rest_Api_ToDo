import React from 'react';
import { MapPin, Globe, Wifi, Clock, Copy, Check } from 'lucide-react';
// Removed CSS module import

const IPInfo = ({ ipData, isLoading, error }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div 
        className="card p-6"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-500"></div>
          <p className="text-gray-300">Получение информации об IP адресе...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="card p-6"
      >
        <div className="text-center">
          <h3 className="text-red-400 text-lg font-semibold mb-2">❌ Ошибка загрузки</h3>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="card p-6"
    >
      {/* Основная информация об IP */}
      <div className="mb-6">
        <h3 className="flex items-center space-x-2 text-xl font-semibold text-white mb-4">
          <Globe size={20} className="text-gray-300" />
          <span>Ваш IP адрес</span>
        </h3>
        <div className="flex items-center space-x-3">
          <span className="text-gray-300 font-mono text-2xl">{ipData.ip}</span>
          <button 
            className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
            onClick={() => copyToClipboard(ipData.ip)}
            title="Копировать IP"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-300" />}
          </button>
        </div>
      </div>

      {/* Геолокация */}
      <div className="mb-6">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
          <MapPin size={20} className="text-gray-300" />
          <span>Геолокация</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Страна:</span>
            <span className="text-white">
              {ipData.country} {ipData.countryFlag}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Регион:</span>
            <span className="text-white">{ipData.region || 'Unknown'}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Город:</span>
            <span className="text-white">{ipData.city || 'Unknown'}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Почтовый индекс:</span>
            <span className="text-white">{ipData.postal || 'Unknown'}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Координаты:</span>
            <span className="text-white">
              {ipData.latitude && ipData.longitude 
                ? `${ipData.latitude}, ${ipData.longitude}`
                : 'Unknown'
              }
            </span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Часовой пояс:</span>
            <span className="text-white">{ipData.timezone || 'Unknown'}</span>
          </div>
        </div>
      </div>

      {/* Сетевая информация */}
      <div className="mb-6">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
          <Wifi size={20} className="text-gray-300" />
          <span>Сетевая информация</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Провайдер:</span>
            <span className="text-white">{ipData.org || 'Unknown'}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">ASN:</span>
            <span className="text-white">{ipData.asn || 'Unknown'}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Хост:</span>
            <span className="text-white">{ipData.hostname || 'Unknown'}</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Тип IP:</span>
            <span className="text-white">
              {ipData.ip?.includes(':') ? 'IPv6' : 'IPv4'}
            </span>
          </div>
        </div>
      </div>

      {/* Время запроса */}
      <div className="mb-6">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-white mb-4">
          <Clock size={20} className="text-gray-300" />
          <span>Время запроса</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between p-3 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300">Дата и время:</span>
            <span className="text-white">
              {formatDate(new Date().toISOString())}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPInfo; 