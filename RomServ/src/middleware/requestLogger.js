const logger = require('../utils/logger');

class RequestLogger {
  static logRequest(req, res, next) {
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
        logger.error('Rate limit exceeded', { ip, path: req.path, method: req.method });
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