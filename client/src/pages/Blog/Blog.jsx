// src/pages/Blog/Blog.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import Hero from '../../components/UI/Hero/Hero';
import styles from './Blog.module.css';


const BASE_URL = process.env.REACT_APP_API_URL;
const ITEMS_PER_PAGE = 6;

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newArticle, setNewArticle] = useState({
    name: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    image_url: ''
  });

  // Получение всех статей
  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/api/blog`, {
        params: {
          limit: ITEMS_PER_PAGE,
          page: currentPage,
          category: 'all',
          search: ''
        }
      });
      setArticles(response.data.articles);
      setTotalPages(Math.ceil(response.data.totalCount / ITEMS_PER_PAGE));
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Ошибка загрузки статей');
    } finally {
      setLoading(false);
    }
  };

  // Получение одной статьи по ID
  const fetchArticleById = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/blog/${id}`);
      setSelectedArticle(response.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError('Ошибка загрузки статьи');
    }
  };

  // Обновление статьи
  const updateArticle = async (id, articleData) => {
    try {
      const response = await axios.patch(`${BASE_URL}/api/blog/${id}`, articleData);
      setArticles(prevArticles => 
        prevArticles.map(article => 
          article.id === id ? response.data : article
        )
      );
      setIsEditing(false);
      setSelectedArticle(null);
      return response.data;
    } catch (err) {
      console.error('Error updating article:', err);
      setError('Ошибка обновления статьи');
      throw err;
    }
  };

  // Удаление статьи
  const deleteArticle = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      try {
        await axios.delete(`${BASE_URL}/api/blog/${id}`);
        setArticles(prevArticles => 
          prevArticles.filter(article => article.id !== id)
        );
      } catch (err) {
        console.error('Error deleting article:', err);
        setError('Ошибка удаления статьи');
      }
    }
  };

  // Создание новой статьи
  const handleCreateArticle = async (e) => {
    e.preventDefault();
    try {
      const articleData = {
        ...newArticle,
        tags: newArticle.tags.split(',').map(tag => tag.trim())
      };
      const response = await axios.post(`${BASE_URL}/api/blog`, articleData);
      setArticles(prevArticles => [response.data, ...prevArticles]);
      setIsCreating(false);
      setNewArticle({
        name: '',
        excerpt: '',
        content: '',
        category: '',
        tags: '',
        image_url: ''
      });
    } catch (err) {
      console.error('Error creating article:', err);
      setError('Ошибка создания статьи');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = (article) => {
    setSelectedArticle(article);
    setNewArticle({
      name: article.name || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category || '',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
      image_url: article.image_url || ''
    });
    setIsEditing(true);
  };

  const handleUpdateArticle = async (e) => {
    e.preventDefault();
    if (selectedArticle) {
      try {
        // Преобразуем строку тегов в массив
        const articleData = {
          ...newArticle,
          tags: newArticle.tags ? newArticle.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
        };
        await updateArticle(selectedArticle.id, articleData);
      } catch (err) {
        console.error('Error updating article:', err);
        setError('Ошибка обновления статьи');
      }
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className={styles.paginationButton}
        >
          ←
        </button>
      );
    }

    if (startPage > 1) {
      pages.push(
        <button
          key="1"
          onClick={() => handlePageChange(1)}
          className={styles.paginationButton}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis" className={styles.ellipsis}>...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles.paginationButton} ${currentPage === i ? styles.active : ''}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className={styles.ellipsis}>...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={styles.paginationButton}
        >
          {totalPages}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className={styles.paginationButton}
        >
          →
        </button>
      );
    }

    return pages;
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.blogContainer}>
      <Hero 
        title="Блог"
        subtitle="Делитесь своими мыслями и идеями с миром"
        buttonText="Создать статью"
        onButtonClick={() => setIsCreating(true)}
      />

      {(isCreating || isEditing) && (
        <div className={styles.createForm}>
          <h2>{isEditing ? 'Редактировать статью' : 'Создать новую статью'}</h2>
          <form onSubmit={isEditing ? handleUpdateArticle : handleCreateArticle}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Заголовок</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newArticle.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="excerpt">Краткое описание</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={newArticle.excerpt}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="content">Содержание</label>
              <textarea
                id="content"
                name="content"
                value={newArticle.content}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Категория</label>
              <input
                type="text"
                id="category"
                name="category"
                value={newArticle.category}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="tags">Теги (через запятую)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={newArticle.tags}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="image_url">URL изображения</label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={newArticle.image_url}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                {isEditing ? 'Сохранить' : 'Опубликовать'}
              </button>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                  setSelectedArticle(null);
                  setNewArticle({
                    name: '',
                    excerpt: '',
                    content: '',
                    category: '',
                    tags: '',
                    image_url: ''
                  });
                }}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {isModalOpen && selectedArticle && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{selectedArticle.name}</h2>
            <p className={styles.modalExcerpt}>{selectedArticle.excerpt}</p>
            <div className={styles.modalContent}>{selectedArticle.content}</div>
            <div className={styles.modalMeta}>
              <span>Категория: {selectedArticle.category}</span>
              <span>Теги: {selectedArticle.tags ? selectedArticle.tags.join(', ') : 'Нет тегов'}</span>
            </div>
            <button 
              className={styles.closeButton}
              onClick={() => {
                setIsModalOpen(false);
                setSelectedArticle(null);
              }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      <div className={styles.blogList}>
        {articles.length === 0 ? (
          <div className={styles.empty}>Нет статей</div>
        ) : (
          articles.map(article => (
            <ArticleCard 
              key={article.id} 
              article={article}
              onView={() => fetchArticleById(article.id)}
              onEdit={() => handleEditClick(article)}
              onDelete={() => deleteArticle(article.id)}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default Blog;