/**
 * Главный файл для экспорта всех API классов
 * Централизованный импорт всех API для удобства использования
 */

// Импортируем все API классы
import authApi from './AuthApi.js';
import blogApi from './BlogApi.js';
import fileApi from './FileApi.js';
import userApi from './UserApi.js';

// Экспортируем все API
export {
  authApi,
  blogApi,
  fileApi,
  userApi
};

// Экспортируем по умолчанию объект со всеми API
export default {
  auth: authApi,
  blog: blogApi,
  file: fileApi,
  user: userApi
};
