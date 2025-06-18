// src/components/ArticleCard/ArticleCard.jsx
import React from 'react';
import styles from './ArticleCard.module.css';
import noImg from '../../pages/Blog/noImg.ico';

const ArticleCard = ({ article, onViewClick, onDeleteClick }) => {
  // Универсальный рендер изображения
  const renderImage = () => {
    const img = article.image;
    if (!img) {
      // Нет изображения
      return <img src={noImg} alt="no-img" className={styles.image} />;
    }
    if (typeof img === 'string') {
      // SVG-код
      if (img.trim().startsWith('<svg')) {
        return (
          <div
            className={styles.image}
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
        return <img src={img} alt={article.name} className={styles.image} />;
      }
    }
    // fallback
    return <img src={noImg} alt="no-img" className={styles.image} />;
  };

  return (
    <div className={styles.articleCard}>
      <div className={styles.imageContainer}>
        {renderImage()}
      </div>
      <div className={styles.content}>
        <div className={styles.category}>{article.category}</div>
        <h3 className={styles.title}>{article.name}</h3>
        <p className={styles.excerpt}>{article.content}</p>
        <div className={styles.actions}>
          <button className={styles.viewButton} onClick={onViewClick}>
            Просмотр
          </button>
          {/* <button className={styles.deleteButton} onClick={onDeleteClick}>
            Удалить
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;