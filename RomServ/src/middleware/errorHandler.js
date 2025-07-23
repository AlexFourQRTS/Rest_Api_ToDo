const logger = require('../utils/logger');

class ErrorHandler {
  /**
   * Middleware для обработки ошибок
   */
  static handleError(err, req, res, next) {
    const error = {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      ip: req.ip
    };

    // Логируем ошибку
    logger.apiError(req.method, req.path, err, req.ip);

    // В режиме разработки добавляем stack trace
    if (process.env.NODE_ENV === 'development') {
      error.stack = err.stack;
    }

    res.status(error.status).json({
      success: false,
      error: error
    });
  }

  /**
   * Middleware для обработки 404 ошибок
   */
  static handleNotFound(req, res, next) {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.status = 404;
    next(error);
  }

  /**
   * Middleware для валидации параметров
   */
  static validateConsoleId(req, res, next) {
    const { consoleId } = req.params;
    
    if (!consoleId) {
      const error = new Error('Console ID is required');
      error.status = 400;
      return next(error);
    }

    // Проверяем, поддерживается ли консоль
    const { getConsoleConfig } = require('../config/consoles');
    const config = getConsoleConfig(consoleId);
    
    if (!config) {
      const error = new Error(`Console '${consoleId}' is not supported`);
      error.status = 400;
      return next(error);
    }

    req.consoleConfig = config;
    next();
  }

  /**
   * Middleware для валидации имени файла
   */
  static validateFileName(req, res, next) {
    const { fileName } = req.params;
    
    if (!fileName) {
      const error = new Error('File name is required');
      error.status = 400;
      return next(error);
    }

    // Проверяем на потенциально опасные символы
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      const error = new Error('Invalid file name');
      error.status = 400;
      return next(error);
    }

    next();
  }

  /**
   * Middleware для ограничения размера файлов
   */
  static validateFileSize(req, res, next) {
    const { consoleId } = req.params;
    const { getConsoleConfig } = require('../config/consoles');
    const config = getConsoleConfig(consoleId);

    if (config && req.file) {
      if (req.file.size > config.maxFileSize) {
        const error = new Error(`File size exceeds maximum allowed size of ${config.maxFileSize} bytes`);
        error.status = 413;
        return next(error);
      }
    }

    next();
  }

  /**
   * Middleware для обработки асинхронных ошибок
   */
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * Создает кастомную ошибку
   */
  static createError(message, status = 500) {
    const error = new Error(message);
    error.status = status;
    return error;
  }
}

module.exports = ErrorHandler; 