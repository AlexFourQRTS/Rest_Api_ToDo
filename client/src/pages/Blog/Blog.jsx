// src/pages/Blog/Blog.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import styles from './Blog.module.css';
import ArticleModal from '../../components/ArticleModal/ArticleModal';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import BlogControls from '../../components/BlogControls/BlogControls';
import { SidebarBlog } from '../../components/SidebarBlog/SidebarBlog'; // Убедитесь, что имя файла и компонента совпадают
import Button from '../../components/Shared/Button/Button';
import { getArticles, getArticleById, addArticle, updateArticle, deleteArticle, mockArticles as allMockArticlesData } from '../../api/blogApi'; // <-- ИСПРАВЛЕНО: Импортируем mockArticles как allMockArticlesData


const ARTICLES_PER_LOAD = 6;

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredArticlesCount, setFilteredArticlesCount] = useState(0); // Total count for current filter/search
  const [currentPage, setCurrentPage] = useState(1);

  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalArticleContent, setModalArticleContent] = useState('');
  const [isAddingNewArticle, setIsAddingNewArticle] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [newArticleData, setNewArticleData] = useState({ title: '', excerpt: '', category: '', imageUrl: '', canEdit: true });

  const notificationTimeoutRef = useRef(null);

  // Global notification function (can be integrated with a proper notification system)
  const showNotification = useCallback((message, type = 'info') => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    const notificationDiv = document.createElement('div');
    notificationDiv.className = `${styles.notification} ${styles[type]}`;
    notificationDiv.textContent = message;
    document.body.appendChild(notificationDiv);

    notificationTimeoutRef.current = setTimeout(() => {
      notificationDiv.remove();
    }, 3000);
  }, []);

  // Fetch articles based on current filters and pagination
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const offset = (currentPage - 1) * ARTICLES_PER_LOAD;
      const { articles: fetchedArticles, totalCount } = await getArticles(ARTICLES_PER_LOAD, offset, currentCategory, searchTerm);

      if (currentPage === 1) {
        setArticles(fetchedArticles);
      } else {
        setArticles(prevArticles => [...prevArticles, ...fetchedArticles]);
      }
      setFilteredArticlesCount(totalCount);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again.');
      showNotification('Failed to load articles.', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentCategory, searchTerm, showNotification]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Reset pagination when category or search term changes
  useEffect(() => {
    setCurrentPage(1);
    setArticles([]); // Clear articles to refetch from start
  }, [currentCategory, searchTerm]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleCategoryFilter = (category) => {
    setCurrentCategory(category);
  };

  const loadMoreArticles = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const openArticleModal = async (article) => {
    try {
      const fullArticle = await getArticleById(article.id);
      if (fullArticle) {
        setModalArticleContent(fullArticle.fullContent);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
      } else {
        showNotification('Article content not found.', 'error');
      }
    } catch (err) {
      console.error('Error opening article:', err);
      showNotification('Failed to load article content.', 'error');
    }
  };

  const closeArticleModal = () => {
    setIsModalOpen(false);
    setModalArticleContent('');
    document.body.style.overflow = 'auto';
  };

  const handleNewsletterSubmit = (email) => {
    if (email && email.includes('@')) {
      showNotification('Successfully subscribed to newsletter!', 'success');
      const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
      if (!subscriptions.includes(email)) {
        subscriptions.push(email);
        localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));
      }
    } else {
      showNotification('Please enter a valid email address.', 'error');
    }
  };

  const handleLike = useCallback(async (id) => {
    try {
      const articleToUpdate = articles.find(a => a.id === id);
      if (!articleToUpdate) return;
      const updatedArticle = await updateArticle(id, { likes: !articleToUpdate.likes, dislikes: false });
      setArticles(prevArticles =>
        prevArticles.map(article => (article.id === id ? updatedArticle : article))
      );
      showNotification(updatedArticle.likes ? 'Article marked as liked!' : 'Like removed.', 'info');
    } catch (err) {
      showNotification('Failed to update like status.', 'error');
    }
  }, [articles, showNotification]);

  const handleDislike = useCallback(async (id) => {
    try {
      const articleToUpdate = articles.find(a => a.id === id);
      if (!articleToUpdate) return;
      const updatedArticle = await updateArticle(id, { dislikes: !articleToUpdate.dislikes, likes: false });
      setArticles(prevArticles =>
        prevArticles.map(article => (article.id === id ? updatedArticle : article))
      );
      showNotification(updatedArticle.dislikes ? 'Article marked for deletion!' : 'Dislike removed.', 'info');
    } catch (err) {
      showNotification('Failed to update dislike status.', 'error');
    }
  }, [articles, showNotification]);

  const handleEdit = useCallback(async (id) => {
    try {
      const articleToEdit = await getArticleById(id);
      if (articleToEdit) {
        setEditingArticleId(id);
        setNewArticleData({
          title: articleToEdit.title,
          excerpt: articleToEdit.excerpt,
          category: articleToEdit.category,
          imageUrl: articleToEdit.imageUrl || '',
          canEdit: articleToEdit.canEdit
        });
        setIsAddingNewArticle(true); // Re-use the form for editing
      }
    } catch (err) {
      showNotification('Failed to load article for editing.', 'error');
    }
  }, [showNotification]);


  const handleAddNewArticle = async (e) => {
    e.preventDefault();
    if (!newArticleData.title || !newArticleData.excerpt || !newArticleData.category) {
      showNotification('Title, excerpt, and category are required.', 'error');
      return;
    }

    setLoading(true);
    try {
      if (editingArticleId) {
        // Update existing article
        const updated = await updateArticle(editingArticleId, newArticleData);
        setArticles(prevArticles =>
          prevArticles.map(article => (article.id === updated.id ? updated : article))
        );
        showNotification('Article updated successfully!', 'success');
      } else {
        // Add new article
        const added = await addArticle(newArticleData);
        // We prepend new articles to the current articles array for immediate display
        // In a real app, you might refetch or handle this based on your API's sort order
        setArticles(prevArticles => [added, ...prevArticles]);
        showNotification('Article added successfully!', 'success');
      }

      setNewArticleData({ title: '', excerpt: '', category: '', imageUrl: '', canEdit: true });
      setIsAddingNewArticle(false);
      setEditingArticleId(null);
      // Re-fetch articles to ensure order/pagination consistency if needed
      // fetchArticles();
    } catch (err) {
      console.error('Error saving article:', err);
      showNotification('Failed to save article.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsAddingNewArticle(false);
    setEditingArticleId(null);
    setNewArticleData({ title: '', excerpt: '', category: '', imageUrl: '', canEdit: true });
  };


  // Extract unique categories and tags for filters and sidebar
  const { allCategories, allTags } = useMemo(() => {
    const categoriesSet = new Set(['all']);
    const tagsMap = new Map();

    // ИСПОЛЬЗУЕМ allMockArticlesData ИЗ API МОКА, А НЕ articlesData
    allMockArticlesData.forEach(article => { 
      categoriesSet.add(article.category);
      article.tags.forEach(tag => {
        const lowerTag = tag.toLowerCase();
        tagsMap.set(lowerTag, (tagsMap.get(lowerTag) || 0) + 1);
      });
    });

    const sortedTags = Array.from(tagsMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // Sort by count

    return {
      allCategories: Array.from(categoriesSet),
      allTags: sortedTags.slice(0, 15) // Limit to top 15 tags for cloud
    };
  }, []); // Зависимость пустая, так как allMockArticlesData статичен


  // Недавние посты - берем первые 3 из allMockArticlesData
  const recentPosts = useMemo(() => allMockArticlesData.slice(0, 3), []); // ИСПОЛЬЗУЕМ allMockArticlesData

  const renderNoResults = searchTerm && filteredArticlesCount === 0 && !loading;

  return (
    <div className={styles.blogContainer}>
      <header className={styles.blogHeader}>
        <h1>Our Blog</h1>
        <p>Stay up-to-date with the latest tech news, tutorials, and insights.</p>
        <BlogControls
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchSubmit={setSearchTerm} // Direct update for search button
          currentCategory={currentCategory}
          onCategoryFilter={handleCategoryFilter}
          allCategories={allCategories}
        />
        <div className={styles.addArticleSection}>
          {!isAddingNewArticle ? (
            <Button onClick={() => setIsAddingNewArticle(true)}>Add New Article</Button>
          ) : (
            <form className={styles.newArticleForm} onSubmit={handleAddNewArticle}>
              <h3>{editingArticleId ? 'Edit Article' : 'Create New Article'}</h3>
              <input
                type="text"
                placeholder="Title"
                value={newArticleData.title}
                onChange={(e) => setNewArticleData({ ...newArticleData, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Excerpt"
                value={newArticleData.excerpt}
                onChange={(e) => setNewArticleData({ ...newArticleData, excerpt: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Category (e.g., javascript)"
                value={newArticleData.category}
                onChange={(e) => setNewArticleData({ ...newArticleData, category: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={newArticleData.imageUrl}
                onChange={(e) => setNewArticleData({ ...newArticleData, imageUrl: e.target.value })}
              />
              <label className={styles.canEditToggle}>
                <input
                  type="checkbox"
                  checked={newArticleData.canEdit}
                  onChange={(e) => setNewArticleData({ ...newArticleData, canEdit: e.target.checked })}
                />
                Allow Editing
              </label>
              <div className={styles.formActions}>
                <Button type="submit">{editingArticleId ? 'Update Article' : 'Publish Article'}</Button>
                <Button type="button" onClick={handleCancelEdit} className={styles.cancelButton}>Cancel</Button>
              </div>
            </form>
          )}
        </div>
      </header>

      <div className={styles.blogLayout}>
        <section className={styles.articlesGrid}>
          {loading && articles.length === 0 ? (
            <div className={styles.loadingMessage}>Loading articles...</div>
          ) : error ? (
            <div className={styles.errorMessage}>{error}</div>
          ) : renderNoResults ? (
            <div className={styles.noResults}>
              <h3>No articles found</h3>
              <p>Try adjusting your search terms or filters</p>
              <Button onClick={() => { setSearchTerm(''); setCurrentCategory('all'); }} className={styles.clearFiltersBtn}>Clear Filters</Button>
            </div>
          ) : (
            articles.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                onReadMore={openArticleModal}
                onLike={handleLike}
                onDislike={handleDislike}
                onEdit={handleEdit}
              />
            ))
          )}

          {articles.length > 0 && articles.length < filteredArticlesCount && (
            <div className={styles.loadMoreSection}>
              <Button onClick={loadMoreArticles} disabled={loading}>
                {loading ? 'Loading...' : `Load More Articles (${filteredArticlesCount - articles.length} remaining)`}
              </Button>
            </div>
          )}
        </section>

        <SidebarBlog // Предполагаем, что ваш компонент сайдбара называется SidebarBlog
          recentPosts={recentPosts}
          allTags={allTags}
          onTagFilter={handleCategoryFilter}
          onNewsletterSubmit={handleNewsletterSubmit}
        />
      </div>

      <ArticleModal
        isOpen={isModalOpen}
        onClose={closeArticleModal}
        articleContent={modalArticleContent}
      />
    </div>
  );
};

export default Blog;