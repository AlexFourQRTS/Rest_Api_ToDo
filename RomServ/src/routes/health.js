const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { getAllConsoles } = require('../config/consoles');
const ErrorMiddleware = require('../middleware/error');
const RequestLogger = require('../middleware/requestLogger');

const router = express.Router();

router.get('/health',
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorMiddleware.asyncHandler(async (req, res) => {
    const consoles = getAllConsoles();
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      consoles: {}
    };

    for (const console of consoles) {
      try {
        const consolePath = path.join(process.cwd(), console.folder);
        await fs.access(consolePath);
        healthStatus.consoles[console.id] = {
          status: 'available',
          path: consolePath
        };
      } catch (error) {
        healthStatus.consoles[console.id] = {
          status: 'unavailable',
          error: error.message
        };
        healthStatus.status = 'degraded';
      }
    }

    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json({ success: true, data: healthStatus });
  })
);

module.exports = router;
