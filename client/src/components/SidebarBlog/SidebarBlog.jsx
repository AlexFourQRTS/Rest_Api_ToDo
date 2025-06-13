// src/components/Sidebar/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import styles from './SidebarBlog.module.css';
import { FaFolder, FaTags, FaClock } from 'react-icons/fa';
import { getArticles } from '../../api/blogApi';

export const SidebarBlog = ({ selectedTag, onTagSelect }) => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем все статьи для извлечения уникальных категорий и тегов
        const response = await getArticles(1000, 0);
        const articles = response.articles;

        // Извлекаем уникальные категории
        const uniqueCategories = [...new Set(articles.map(article => article.category))].filter(Boolean);
        setCategories(uniqueCategories);

        // Извлекаем уникальные теги
        const allTags = articles.reduce((acc, article) => {
          if (article.tags && Array.isArray(article.tags)) {
            return [...acc, ...article.tags];
          }
          return acc;
        }, []);
        const uniqueTags = [...new Set(allTags)].filter(Boolean);
        setTags(uniqueTags);
      } catch (error) {
        console.error('Error fetching categories and tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.sidebar}>Loading...</div>;
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarSection}>
        <h3 className={styles.sectionTitle}>
          <FaFolder /> Categories
        </h3>
        <div className={styles.categoriesList}>
          {categories.map(category => (
            <div
              key={category}
              className={styles.categoryItem}
              onClick={() => onTagSelect(category)}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3>Popular Tags</h3>
        <div className={styles.tags}>
          {tags.map(tag => (
            <button
              key={tag}
              className={`${styles.tag} ${selectedTag === tag ? styles.active : ''}`}
              onClick={() => onTagSelect(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.sidebarSection}>
        <h3 className={styles.sectionTitle}>
          <FaClock /> Recent Posts
        </h3>
        <div className={styles.recentPosts}>
          {/* Recent posts content will be populated here */}
        </div>
      </div>
    </aside>
  );
};

