import BaseApi from './BaseApi.js';

/**
 * API класс для работы с блогом и статьями
 * Наследует от BaseApi и добавляет методы для управления контентом блога
 */
class BlogApi extends BaseApi {
  constructor() {
    super();
  }

  /**
   * Получить список статей с пагинацией и фильтрацией
   * @param {Object} options - Параметры запроса
   * @param {number} options.limit - Количество статей на странице
   * @param {number} options.offset - Смещение для пагинации
   * @param {string} options.category - Категория для фильтрации
   * @param {string} options.searchTerm - Поисковый запрос
   * @returns {Promise<Object>} Объект с данными статей и пагинацией
   */
  async getArticles(options = {}) {
    try {
      const {
        limit = 10,
        offset = 0,
        category = 'all',
        searchTerm = ''
      } = options;

      const params = {
        limit,
        page: Math.floor(offset / limit) + 1
      };

      // Добавляем фильтры только если они не дефолтные
      if (category !== 'all') {
        params.category = category;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      return await this.get('/api/api/blog', params);
    } catch (error) {
      throw new Error(error.message || 'Ошибка получения статей');
    }
  }

  /**
   * Получить статью по ID
   * @param {string|number} id - ID статьи
   * @returns {Promise<Object>} Данные статьи
   */
  async getArticleById(id) {
    try {
      return await this.get(`/api/api/blog/${id}`);
    } catch (error) {
      throw new Error(error.message || 'Ошибка получения статьи');
    }
  }

  /**
   * Создать новую статью
   * @param {Object} articleData - Данные статьи
   * @param {string} articleData.title - Заголовок статьи
   * @param {string} articleData.content - Содержимое статьи
   * @param {string} articleData.category - Категория статьи
   * @param {string} articleData.image - URL изображения
   * @returns {Promise<Object>} Созданная статья
   */
  async createArticle(articleData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.post('/api/api/blog', articleData);
    } catch (error) {
      throw new Error(error.message || 'Ошибка создания статьи');
    }
  }

  /**
   * Обновить существующую статью
   * @param {string|number} id - ID статьи
   * @param {Object} articleData - Новые данные статьи
   * @returns {Promise<Object>} Обновленная статья
   */
  async updateArticle(id, articleData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.patch(`/api/api/blog/${id}`, articleData);
    } catch (error) {
      throw new Error(error.message || 'Ошибка обновления статьи');
    }
  }

  /**
   * Удалить статью
   * @param {string|number} id - ID статьи
   * @returns {Promise<Object>} Результат операции
   */
  async deleteArticle(id) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.delete(`/api/api/blog/${id}`);
    } catch (error) {
      throw new Error(error.message || 'Ошибка удаления статьи');
    }
  }

  /**
   * Получить список категорий
   * @returns {Promise<Array>} Список категорий
   */
  async getCategories() {
    try {
      return await this.get('/api/api/blog/categories');
    } catch (error) {
      // Если эндпоинт не существует, возвращаем дефолтные категории
      return [
        { id: 'all', name: 'Все категории' },
        { id: 'tech', name: 'Технологии' },
        { id: 'news', name: 'Новости' },
        { id: 'tutorials', name: 'Туториалы' }
      ];
    }
  }

  /**
   * Получить популярные статьи
   * @param {number} limit - Количество статей
   * @returns {Promise<Array>} Список популярных статей
   */
  async getPopularArticles(limit = 5) {
    try {
      return await this.get('/api/api/blog/popular', { limit });
    } catch (error) {
      // Если эндпоинт не существует, возвращаем последние статьи
      const articles = await this.getArticles({ limit });
      return articles.articles || articles;
    }
  }

  /**
   * Получить последние статьи
   * @param {number} limit - Количество статей
   * @returns {Promise<Array>} Список последних статей
   */
  async getRecentArticles(limit = 5) {
    try {
      return await this.get('/api/api/blog/recent', { limit });
    } catch (error) {
      // Если эндпоинт не существует, возвращаем последние статьи
      const articles = await this.getArticles({ limit });
      return articles.articles || articles;
    }
  }

  /**
   * Поиск статей по запросу
   * @param {string} query - Поисковый запрос
   * @param {number} limit - Количество результатов
   * @returns {Promise<Array>} Результаты поиска
   */
  async searchArticles(query, limit = 10) {
    try {
      const articles = await this.getArticles({ 
        searchTerm: query, 
        limit 
      });
      return articles.articles || articles;
    } catch (error) {
      throw new Error(error.message || 'Ошибка поиска статей');
    }
  }

  /**
   * Получить статьи по категории
   * @param {string} category - Категория
   * @param {number} limit - Количество статей
   * @param {number} offset - Смещение для пагинации
   * @returns {Promise<Object>} Статьи категории с пагинацией
   */
  async getArticlesByCategory(category, limit = 10, offset = 0) {
    try {
      return await this.getArticles({ 
        category, 
        limit, 
        offset 
      });
    } catch (error) {
      throw new Error(error.message || 'Ошибка получения статей категории');
    }
  }

  /**
   * Увеличить счетчик просмотров статьи
   * @param {string|number} id - ID статьи
   * @returns {Promise<Object>} Результат операции
   */
  async incrementViews(id) {
    try {
      return await this.post(`/api/api/blog/${id}/views`);
    } catch (error) {
      // Игнорируем ошибки увеличения просмотров
      return { success: true };
    }
  }

  /**
   * Получить статистику блога (только для админов)
   * @returns {Promise<Object>} Статистика блога
   */
  async getBlogStats() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.get('/api/api/blog/stats');
    } catch (error) {
      // Если эндпоинт не существует, возвращаем базовую статистику
      const articles = await this.getArticles({ limit: 1000 });
      return {
        totalArticles: articles.total || articles.length || 0,
        totalViews: 0,
        totalCategories: 0
      };
    }
  }
}

// Создаем и экспортируем единственный экземпляр
const blogApi = new BlogApi();
export default blogApi;

