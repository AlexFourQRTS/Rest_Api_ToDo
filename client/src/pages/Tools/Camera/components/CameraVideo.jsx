import React from "react";
import { Camera as CameraIcon } from "lucide-react";

/**
 * Компонент видео отображения камеры
 * Отвечает за отображение видео потока, индикаторов загрузки и ошибок
 */
const CameraVideo = ({
  videoRef,
  videoContainerRef,
  isCameraOn,
  isLoading,
  error,
  isFullscreen,
  rotation,
  videoStyles,
  onRetry,
}) => {
  return (
    <div
      ref={videoContainerRef}
      className={`relative bg-gray-900 overflow-hidden ${
        isFullscreen 
          ? "fixed inset-0 z-50 bg-black" 
          : "rounded-lg mb-6"
      }`}
    >
      {/* Индикатор загрузки */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 mx-auto mb-4"></div>
            <p>Запуск камеры...</p>
          </div>
        </div>
      )}

      {/* Сообщение об ошибке */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center text-white">
            <p className="mb-4">{error}</p>
            <button onClick={onRetry} className="btn-primary">
              Попробовать снова
            </button>
          </div>
        </div>
      )}

      {/* Видео элемент */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={videoStyles}
        className={`w-full ${
          isFullscreen 
            ? "h-screen object-contain" 
            : "h-48 sm:h-64 object-cover"
        } ${isCameraOn ? "block" : "hidden"}`}
      />

      {/* Плейсхолдер когда камера выключена */}
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
  );
};

export default CameraVideo;

