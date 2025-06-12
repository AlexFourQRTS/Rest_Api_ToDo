// src/components/ArticleModal/ArticleModal.jsx
import React from 'react';
import styles from './ArticleModal.module.css';

const ArticleModal = ({ isOpen, onClose, articleContent }) => {
  if (!isOpen) return null; // Don't render if not open, good for performance and accessibility

  return (
    <div className={`${styles.articleModal} ${isOpen ? styles.active : ''}`} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          &times;
        </button>
        <div
          className={styles.modalArticle}
          dangerouslySetInnerHTML={{ __html: articleContent }}
        ></div>
      </div>
    </div>
  );
};

export default ArticleModal;