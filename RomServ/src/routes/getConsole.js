const express = require('express');
const { getConsoleConfig } = require('../config/consoles');
const ErrorMiddleware = require('../middleware/error');
const RequestLogger = require('../middleware/requestLogger');

const router = express.Router();

router.get('/consoles/:consoleId',
  ErrorMiddleware.validateConsoleId,
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorMiddleware.asyncHandler(async (req, res) => {
    const { consoleId } = req.params;
    const config = getConsoleConfig(consoleId);
    
    if (!config) {
      throw ErrorMiddleware.createError(`Console '${consoleId}' not supported`, 404);
    }

    const consoleInfo = {
      id: consoleId,
      name: config.name,
      shortName: config.shortName,
      folder: config.folder,
      extensions: config.extensions,
      imageExtensions: config.imageExtensions,
      saveExtensions: config.saveExtensions,
      maxFileSize: config.maxFileSize,
      supportedRegions: config.supportedRegions,
      categories: Object.keys(config.categories)
    };

    res.json({ success: true, data: consoleInfo });
  })
);

module.exports = router;
