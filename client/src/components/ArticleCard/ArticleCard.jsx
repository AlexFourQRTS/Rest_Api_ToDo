// src/components/ArticleCard/ArticleCard.jsx
import React from 'react';
// Removed CSS module import
import noImg from '../../pages/Blog/noImg.ico';

const ArticleCard = ({ article, onViewClick, onDeleteClick }) => {
  // Универсальный рендер изображения

  const renderImage = () => {
    const img = article.image_url;
    console.log("img", img)
    if (!img) {
      // Нет изображения
      return <img src={noImg} alt="no-img" className="w-full h-32 object-cover rounded-lg" />;
    }
    if (typeof img === 'string') {
      // SVG-код
      if (img.trim().startsWith('<svg')) {
        return (
          <div
            className="w-full h-32 object-cover rounded-lg"
            style={{padding:0,background:'none'}}
            dangerouslySetInnerHTML={{ __html: img }}
            aria-label={article.name}
          />
        );
      }
      // base64 или обычный url
      if (
        img.startsWith('http') ||
        img.startsWith('data:image') ||
        img.startsWith('/')
      ) {
        return <img src={img} alt={article.name} className="w-full h-32 object-cover rounded-lg" />;
      }
    }
    // fallback
    return <img src={noImg} alt="no-img" className="w-full h-32 object-cover rounded-lg" />;
  };

  return (
    <div className="card p-6 hover:shadow-2xl">

      <div className="mb-4">
        {renderImage()}
      </div>

      <div className="space-y-4">
        <div className="text-gray-300 text-sm font-medium">{article.category}</div>
        <h3 className="text-xl font-semibold text-white">{article.name}</h3>
        <p className="text-gray-300 text-sm line-clamp-3">{article.content}</p>
        <div className="flex gap-3">
          <button className="btn-primary flex-1" onClick={onViewClick}>
            Просмотр
          </button>
          {onDeleteClick && (
            <button className="btn-primary bg-red-600 hover:bg-red-700 flex-1" onClick={onDeleteClick}>
              Удалить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;