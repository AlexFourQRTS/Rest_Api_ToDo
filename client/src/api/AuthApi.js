import BaseApi from './BaseApi.js';

/**
 * API класс для аутентификации и управления пользователями
 * Наследует от BaseApi и добавляет специфичные методы для авторизации
 */
class AuthApi extends BaseApi {
  constructor() {
    super();
  }

  /**
   * Вход пользователя в систему
   * @param {Object} credentials - Данные для входа {email, password}
   * @returns {Promise<Object>} Данные пользователя
   */
  async login(credentials) {
    try {
      const data = await this.post('/api/auth/login', credentials);
      
      // Сохраняем токен если он есть
      if (data.tokens && data.tokens.accessToken) {
        this.setToken(data.tokens.accessToken);
      }
      
      return data.user;
    } catch (error) {
      throw new Error(error.message || 'Ошибка входа');
    }
  }

  /**
   * Регистрация нового пользователя
   * @param {Object} userData - Данные пользователя для регистрации
   * @returns {Promise<Object>} Данные созданного пользователя
   */
  async register(userData) {
    try {
      const data = await this.post('/api/auth/register', userData);
      
      // Сохраняем токен если он есть
      if (data.tokens && data.tokens.accessToken) {
        this.setToken(data.tokens.accessToken);
      }
      
      return data.user;
    } catch (error) {
      throw new Error(error.message || 'Ошибка регистрации');
    }
  }

  /**
   * Получить профиль текущего пользователя
   * @returns {Promise<Object|null>} Данные профиля или null
   */
  async getProfile() {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }

      return await this.get('/api/auth/profile');
    } catch (error) {
      // Если ошибка авторизации, удаляем токен
      if (error.message.includes('401') || error.message.includes('403')) {
        this.removeToken();
      }
      return null;
    }
  }

  /**
   * Выход пользователя из системы
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      if (this.isAuthenticated()) {
        await this.post('/api/auth/logout');
      }
    } catch (error) {
      // Игнорируем ошибки при выходе
    } finally {
      this.removeToken();
    }
  }

  /**
   * Обновить токен доступа
   * @returns {Promise<Object|null>} Новые данные токена или null
   */
  async refresh() {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }

      const data = await this.post('/api/auth/refresh');
      
      if (data.token) {
        this.setToken(data.token);
      }
      
      return data;
    } catch (error) {
      // Если не удалось обновить токен, выходим
      this.logout();
      return null;
    }
  }

  /**
   * Изменить пароль пользователя
   * @param {Object} passwords - Объект с паролями {currentPassword, newPassword}
   * @returns {Promise<Object>} Результат операции
   */
  async changePassword(passwords) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.post('/api/auth/change-password', passwords);
    } catch (error) {
      throw new Error(error.message || 'Ошибка изменения пароля');
    }
  }

  /**
   * Получить список всех пользователей (только для админов)
   * @returns {Promise<Array|null>} Список пользователей или null
   */
  async getAdminUsers() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.get('/api/auth/admin/users');
    } catch (error) {
      return null;
    }
  }

  /**
   * Получить пользователя по ID (только для админов)
   * @param {string|number} userId - ID пользователя
   * @returns {Promise<Object|null>} Данные пользователя или null
   */
  async getAdminUser(userId) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.get(`/api/auth/admin/users/${userId}`);
    } catch (error) {
      return null;
    }
  }

  /**
   * Обновить данные пользователя (только для админов)
   * @param {string|number} userId - ID пользователя
   * @param {Object} userData - Новые данные пользователя
   * @returns {Promise<Object>} Обновленные данные пользователя
   */
  async updateAdminUser(userId, userData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.patch(`/api/auth/admin/users/${userId}`, userData);
    } catch (error) {
      throw new Error(error.message || 'Ошибка обновления пользователя');
    }
  }

  /**
   * Удалить пользователя (только для админов)
   * @param {string|number} userId - ID пользователя
   * @returns {Promise<Object>} Результат операции
   */
  async deleteAdminUser(userId) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.delete(`/api/auth/admin/users/${userId}`);
    } catch (error) {
      throw new Error(error.message || 'Ошибка удаления пользователя');
    }
  }

  /**
   * Проверить права администратора
   * @returns {Promise<boolean>} true если пользователь админ
   */
  async isAdmin() {
    try {
      const profile = await this.getProfile();
      return profile && profile.role === 'admin';
    } catch (error) {
      return false;
    }
  }
}

// Создаем и экспортируем единственный экземпляр
const authApi = new AuthApi();
export default authApi;
