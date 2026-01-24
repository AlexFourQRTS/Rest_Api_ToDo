const logger = require('../utils/logger');

class RequestLogger {
  /**
   * Middleware для логирования запросов
   */
  static logRequest(req, res, next) {
    const start = Date.now();
    
    // Логируем входящий запрос
    logger.apiRequest(req.method, req.path, req.ip);

    // Перехватываем завершение ответа для логирования времени выполнения
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logData = {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      };

      if (res.statusCode >= 400) {
        logger.warn(`Request completed with status ${res.statusCode}`, logData);
      } else {
        logger.info(`Request completed successfully`, logData);
      }
    });

    next();
  }

  /**
   * Middleware для ограничения скорости запросов (rate limiting)
   */
  static rateLimiter(limit = 100, windowMs = 15 * 60 * 1000) {
    const requests = new Map();

    return (req, res, next) => {
      const ip = req.ip;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Очищаем старые записи
      if (requests.has(ip)) {
        requests.set(ip, requests.get(ip).filter(timestamp => timestamp > windowStart));
      } else {
        requests.set(ip, []);
      }

      const userRequests = requests.get(ip);

      if (userRequests.length >= limit) {
        logger.warn(`Rate limit exceeded for IP: ${ip}`);
        return res.status(429).json({
          success: false,
          error: {
            message: 'Too many requests',
            status: 429,
            retryAfter: Math.ceil(windowMs / 1000)
          }
        });
      }

      userRequests.push(now);
      next();
    };
  }

  /**
   * Middleware для проверки API ключа (если потребуется в будущем)
   */
  static requireApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    
    if (!apiKey) {
      logger.warn(`API request without key from IP: ${req.ip}`);
      return res.status(401).json({
        success: false,
        error: {
          message: 'API key required',
          status: 401
        }
      });
    }

    // Здесь можно добавить валидацию API ключа
    // Пока просто пропускаем
    next();
  }

  /**
   * Middleware для добавления CORS заголовков
   */
  static corsHeaders(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  }
}

module.exports = RequestLogger; 