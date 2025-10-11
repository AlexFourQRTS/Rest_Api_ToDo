import React from "react";
import {
  Camera as CameraIcon,
  CameraOff,
  RotateCw,
  Maximize2,
  Minimize2,
  Sun,
} from "lucide-react";

/**
 * Компонент панели управления камерой
 * Содержит кнопки включения/выключения, поворота, полного экрана и фильтров
 */
const CameraControls = ({
  isCameraOn,
  isLoading,
  isFullscreen,
  showFilters,
  onToggleCamera,
  onRotate,
  onToggleFullscreen,
  onToggleFilters,
}) => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
        {/* Кнопка включения/выключения камеры */}
        <button
          onClick={onToggleCamera}
          className={`btn-primary flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base ${
            isCameraOn
              ? "bg-red-600 hover:bg-red-700"
              : "bg-slate-600 hover:bg-slate-700"
          }`}
          disabled={isLoading}
        >
          {isCameraOn ? (
            <CameraOff size={16} className="sm:w-5 sm:h-5" />
          ) : (
            <CameraIcon size={16} className="sm:w-5 sm:h-5" />
          )}
          <span>{isCameraOn ? "Выключить" : "Включить"}</span>
        </button>

        {/* Кнопка поворота */}
        <button
          onClick={onRotate}
          className="btn-secondary flex items-center justify-center space-x-2"
          disabled={!isCameraOn || isLoading}
        >
          <RotateCw size={20} />
          <span>Поворот</span>
        </button>

        {/* Кнопка полноэкранного режима */}
        <button
          onClick={onToggleFullscreen}
          className="btn-secondary flex items-center justify-center space-x-2"
          disabled={!isCameraOn || isLoading}
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          <span>{isFullscreen ? "Выйти" : "Полный экран"}</span>
        </button>

        {/* Кнопка фильтров */}
        <button
          onClick={onToggleFilters}
          className={`btn-secondary flex items-center justify-center space-x-2 ${
            showFilters ? "bg-slate-600/20 border-slate-500" : ""
          }`}
        >
          <Sun size={20} />
          <span>Фильтры</span>
        </button>
      </div>
    </div>
  );
};

export default CameraControls;

