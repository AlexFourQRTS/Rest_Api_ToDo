import BaseApi from './BaseApi.js';

/**
 * API класс для работы с пользователями и профилями
 * Наследует от BaseApi и добавляет методы для управления пользователями
 */
class UserApi extends BaseApi {
  constructor() {
    super();
  }

  /**
   * Получить профиль текущего пользователя
   * @returns {Promise<Object|null>} Данные профиля или null
   */
  async getCurrentUser() {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }

      return await this.get('/api/user/profile');
    } catch (error) {
      return null;
    }
  }

  /**
   * Обновить профиль текущего пользователя
   * @param {Object} userData - Новые данные пользователя
   * @param {string} userData.name - Имя пользователя
   * @param {string} userData.email - Email пользователя
   * @param {string} userData.avatar - URL аватара
   * @param {string} userData.bio - Биография пользователя
   * @returns {Promise<Object>} Обновленные данные пользователя
   */
  async updateProfile(userData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.patch('/api/user/profile', userData);
    } catch (error) {
      throw new Error(error.message || 'Ошибка обновления профиля');
    }
  }

  /**
   * Загрузить аватар пользователя
   * @param {File} avatarFile - Файл аватара
   * @returns {Promise<Object>} Данные загруженного аватара
   */
  async uploadAvatar(avatarFile) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const token = this.getToken();
      const response = await fetch(`${this.apiURL}/api/user/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Ошибка загрузки аватара');
    }
  }

  /**
   * Удалить аватар пользователя
   * @returns {Promise<Object>} Результат операции
   */
  async deleteAvatar() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.delete('/api/user/avatar');
    } catch (error) {
      throw new Error(error.message || 'Ошибка удаления аватара');
    }
  }

  /**
   * Получить настройки пользователя
   * @returns {Promise<Object>} Настройки пользователя
   */
  async getUserSettings() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.get('/api/user/settings');
    } catch (error) {
      // Если эндпоинт не существует, возвращаем дефолтные настройки
      return {
        theme: 'dark',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        privacy: {
          profilePublic: true,
          showEmail: false,
          showLastSeen: true
        }
      };
    }
  }

  /**
   * Обновить настройки пользователя
   * @param {Object} settings - Новые настройки
   * @returns {Promise<Object>} Обновленные настройки
   */
  async updateUserSettings(settings) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.patch('/api/user/settings', settings);
    } catch (error) {
      throw new Error(error.message || 'Ошибка обновления настроек');
    }
  }

  /**
   * Получить активность пользователя
   * @param {Object} options - Параметры запроса
   * @param {number} options.limit - Количество записей
   * @param {number} options.offset - Смещение для пагинации
   * @param {string} options.type - Тип активности
   * @returns {Promise<Object>} Активность пользователя
   */
  async getUserActivity(options = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      const { limit = 20, offset = 0, type = 'all' } = options;
      const params = { limit, offset };
      
      if (type !== 'all') {
        params.type = type;
      }

      return await this.get('/api/user/activity', params);
    } catch (error) {
      // Если эндпоинт не существует, возвращаем пустую активность
      return {
        activities: [],
        total: 0,
        hasMore: false
      };
    }
  }

  /**
   * Получить статистику пользователя
   * @returns {Promise<Object>} Статистика пользователя
   */
  async getUserStats() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.get('/api/user/stats');
    } catch (error) {
      // Если эндпоинт не существует, возвращаем базовую статистику
      return {
        totalFiles: 0,
        totalArticles: 0,
        totalViews: 0,
        joinDate: new Date().toISOString()
      };
    }
  }

  /**
   * Получить список друзей/подписчиков
   * @param {Object} options - Параметры запроса
   * @param {number} options.limit - Количество пользователей
   * @param {number} options.offset - Смещение для пагинации
   * @param {string} options.type - Тип связи (friends, followers, following)
   * @returns {Promise<Object>} Список пользователей
   */
  async getUserConnections(options = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      const { limit = 20, offset = 0, type = 'friends' } = options;
      const params = { limit, offset };

      return await this.get(`/api/user/${type}`, params);
    } catch (error) {
      // Если эндпоинт не существует, возвращаем пустой список
      return {
        users: [],
        total: 0,
        hasMore: false
      };
    }
  }

  /**
   * Добавить пользователя в друзья
   * @param {string|number} userId - ID пользователя
   * @returns {Promise<Object>} Результат операции
   */
  async addFriend(userId) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.post(`/api/user/friends/${userId}`);
    } catch (error) {
      throw new Error(error.message || 'Ошибка добавления в друзья');
    }
  }

  /**
   * Удалить пользователя из друзей
   * @param {string|number} userId - ID пользователя
   * @returns {Promise<Object>} Результат операции
   */
  async removeFriend(userId) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.delete(`/api/user/friends/${userId}`);
    } catch (error) {
      throw new Error(error.message || 'Ошибка удаления из друзей');
    }
  }

  /**
   * Подписаться на пользователя
   * @param {string|number} userId - ID пользователя
   * @returns {Promise<Object>} Результат операции
   */
  async followUser(userId) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.post(`/api/user/follow/${userId}`);
    } catch (error) {
      throw new Error(error.message || 'Ошибка подписки');
    }
  }

  /**
   * Отписаться от пользователя
   * @param {string|number} userId - ID пользователя
   * @returns {Promise<Object>} Результат операции
   */
  async unfollowUser(userId) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.delete(`/api/user/follow/${userId}`);
    } catch (error) {
      throw new Error(error.message || 'Ошибка отписки');
    }
  }

  /**
   * Получить публичный профиль пользователя
   * @param {string|number} userId - ID пользователя
   * @returns {Promise<Object>} Публичный профиль
   */
  async getPublicProfile(userId) {
    try {
      return await this.get(`/api/user/public/${userId}`);
    } catch (error) {
      throw new Error(error.message || 'Ошибка получения профиля');
    }
  }

  /**
   * Поиск пользователей
   * @param {string} query - Поисковый запрос
   * @param {number} limit - Количество результатов
   * @returns {Promise<Array>} Результаты поиска
   */
  async searchUsers(query, limit = 20) {
    try {
      const users = await this.get('/api/user/search', { 
        query, 
        limit 
      });
      return users.users || users;
    } catch (error) {
      throw new Error(error.message || 'Ошибка поиска пользователей');
    }
  }

  /**
   * Получить уведомления пользователя
   * @param {Object} options - Параметры запроса
   * @param {number} options.limit - Количество уведомлений
   * @param {number} options.offset - Смещение для пагинации
   * @param {boolean} options.unreadOnly - Только непрочитанные
   * @returns {Promise<Object>} Уведомления пользователя
   */
  async getNotifications(options = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      const { limit = 20, offset = 0, unreadOnly = false } = options;
      const params = { limit, offset };
      
      if (unreadOnly) {
        params.unread = true;
      }

      return await this.get('/api/user/notifications', params);
    } catch (error) {
      // Если эндпоинт не существует, возвращаем пустые уведомления
      return {
        notifications: [],
        total: 0,
        unreadCount: 0
      };
    }
  }

  /**
   * Отметить уведомление как прочитанное
   * @param {string|number} notificationId - ID уведомления
   * @returns {Promise<Object>} Результат операции
   */
  async markNotificationAsRead(notificationId) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.patch(`/api/user/notifications/${notificationId}/read`);
    } catch (error) {
      throw new Error(error.message || 'Ошибка обновления уведомления');
    }
  }

  /**
   * Отметить все уведомления как прочитанные
   * @returns {Promise<Object>} Результат операции
   */
  async markAllNotificationsAsRead() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.patch('/api/user/notifications/read-all');
    } catch (error) {
      throw new Error(error.message || 'Ошибка обновления уведомлений');
    }
  }
}

// Создаем и экспортируем единственный экземпляр
const userApi = new UserApi();
export default userApi;

