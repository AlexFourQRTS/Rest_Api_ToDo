const logger = require('../utils/logger');

class RequestLogger {
  static logRequest(req, res, next) {
    const start = Date.now();
    
    logger.apiRequest(req.method, req.path, req.ip);

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

  static rateLimiter(limit = 100, windowMs = 15 * 60 * 1000) {
    const requests = new Map();

    return (req, res, next) => {
      const ip = req.ip;
      const now = Date.now();
      const windowStart = now - windowMs;

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

}

module.exports = RequestLogger; 