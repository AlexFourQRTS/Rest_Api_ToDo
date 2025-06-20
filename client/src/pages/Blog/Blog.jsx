// src/pages/Blog/Blog.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authApi } from 'api/authApi';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import Hero from '../../components/UI/Hero/Hero';
import styles from './Blog.module.css';
import noImg from './noImg.ico';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const ITEMS_PER_PAGE = 5;

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [newArticle, setNewArticle] = useState({
    name: '',
    excerpt: '',
    content: '',
    category: '',
    image_url: ''
  });

  // Добавляем debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Обновляем useEffect для загрузки статей
  useEffect(() => {
    const fetchArticlesAndUser = async () => {
      try {
        setError(null);
        // Fetch user
        const userData = await authApi.getProfile();
        setUser(userData);

        // Fetch articles
        const response = await axios.get(`${BASE_URL}/api/blog`, {
          params: {
            limit: ITEMS_PER_PAGE,
            page: page,
            category: 'all',
            search: debouncedSearchQuery
          }
        });
        setArticles(response.data.articles);
        setTotalPages(Math.ceil(response.data.totalCount / ITEMS_PER_PAGE) || 1);
      } catch (err) {
        toast.error('Ошибка при загрузке данных');
        console.error('Error fetching data:', err);
      }
    };

    fetchArticlesAndUser();
  }, [page, debouncedSearchQuery]);

  // Сбрасываем страницу при новом поиске
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleViewClick = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  const handleDeleteClick = (id) => {
    setArticleToDelete(id);
    setIsDeleting(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/blog/${articleToDelete}`);
      setArticles(articles.filter(article => article.id !== articleToDelete));
      toast.success('Статья успешно удалена');
    } catch (err) {
      toast.error('Ошибка при удалении статьи');
      console.error('Error deleting article:', err);
    } finally {
      setIsDeleting(false);
      setArticleToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
    setArticleToDelete(null);
  };

  const handleCreateArticle = async (articleData) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/blog`, articleData);
      setArticles([...articles, response.data]);
      setIsCreating(false);
      toast.success('Статья успешно создана');
    } catch (err) {
      toast.error('Ошибка при создании статьи');
      console.error('Error creating article:', err);
    }
  };

  const renderPagination = () => {
    const pages = [];

    // Всегда показываем первую страницу
    pages.push(
      <button
        key="1"
        className={`${styles.pageButton} ${page === 1 ? styles.active : ''}`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );

    // Вычисляем начальную и конечную страницы для отображения
    let startPage = Math.max(2, page - 1);
    let endPage = Math.min(totalPages - 1, page + 1);

    // Добавляем многоточие после первой страницы, если есть пропуск
    if (startPage > 2) {
      pages.push(<span key="ellipsis1" className={styles.ellipsis}>...</span>);
    }

    // Добавляем страницы вокруг текущей
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageButton} ${page === i ? styles.active : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Добавляем многоточие перед последней страницей, если есть пропуск
    if (endPage < totalPages - 1) {
      pages.push(<span key="ellipsis2" className={styles.ellipsis}>...</span>);
    }

    // Всегда показываем последнюю страницу, если она не первая
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          className={`${styles.pageButton} ${page === totalPages ? styles.active : ''}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className={styles.blogContainer}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Hero title="Блог">
        {user && user.role === 'admin' && (
          <button className={styles.createButton} onClick={() => setIsCreating(true)}>
            Создать статью
          </button>
        )}
      </Hero>
      {error && toast.error(error)}
      <div className={styles.actions}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Поиск статей..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isDeleting && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Подтверждение удаления</h2>
              <button onClick={handleDeleteCancel} className={styles.closeButton}>×</button>
            </div>
            <div className={styles.modalBody}>
              <p>Вы уверены, что хотите удалить эту статью?</p>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={handleDeleteCancel} className={styles.cancelButton}>
                Отмена
              </button>
              <button onClick={handleDeleteConfirm} className={styles.deleteButton}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedArticle && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{selectedArticle.name}</h2>
              <button onClick={handleCloseModal} className={styles.closeButton}>×</button>
            </div>
            <div className={styles.modalBody}>
              {selectedArticle.image && (
                <div
                  className="svg-container"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.image }}
                />
              )}
              <div className={styles.modalText}>
                {selectedArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}

      {isCreating && (
        <div className={styles.createForm}>
          <h2>Создать новую статью</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleCreateArticle(newArticle);
          }}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Название</label>
              <input
                type="text"
                id="name"
                value={newArticle.name}
                onChange={(e) => setNewArticle({...newArticle, name: e.target.value})}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="excerpt">Краткое описание</label>
              <textarea
                id="excerpt"
                value={newArticle.excerpt}
                onChange={(e) => setNewArticle({...newArticle, excerpt: e.target.value})}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="content">Содержание</label>
              <textarea
                id="content"
                value={newArticle.content}
                onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="category">Категория</label>
              <input
                type="text"
                id="category"
                value={newArticle.category}
                onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="image">URL изображения</label>
              <input
                type="text"
                id="image"
                value={newArticle.image_url}
                onChange={(e) => setNewArticle({...newArticle, image_url: e.target.value})}
              />
            </div>
            <div className={styles.formActions}>
              <button type="button" onClick={() => setIsCreating(false)}>Отмена</button>
              <button type="submit">Создать</button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.blogList}>
        {articles.map(article => (
          <ArticleCard
            key={article.id}
            article={article}
            onViewClick={() => handleViewClick(article)}
            onDeleteClick={user && user.role === 'admin' ? () => handleDeleteClick(article.id) : null}
          />
        ))}
      </div>
      <div className={styles.pagination}>
        {renderPagination()}
      </div>
    </div>
  );
};

export default Blog;