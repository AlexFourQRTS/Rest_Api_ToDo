import React, { useState, useEffect } from "react";
import Hero from "../../../components/UI/Hero/Hero";
import useCamera from "../../../hooks/useCamera";

// Импорт подкомпонентов
import {
  CameraVideo,
  CameraControls,
  CameraFilters,
  CameraDeviceSelector,
  PhotoGallery,
} from "./components";

/**
 * Главный компонент страницы камеры
 * Управляет состоянием и координирует работу подкомпонентов
 */
const Camera = () => {
  // Хук камеры со всей логикой
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
    switchDevice,
  } = useCamera();

  // Локальное состояние компонента
  const [photos, setPhotos] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Очистка ошибки через 5 секунд
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // === Обработчики событий ===

  // Включение/выключение камеры
  const handleToggleCamera = async () => {
    if (isCameraOn) {
      console.log("Останавливаем камеру...");
      stopCamera();
    } else {
      console.log("Пытаемся запустить камеру...");
      try {
        await startCamera();
        console.log("Камера успешно запущена");
      } catch (err) {
        console.error("Ошибка при запуске камеры:", err);
      }
    }
  };

  // Создание фотографии
  const handleTakePhoto = async () => {
    try {
      const photo = await takePhoto();
      if (photo) {
        setPhotos((prev) => [photo, ...prev]);
      }
    } catch (err) {
      console.error("Ошибка при создании фото:", err);
    }
  };

  // Скачивание фотографии
  const handleDownloadPhoto = (photo) => {
    const link = document.createElement("a");
    link.href = photo.url;
    link.download = `photo_${new Date(photo.timestamp)
      .toISOString()
      .slice(0, 19)
      .replace(/:/g, "-")}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Удаление фотографии
  const handleDeletePhoto = (index) => {
    setPhotos((prev) => {
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
      {/* Заголовок страницы */}
      <section className="py-8 sm:py-12 lg:py-16">
        <Hero title="Камера" subtitle="" />
      </section>

      {/* Основной контент */}
      <section className="container-custom py-6 sm:py-8">
        {/* Селектор камер */}
        <CameraDeviceSelector
          devices={devices}
          selectedDevice={selectedDevice}
          isLoading={isLoading}
          onDeviceChange={switchDevice}
        />

        {/* Основная область камеры */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          {/* Видео элемент */}
          <CameraVideo
            videoRef={videoRef}
            videoContainerRef={videoContainerRef}
            isCameraOn={isCameraOn}
            isLoading={isLoading}
            error={error}
            isFullscreen={isFullscreen}
            rotation={rotation}
            videoStyles={getVideoStyles()}
            onRetry={startCamera}
          />

          {/* Панель управления */}
          <CameraControls
            isCameraOn={isCameraOn}
            isLoading={isLoading}
            isFullscreen={isFullscreen}
            showFilters={showFilters}
            onToggleCamera={handleToggleCamera}
            onRotate={rotateCamera}
            onToggleFullscreen={toggleFullscreen}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
        </div>

        {/* Панель фильтров */}
        {showFilters && (
          <CameraFilters
            brightness={brightness}
            contrast={contrast}
            sharpness={sharpness}
            rotation={rotation}
            onBrightnessChange={adjustBrightness}
            onContrastChange={adjustContrast}
            onSharpnessChange={adjustSharpness}
            onResetFilters={resetFilters}
            onResetRotation={resetRotation}
          />
        )}

        {/* Галерея фотографий */}
        <PhotoGallery
          photos={photos}
          onDownload={handleDownloadPhoto}
          onDelete={handleDeletePhoto}
        />
      </section>
    </div>
  );
};

export default Camera;
