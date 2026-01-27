const express = require('express');
const { getConsoleConfig } = require('../config/consoles');
const ErrorMiddleware = require('../middleware/error');
const RequestLogger = require('../middleware/requestLogger');

const router = express.Router();

router.get('/consoles/:consoleId/categories',
  ErrorMiddleware.validateConsoleId,
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorMiddleware.asyncHandler(async (req, res) => {
    const { consoleId } = req.params;
    const config = getConsoleConfig(consoleId);
    
    if (!config) {
      throw ErrorMiddleware.createError(`Console '${consoleId}' not supported`, 400);
    }

    const categories = Object.keys(config.categories).map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      keywords: config.categories[category]
    }));

    res.json({ success: true, data: categories });
  })
);

module.exports = router;
