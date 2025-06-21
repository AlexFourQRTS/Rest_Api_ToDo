import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./Camera.module.css";
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
    <div className={styles.camera}>
      <motion.section
        className={styles.intro}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Hero 
          title="Камера" 
          subtitle="Съемка фотографий и запись видео" 
        />
      </motion.section>
      
      <motion.section
        className={styles.cameraContainer}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Селектор камер */}
        {devices.length > 1 && (
          <motion.div
            className={styles.cameraSelector}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>Выберите камеру</h3>
            <div className={styles.deviceList}>
              {devices.map((device, index) => (
                <button
                  key={device.deviceId}
                  onClick={() => switchDevice(device.deviceId)}
                  className={`${styles.deviceButton} ${
                    selectedDevice === device.deviceId ? styles.active : ''
                  }`}
                  disabled={isLoading}
                >
                  <CameraIcon size={16} />
                  <span>
                    {device.label || `Камера ${index + 1}`}
                  </span>
                  {selectedDevice === device.deviceId && (
                    <div className={styles.activeIndicator}>✓</div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Основная область камеры */}
        <div className={styles.cameraMain}>
          {/* Видео элемент */}
          <div 
            ref={videoContainerRef}
            className={`${styles.videoContainer} ${isFullscreen ? styles.fullscreen : ''}`}
          >
            {isLoading && (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Запуск камеры...</p>
              </div>
            )}
            
            {error && (
              <div className={styles.error}>
                <p>{error}</p>
                <button onClick={() => startCamera()} className={styles.retryButton}>
                  Попробовать снова
                </button>
              </div>
            )}
            
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={getVideoStyles()}
              className={`${styles.video} ${isCameraOn ? styles.active : ''}`}
            />
            
            {!isCameraOn && !isLoading && !error && (
              <div className={styles.cameraPlaceholder}>
                <CameraIcon size={64} />
                <p>Камера выключена</p>
              </div>
            )}

            {/* Индикатор поворота */}
            {rotation !== 0 && (
              <div className={styles.rotationIndicator}>
                <span>Поворот: {rotation}°</span>
              </div>
            )}
          </div>

          {/* Панель управления */}
          <div className={styles.controls}>
            <div className={styles.controlButtons}>
              {/* Кнопка включения/выключения камеры */}
              <button
                onClick={isCameraOn ? handleStopCamera : handleStartCamera}
                className={`${styles.controlButton} ${isCameraOn ? styles.stop : styles.start}`}
                disabled={isLoading}
              >
                {isCameraOn ? <CameraOff size={24} /> : <CameraIcon size={24} />}
                <span>{isCameraOn ? 'Выключить' : 'Включить'}</span>
              </button>

              {/* Кнопка съемки фото */}
              <button
                onClick={handleTakePhoto}
                className={`${styles.controlButton} ${styles.photo}`}
                disabled={!isCameraOn || isLoading}
              >
                <div className={styles.photoButton}>
                  <div className={styles.photoButtonInner}></div>
                </div>
                <span>Сфотографировать</span>
              </button>

              {/* Кнопка поворота */}
              <button
                onClick={rotateCamera}
                className={`${styles.controlButton} ${styles.rotate}`}
                disabled={!isCameraOn || isLoading}
              >
                <RotateCw size={24} />
                <span>Повернуть</span>
              </button>

              {/* Кнопка смены камеры */}
              {devices.length > 1 && (
                <button
                  onClick={handleSwitchCamera}
                  className={`${styles.controlButton} ${styles.switch}`}
                  disabled={!isCameraOn || isLoading}
                >
                  <RotateCcw size={24} />
                  <span>Сменить камеру</span>
                </button>
              )}

              {/* Кнопка полноэкранного режима */}
              <button
                onClick={toggleFullscreen}
                className={`${styles.controlButton} ${styles.fullscreen}`}
                disabled={!isCameraOn || isLoading}
              >
                {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                <span>{isFullscreen ? 'Выйти' : 'Полный экран'}</span>
              </button>

              {/* Кнопка фильтров */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`${styles.controlButton} ${styles.filters}`}
              >
                <Sun size={24} />
                <span>Фильтры</span>
              </button>
            </div>
          </div>
        </div>

        {/* Панель фильтров */}
        {showFilters && (
          <motion.div
            className={styles.filters}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3>Настройки изображения</h3>
            
            <div className={styles.filterControls}>
              <div className={styles.filterGroup}>
                <label>
                  <Sun size={16} />
                  Яркость: {brightness}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => adjustBrightness(parseInt(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.filterGroup}>
                <label>
                  <Contrast size={16} />
                  Контраст: {contrast}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => adjustContrast(parseInt(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.filterGroup}>
                <label>
                  <Zap size={16} />
                  Резкость: {sharpness}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={sharpness}
                  onChange={(e) => adjustSharpness(parseInt(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.filterActions}>
                <button
                  onClick={resetFilters}
                  className={styles.resetButton}
                >
                  Сбросить фильтры
                </button>
                <button
                  onClick={resetRotation}
                  className={styles.resetButton}
                >
                  Сбросить поворот
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Галерея фотографий */}
        {photos.length > 0 && (
          <motion.div
            className={styles.gallery}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>Сделанные фотографии ({photos.length})</h3>
            <div className={styles.photoGrid}>
              {photos.map((photo, index) => (
                <div key={index} className={styles.photoItem}>
                  <img src={photo.url} alt={`Фото ${index + 1}`} />
                  <div className={styles.photoActions}>
                    <button
                      onClick={() => downloadPhoto(photo)}
                      className={styles.actionButton}
                      title="Скачать"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => deletePhoto(index)}
                      className={`${styles.actionButton} ${styles.delete}`}
                      title="Удалить"
                    >
                      ×
                    </button>
                  </div>
                  <div className={styles.photoTimestamp}>
                    {new Date(photo.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.section>
    </div>
  );
};

export default Camera; 