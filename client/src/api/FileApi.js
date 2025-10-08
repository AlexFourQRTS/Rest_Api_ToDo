import BaseApi from './BaseApi.js';

/**
 * API класс для работы с файлами и файловым хранилищем
 * Наследует от BaseApi и добавляет методы для управления файлами
 */
class FileApi extends BaseApi {
  constructor() {
    super();
  }

  /**
   * Получить список файлов пользователя
   * @param {Object} options - Параметры запроса
   * @param {number} options.limit - Количество файлов на странице
   * @param {number} options.offset - Смещение для пагинации
   * @param {string} options.type - Тип файла для фильтрации
   * @param {string} options.search - Поисковый запрос
   * @returns {Promise<Object>} Объект с данными файлов и пагинацией
   */
  async getFiles(options = {}) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      const {
        limit = 20,
        offset = 0,
        type = 'all',
        search = ''
      } = options;

      const params = {
        limit,
        page: Math.floor(offset / limit) + 1
      };

      if (type !== 'all') {
        params.type = type;
      }

      if (search) {
        params.search = search;
      }

      return await this.get('/api/files', params);
    } catch (error) {
      throw new Error(error.message || 'Ошибка получения файлов');
    }
  }

  /**
   * Загрузить файл на сервер
   * @param {File} file - Файл для загрузки
   * @param {Object} metadata - Метаданные файла
   * @param {Function} onProgress - Callback для отслеживания прогресса
   * @returns {Promise<Object>} Данные загруженного файла
   */
  async uploadFile(file, metadata = {}, onProgress = null) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      const formData = new FormData();
      formData.append('file', file);
      
      // Добавляем метаданные
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key]);
      });

      const token = this.getToken();
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Убираем Content-Type для FormData (браузер установит автоматически)
      delete headers['Content-Type'];

      const response = await fetch(`${this.apiURL}/api/files/upload`, {
        method: 'POST',
        headers,
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Ошибка загрузки файла');
    }
  }

  /**
   * Загрузить несколько файлов одновременно
   * @param {FileList|Array} files - Список файлов
   * @param {Object} metadata - Метаданные для всех файлов
   * @param {Function} onProgress - Callback для отслеживания прогресса
   * @returns {Promise<Array>} Массив загруженных файлов
   */
  async uploadMultipleFiles(files, metadata = {}, onProgress = null) {
    try {
      const uploadPromises = Array.from(files).map((file, index) => {
        const fileMetadata = {
          ...metadata,
          order: index
        };
        return this.uploadFile(file, fileMetadata, onProgress);
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new Error(error.message || 'Ошибка загрузки файлов');
    }
  }

  /**
   * Скачать файл
   * @param {string|number} fileId - ID файла
   * @returns {Promise<Blob>} Файл в виде Blob
   */
  async downloadFile(fileId) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      const token = this.getToken();
      const response = await fetch(`${this.apiURL}/api/files/${fileId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      throw new Error(error.message || 'Ошибка скачивания файла');
    }
  }

  /**
   * Получить информацию о файле
   * @param {string|number} fileId - ID файла
   * @returns {Promise<Object>} Информация о файле
   */
  async getFileInfo(fileId) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.get(`/api/files/${fileId}`);
    } catch (error) {
      throw new Error(error.message || 'Ошибка получения информации о файле');
    }
  }

  /**
   * Обновить метаданные файла
   * @param {string|number} fileId - ID файла
   * @param {Object} metadata - Новые метаданные
   * @returns {Promise<Object>} Обновленная информация о файле
   */
  async updateFileMetadata(fileId, metadata) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.patch(`/api/files/${fileId}`, metadata);
    } catch (error) {
      throw new Error(error.message || 'Ошибка обновления файла');
    }
  }

  /**
   * Удалить файл
   * @param {string|number} fileId - ID файла
   * @returns {Promise<Object>} Результат операции
   */
  async deleteFile(fileId) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.delete(`/api/files/${fileId}`);
    } catch (error) {
      throw new Error(error.message || 'Ошибка удаления файла');
    }
  }

  /**
   * Получить превью файла (для изображений)
   * @param {string|number} fileId - ID файла
   * @param {Object} options - Опции превью
   * @param {number} options.width - Ширина превью
   * @param {number} options.height - Высота превью
   * @returns {Promise<string>} URL превью
   */
  async getFilePreview(fileId, options = {}) {
    try {
      const { width = 200, height = 200 } = options;
      const params = { width, height };
      
      const url = new URL(`${this.apiURL}/api/files/${fileId}/preview`);
      Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
      });

      return url.toString();
    } catch (error) {
      throw new Error(error.message || 'Ошибка получения превью');
    }
  }

  /**
   * Получить статистику файлов пользователя
   * @returns {Promise<Object>} Статистика файлов
   */
  async getFileStats() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.get('/api/files/stats');
    } catch (error) {
      // Если эндпоинт не существует, возвращаем базовую статистику
      const files = await this.getFiles({ limit: 1000 });
      return {
        totalFiles: files.total || files.length || 0,
        totalSize: 0,
        fileTypes: {}
      };
    }
  }

  /**
   * Поиск файлов
   * @param {string} query - Поисковый запрос
   * @param {number} limit - Количество результатов
   * @returns {Promise<Array>} Результаты поиска
   */
  async searchFiles(query, limit = 20) {
    try {
      const files = await this.getFiles({ 
        search: query, 
        limit 
      });
      return files.files || files;
    } catch (error) {
      throw new Error(error.message || 'Ошибка поиска файлов');
    }
  }

  /**
   * Получить файлы по типу
   * @param {string} type - Тип файла (image, video, audio, document)
   * @param {number} limit - Количество файлов
   * @param {number} offset - Смещение для пагинации
   * @returns {Promise<Object>} Файлы указанного типа
   */
  async getFilesByType(type, limit = 20, offset = 0) {
    try {
      return await this.getFiles({ 
        type, 
        limit, 
        offset 
      });
    } catch (error) {
      throw new Error(error.message || 'Ошибка получения файлов по типу');
    }
  }

  /**
   * Создать папку
   * @param {string} name - Название папки
   * @param {string} parentId - ID родительской папки (опционально)
   * @returns {Promise<Object>} Созданная папка
   */
  async createFolder(name, parentId = null) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      const data = { name };
      if (parentId) {
        data.parentId = parentId;
      }

      return await this.post('/api/files/folders', data);
    } catch (error) {
      throw new Error(error.message || 'Ошибка создания папки');
    }
  }

  /**
   * Получить структуру папок
   * @returns {Promise<Array>} Дерево папок
   */
  async getFolderStructure() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Не авторизован');
      }

      return await this.get('/api/files/folders');
    } catch (error) {
      // Если эндпоинт не существует, возвращаем пустую структуру
      return [];
    }
  }
}

// Создаем и экспортируем единственный экземпляр
const fileApi = new FileApi();
export default fileApi;

