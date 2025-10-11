import React from "react";
import { Camera as CameraIcon, RefreshCw } from "lucide-react";

/**
 * Компонент выбора видеоустройства
 * Отображает список доступных камер и позволяет переключаться между ними
 */
const CameraDeviceSelector = ({
  devices,
  selectedDevice,
  isLoading,
  isScanning,
  onDeviceChange,
  onRescan,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">
          Камеры ({devices.length})
        </h3>
        <button
          onClick={onRescan}
          disabled={isScanning || isLoading}
          className="btn-secondary flex items-center space-x-2 text-sm py-1 px-3"
          title="Повторное сканирование камер"
        >
          <RefreshCw 
            size={16} 
            className={isScanning ? "animate-spin" : ""} 
          />
          <span>{isScanning ? "Сканирование..." : "Обновить"}</span>
        </button>
      </div>
      
      {devices.length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 text-center text-gray-400">
          <CameraIcon size={32} className="mx-auto mb-2 opacity-50" />
          <p>Камеры не найдены</p>
          <p className="text-sm mt-1">Нажмите "Обновить" для повторного сканирования</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default CameraDeviceSelector;

