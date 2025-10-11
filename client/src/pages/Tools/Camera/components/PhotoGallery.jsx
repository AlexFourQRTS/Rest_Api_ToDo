import React from "react";
import { Download } from "lucide-react";

/**
 * Компонент галереи фотографий
 * Отображает сделанные снимки с возможностью скачивания и удаления
 */
const PhotoGallery = ({ photos, onDownload, onDelete }) => {
  // Не отображать галерею, если нет фотографий
  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Сделанные фотографии ({photos.length})
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <img
              src={photo.url}
              alt={`Фото ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            
            {/* Кнопки действий при наведении */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onDownload(photo)}
                className="bg-gray-800/80 hover:bg-gray-700/80 p-2 rounded-full"
                title="Скачать"
              >
                <Download size={16} className="text-white" />
              </button>
              <button
                onClick={() => onDelete(index)}
                className="bg-red-800/80 hover:bg-red-700/80 p-2 rounded-full"
                title="Удалить"
              >
                <span className="text-white">×</span>
              </button>
            </div>
            
            {/* Временная метка */}
            <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-1 rounded">
              {new Date(photo.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;

