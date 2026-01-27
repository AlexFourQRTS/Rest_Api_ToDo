const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { getConsoleConfig, getConsolePath } = require('../config/consoles');
const GameUtils = require('../utils/gameUtils');
const logger = require('../utils/logger');
const ErrorMiddleware = require('../middleware/error');
const RequestLogger = require('../middleware/requestLogger');

const router = express.Router();

router.get('/consoles/:consoleId/roms/:fileName',
  ErrorMiddleware.validateConsoleId,
  ErrorMiddleware.validateFileName,
  RequestLogger.rateLimiter(50, 15 * 60 * 1000),
  ErrorMiddleware.asyncHandler(async (req, res) => {
    const { consoleId, fileName } = req.params;
    const config = getConsoleConfig(consoleId);
    
    if (!config) {
      throw ErrorMiddleware.createError(`Console '${consoleId}' not supported`, 400);
    }

    const consolePath = getConsolePath(consoleId);
    const filePath = path.join(consolePath, fileName);

    try {
      await fs.access(filePath);
    } catch (error) {
      throw ErrorMiddleware.createError(`Game file '${fileName}' not found`, 404);
    }

    if (!GameUtils.isValidRomFile(fileName, consoleId)) {
      throw ErrorMiddleware.createError(`File '${fileName}' is not a valid ROM for ${config.name}`, 400);
    }

    logger.gameRequest(consoleId, 'download', fileName);
    
    res.download(filePath, fileName);
  })
);

module.exports = router;
