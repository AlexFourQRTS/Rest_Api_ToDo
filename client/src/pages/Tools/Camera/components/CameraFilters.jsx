import React from "react";
import { Sun, Contrast, Zap } from "lucide-react";

/**
 * Компонент панели фильтров камеры
 * Содержит ползунки для настройки яркости, контраста и резкости
 */
const CameraFilters = ({
  brightness,
  contrast,
  sharpness,
  rotation,
  onBrightnessChange,
  onContrastChange,
  onSharpnessChange,
  onResetFilters,
  onResetRotation,
}) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Настройки изображения
      </h3>

      <div className="space-y-6">
        {/* Яркость */}
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
            onChange={(e) => onBrightnessChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Контраст */}
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
            onChange={(e) => onContrastChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Резкость */}
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
            onChange={(e) => onSharpnessChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Кнопки сброса */}
        <div className="flex gap-4">
          <button onClick={onResetFilters} className="btn-secondary">
            Сбросить фильтры
          </button>
          <button onClick={onResetRotation} className="btn-secondary">
            Сбросить поворот
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraFilters;

