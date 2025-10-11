import React from "react";
import { Camera as CameraIcon } from "lucide-react";

/**
 * Компонент выбора видеоустройства
 * Отображает список доступных камер и позволяет переключаться между ними
 */
const CameraDeviceSelector = ({
  devices,
  selectedDevice,
  isLoading,
  onDeviceChange,
}) => {
  // Не отображать селектор, если только одна камера
  if (devices.length <= 1) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-3">Выберите камеру</h3>
      <div className="flex flex-wrap gap-2">
        {devices.map((device, index) => (
          <button
            key={device.deviceId}
            onClick={() => onDeviceChange(device.deviceId)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
              selectedDevice === device.deviceId
                ? "bg-slate-600/20 border-slate-500 text-white"
                : "bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50"
            }`}
            disabled={isLoading}
          >
            <CameraIcon size={16} />
            <span>{device.label || `Камера ${index + 1}`}</span>
            {selectedDevice === device.deviceId && (
              <div className="text-gray-300">✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CameraDeviceSelector;

