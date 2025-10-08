/**
 * Базовый класс для всех API
 * Содержит общие методы для работы с HTTP запросами
 */
class BaseApi {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL;
    this.apiURL = `${this.baseURL}/api`;
  }

  /**
   * Получить токен из localStorage
   * @returns {string|null} Токен или null
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Сохранить токен в localStorage
   * @param {string} token - Токен для сохранения
   */
  setToken(token) {
    localStorage.setItem('token', token);
  }

  /**
   * Удалить токен из localStorage
   */
  removeToken() {
    localStorage.removeItem('token');
  }

  /**
   * Проверить авторизован ли пользователь
   * @returns {boolean} true если авторизован
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Получить заголовки для запроса
   * @param {Object} additionalHeaders - Дополнительные заголовки
   * @returns {Object} Объект с заголовками
   */
  getHeaders(additionalHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...additionalHeaders
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Выполнить HTTP запрос
   * @param {string} url - URL для запроса
   * @param {Object} options - Опции для fetch
   * @returns {Promise<Object>} Ответ сервера
   */
  async request(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(options.headers)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      // Если ответ пустой, возвращаем success
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { success: true };
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Ошибка сети');
    }
  }

  /**
   * GET запрос
   * @param {string} endpoint - Конечная точка
   * @param {Object} params - Параметры запроса
   * @returns {Promise<Object>} Ответ сервера
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${this.apiURL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    return this.request(url.toString(), {
      method: 'GET'
    });
  }

  /**
   * POST запрос
   * @param {string} endpoint - Конечная точка
   * @param {Object} data - Данные для отправки
   * @returns {Promise<Object>} Ответ сервера
   */
  async post(endpoint, data = {}) {
    return this.request(`${this.apiURL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT запрос
   * @param {string} endpoint - Конечная точка
   * @param {Object} data - Данные для отправки
   * @returns {Promise<Object>} Ответ сервера
   */
  async put(endpoint, data = {}) {
    return this.request(`${this.apiURL}${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * PATCH запрос
   * @param {string} endpoint - Конечная точка
   * @param {Object} data - Данные для отправки
   * @returns {Promise<Object>} Ответ сервера
   */
  async patch(endpoint, data = {}) {
    return this.request(`${this.apiURL}${endpoint}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE запрос
   * @param {string} endpoint - Конечная точка
   * @returns {Promise<Object>} Ответ сервера
   */
  async delete(endpoint) {
    return this.request(`${this.apiURL}${endpoint}`, {
      method: 'DELETE'
    });
  }
}

export default BaseApi;
