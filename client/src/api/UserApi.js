import BaseApi from './BaseApi.js';

class UserApi extends BaseApi {
  constructor() {
    super();
  }


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


  async getPublicProfile(userId) {
    try {
      return await this.get(`/api/user/public/${userId}`);
    } catch (error) {
      throw new Error(error.message || 'Ошибка получения профиля');
    }
  }


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

