import React, { useState, useEffect } from "react";
// Removed CSS module import
import Hero from "../../../components/UI/Hero/Hero";
import useCamera from "../../../hooks/useCamera";
import { 
  Camera as CameraIcon, 
  CameraOff, 
  RotateCcw, 
  Download, 
  RotateCw, 
  Maximize2, 
  Minimize2,
  Sun,
  Contrast,
  Zap
} from "lucide-react";

const Camera = () => {
  const {
    stream,
    isCameraOn,
    error,
    isLoading,
    devices,
    selectedDevice,
    rotation,
    brightness,
    contrast,
    sharpness,
    isFullscreen,
    videoRef,
    videoContainerRef,
    startCamera,
    stopCamera,
    switchCamera,
    takePhoto,
    rotateCamera,
    resetRotation,
    adjustBrightness,
    adjustContrast,
    adjustSharpness,
    resetFilters,
    toggleFullscreen,
    clearError,
    switchDevice
  } = useCamera();

  const [photos, setPhotos] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Автоматический запуск камеры при загрузке страницы
  useEffect(() => {
    // Убираем автоматический запуск камеры
    // Пользователь должен сам нажать кнопку "Включить"
  }, []);

  // Очистка ошибки при изменении
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Создание фотографии
  const handleTakePhoto = async () => {
    try {
      const photo = await takePhoto();
      if (photo) {
        setPhotos(prev => [photo, ...prev]);
      }
    } catch (err) {
      console.error('Ошибка при создании фото:', err);
    }
  };

  // Обработчик запуска камеры
  const handleStartCamera = async () => {
    console.log('Пытаемся запустить камеру...');
    try {
      await startCamera();
      console.log('Камера успешно запущена');
    } catch (err) {
      console.error('Ошибка при запуске камеры:', err);
    }
  };

  // Обработчик остановки камеры
  const handleStopCamera = () => {
    console.log('Останавливаем камеру...');
    stopCamera();
  };

  // Обработчик смены камеры
  const handleSwitchCamera = async () => {
    console.log('Сменяем камеру...');
    try {
      await switchCamera();
    } catch (err) {
      console.error('Ошибка при смене камеры:', err);
    }
  };

  // Скачивание фотографии
  const downloadPhoto = (photo) => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `photo_${new Date(photo.timestamp).toISOString().slice(0, 19).replace(/:/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Удаление фотографии
  const deletePhoto = (index) => {
    setPhotos(prev => {
      const newPhotos = prev.filter((_, i) => i !== index);
      return newPhotos;
    });
  };

  // Получение стилей для видео с фильтрами
  const getVideoStyles = () => {
    return {
      transform: `rotate(${rotation}deg)`,
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${sharpness}%)`,
    };
  };

  return (
    <div>
      <section
        className="py-8 sm:py-12 lg:py-16"
      >
        <Hero 
          title="Камера" 
          subtitle="" 
        />
      </section>
      
      <section
        className="container-custom py-6 sm:py-8"
      >
        {/* Селектор камер */}
        {devices.length > 1 && (
          <div
            className="mb-6"
          >
            <h3 className="text-lg font-semibold text-white mb-3">Выберите камеру</h3>
            <div className="flex flex-wrap gap-2">
              {devices.map((device, index) => (
                <button
                  key={device.deviceId}
                  onClick={() => switchDevice(device.deviceId)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                    selectedDevice === device.deviceId 
                      ? 'bg-slate-600/20 border-slate-500 text-white' 
                      : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                  }`}
                  disabled={isLoading}
                >
                  <CameraIcon size={16} />
                  <span>
                    {device.label || `Камера ${index + 1}`}
                  </span>
                  {selectedDevice === device.deviceId && (
                    <div className="text-gray-300">✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Основная область камеры */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          {/* Видео элемент */}
          <div 
            ref={videoContainerRef}
            className={`relative bg-gray-900 rounded-lg overflow-hidden mb-6 ${
              isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''
            }`}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 mx-auto mb-4"></div>
                  <p>Запуск камеры...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center text-white">
                  <p className="mb-4">{error}</p>
                  <button 
                    onClick={() => startCamera()} 
                    className="btn-primary"
                  >
                    Попробовать снова
                  </button>
                </div>
              </div>
            )}
            
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={getVideoStyles()}
              className={`w-full h-48 sm:h-64 object-cover ${isCameraOn ? 'block' : 'hidden'}`}
            />
            
            {!isCameraOn && !isLoading && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center text-gray-400">
                  <CameraIcon size={64} className="mx-auto mb-4" />
                  <p>Камера выключена</p>
                </div>
              </div>
            )}

            {/* Индикатор поворота */}
            {rotation !== 0 && (
              <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                Поворот: {rotation}°
              </div>
            )}
          </div>

          {/* Панель управления */}
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
              {/* Кнопка включения/выключения камеры */}
              <button
                onClick={isCameraOn ? handleStopCamera : handleStartCamera}
                className={`btn-primary flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base ${
                  isCameraOn ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-600 hover:bg-slate-700'
                }`}
                disabled={isLoading}
              >
                {isCameraOn ? <CameraOff size={16} className="sm:w-5 sm:h-5" /> : <CameraIcon size={16} className="sm:w-5 sm:h-5" />}
                <span>{isCameraOn ? 'Выключить' : 'Включить'}</span>
              </button>

              {/* Кнопка поворота */}
              <button
                onClick={rotateCamera}
                className="btn-secondary flex items-center justify-center space-x-2"
                disabled={!isCameraOn || isLoading}
              >
                <RotateCw size={20} />
                <span>Поворот</span>
              </button>

              {/* Кнопка полноэкранного режима */}
              <button
                onClick={toggleFullscreen}
                className="btn-secondary flex items-center justify-center space-x-2"
                disabled={!isCameraOn || isLoading}
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                <span>{isFullscreen ? 'Выйти' : 'Полный экран'}</span>
              </button>

              {/* Кнопка фильтров */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-secondary flex items-center justify-center space-x-2 ${
                  showFilters ? 'bg-slate-600/20 border-slate-500' : ''
                }`}
              >
                <Sun size={20} />
                <span>Фильтры</span>
              </button>
            </div>
          </div>
        </div>

        {/* Панель фильтров */}
        {showFilters && (
          <div
            className="bg-gray-800/50 rounded-lg p-6 mt-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Настройки изображения</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-white">
                  <Sun size={16} />
                  <span>Яркость: {brightness}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => adjustBrightness(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-white">
                  <Contrast size={16} />
                  <span>Контраст: {contrast}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => adjustContrast(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-white">
                  <Zap size={16} />
                  <span>Резкость: {sharpness}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={sharpness}
                  onChange={(e) => adjustSharpness(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={resetFilters}
                  className="btn-secondary"
                >
                  Сбросить фильтры
                </button>
                <button
                  onClick={resetRotation}
                  className="btn-secondary"
                >
                  Сбросить поворот
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Галерея фотографий */}
        {photos.length > 0 && (
          <div
            className="bg-gray-800/50 rounded-lg p-6 mt-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Сделанные фотографии ({photos.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={photo.url} 
                    alt={`Фото ${index + 1}`} 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => downloadPhoto(photo)}
                      className="bg-gray-800/80 hover:bg-gray-700/80 p-2 rounded-full"
                      title="Скачать"
                    >
                      <Download size={16} className="text-white" />
                    </button>
                    <button
                      onClick={() => deletePhoto(index)}
                      className="bg-red-800/80 hover:bg-red-700/80 p-2 rounded-full"
                      title="Удалить"
                    >
                      <span className="text-white">×</span>
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-1 rounded">
                    {new Date(photo.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Camera; 