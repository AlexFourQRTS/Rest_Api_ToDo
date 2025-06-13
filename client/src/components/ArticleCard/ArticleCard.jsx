// src/components/ArticleCard/ArticleCard.jsx
import React from 'react';
import styles from './ArticleCard.module.css';
import { format } from 'date-fns';

const ArticleCard = ({ article, onView, onEdit, onDelete }) => {
  const {
    id,
    name: title,
    excerpt,
    image_url: imageUrl,
    category,
    created_at: createdAt,
    readTime,
    tags,
    canEdit
  } = article;

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={imageUrl || 'https://via.placeholder.com/300x200'} alt={title} className={styles.image} />
        <div className={styles.category}>{category}</div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.excerpt}>{excerpt}</p>

        <div className={styles.meta}>
          <span className={styles.date}>
            {format(new Date(createdAt), 'MMM d, yyyy')}
          </span>
          <span className={styles.readTime}>{readTime} min read</span>
        </div>

        <div className={styles.tags}>
          {tags?.map(tag => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.actions}>
          <button onClick={() => onView(id)} className={styles.actionButton}>
            View
          </button>
          {canEdit && (
            <>
              <button onClick={() => onEdit(id)} className={styles.actionButton}>
                Edit
              </button>
              <button onClick={() => onDelete(id)} className={styles.actionButton}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;