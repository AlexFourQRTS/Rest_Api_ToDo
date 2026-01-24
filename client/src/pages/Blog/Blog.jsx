// src/pages/Blog/Blog.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authApi } from '../../api';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import Hero from '../../components/UI/Hero/Hero';
// Removed CSS module import


const BASE_URL = process.env.REACT_APP_API_URL;
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
        const response = await axios.get(`${BASE_URL}/api/api/blog`, {
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
      await axios.delete(`${BASE_URL}/api/api/blog/${articleToDelete}`);
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
      const response = await axios.post(`${BASE_URL}/api/api/blog`, articleData);
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
        className={`px-3 py-1 rounded ${page === 1 ? 'bg-slate-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
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
      pages.push(<span key="ellipsis1" className="px-2 text-gray-400">...</span>);
    }

    // Добавляем страницы вокруг текущей
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-1 rounded ${page === i ? 'bg-slate-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Добавляем многоточие перед последней страницей, если есть пропуск
    if (endPage < totalPages - 1) {
      pages.push(<span key="ellipsis2" className="px-2 text-gray-400">...</span>);
    }

    // Всегда показываем последнюю страницу, если она не первая
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          className={`px-3 py-1 rounded ${page === totalPages ? 'bg-slate-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="min-h-screen">
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
          <button className="btn-primary" onClick={() => setIsCreating(true)}>
            Создать статью
          </button>
        )}
      </Hero>
      {error && toast.error(error)}
      <div className="container-custom py-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Поиск статей..."
            className="input-field w-full max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

      {isDeleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Подтверждение удаления</h2>
              <button onClick={handleDeleteCancel} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="mb-6">
              <p className="text-gray-300">Вы уверены, что хотите удалить эту статью?</p>
            </div>
            <div className="flex gap-4">
              <button onClick={handleDeleteCancel} className="btn-secondary flex-1">
                Отмена
              </button>
              <button onClick={handleDeleteConfirm} className="btn-primary bg-red-600 hover:bg-red-700 flex-1">
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-white">{selectedArticle.name}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="mb-6">
              {selectedArticle.image && (
                <div
                  className="svg-container mb-4"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.image }}
                />
              )}
              <div className="text-gray-300 leading-relaxed">
                {selectedArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-white mb-6">Создать новую статью</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateArticle(newArticle);
            }} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-white mb-2">Название</label>
                <input
                  type="text"
                  id="name"
                  value={newArticle.name}
                  onChange={(e) => setNewArticle({...newArticle, name: e.target.value})}
                  required
                  className="input-field w-full"
                />
              </div>
              <div>
                <label htmlFor="excerpt" className="block text-white mb-2">Краткое описание</label>
                <textarea
                  id="excerpt"
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({...newArticle, excerpt: e.target.value})}
                  required
                  className="input-field w-full h-20"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-white mb-2">Содержание</label>
                <textarea
                  id="content"
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                  required
                  className="input-field w-full h-32"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-white mb-2">Категория</label>
                <input
                  type="text"
                  id="category"
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                  required
                  className="input-field w-full"
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-white mb-2">URL изображения</label>
                <input
                  type="text"
                  id="image"
                  value={newArticle.image_url}
                  onChange={(e) => setNewArticle({...newArticle, image_url: e.target.value})}
                  className="input-field w-full"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsCreating(false)} className="btn-secondary flex-1">Отмена</button>
                <button type="submit" className="btn-primary flex-1">Создать</button>
              </div>
            </form>
          </div>
        </div>
      )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onViewClick={() => handleViewClick(article)}
              onDeleteClick={user && user.role === 'admin' ? () => handleDeleteClick(article.id) : null}
            />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default Blog;