// src/components/ArticleCard/ArticleCard.jsx
import React from 'react';
import styles from './ArticleCard.module.css';
import Button from '../Shared/Button/Button';

const ArticleCard = ({ article, onReadMore, onLike, onDislike, onEdit }) => {
  const formattedDate = new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className={`${styles.articleCard} ${article.featured ? styles.featured : ''}`}>
      <div className={styles.articleImage}>
        <img src={article.imageUrl} alt={article.title} className={styles.actualImage} />
        <span className={styles.categoryTag}>
          {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
        </span>
      </div>
      <div className={styles.articleContent}>
        <div className={styles.articleMeta}>
          <span className={styles.articleDate}>
            {formattedDate}
          </span>
          <span className={styles.readTime}>• {article.readTime}</span>
        </div>
        {article.featured ? (
          <h2>{article.title}</h2>
        ) : (
          <h3>{article.title}</h3>
        )}
        <p>{article.excerpt}</p>
        <div className={styles.articleTags}>
          {article.tags.map(tag => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className={styles.cardActions}>
          <Button onClick={() => onReadMore(article)} className={styles.readMore}>
            Read More
          </Button>
          <div className={styles.feedbackButtons}>
            <Button
              className={`${styles.likeButton} ${article.likes ? styles.active : ''}`}
              onClick={() => onLike(article.id)}
              title="Like this article"
            >
              👍
            </Button>
            <Button
              className={`${styles.dislikeButton} ${article.dislikes ? styles.active : ''}`}
              onClick={() => onDislike(article.id)}
              title="Dislike this article"
            >
              👎
            </Button>
          </div>
          {article.canEdit && (
            <Button className={styles.editButton} onClick={() => onEdit(article.id)} title="Edit article">
              ✏️
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;