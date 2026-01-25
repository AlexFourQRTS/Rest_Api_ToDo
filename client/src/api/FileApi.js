import BaseApi from './BaseApi.js';


class FileApi extends BaseApi {
  constructor() {
    super();
  }


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

