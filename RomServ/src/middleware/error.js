const logger = require('../utils/logger');

class ErrorMiddleware {
  static handleError(err, req, res, next) {
    const error = {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      ip: req.ip
    };

    logger.error('API Error', { method: req.method, path: req.path, error: err.message, ip: req.ip, status: error.status });

    if (process.env.NODE_ENV === 'development') {
      error.stack = err.stack;
    }

    res.status(error.status).json({
      success: false,
      error: error
    });
  }

  static handleNotFound(req, res, next) {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.status = 404;
    next(error);
  }

  static validateConsoleId(req, res, next) {
    const { consoleId } = req.params;
    
    if (!consoleId) {
      const error = new Error('Console ID is required');
      error.status = 400;
      return next(error);
    }

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

  static validateFileName(req, res, next) {
    const { fileName } = req.params;
    
    if (!fileName) {
      const error = new Error('File name is required');
      error.status = 400;
      return next(error);
    }

    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      const error = new Error('Invalid file name');
      error.status = 400;
      return next(error);
    }

    next();
  }

  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  static createError(message, status = 500) {
    const error = new Error(message);
    error.status = status;
    return error;
  }
}

module.exports = ErrorMiddleware;
