const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { getConsoleConfig, getConsolePath } = require('../config/consoles');
const GameUtils = require('../utils/gameUtils');
const ErrorMiddleware = require('../middleware/error');
const RequestLogger = require('../middleware/requestLogger');

const router = express.Router();

router.get('/consoles/:consoleId/games/:fileName',
  ErrorMiddleware.validateConsoleId,
  ErrorMiddleware.validateFileName,
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
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

    const game = GameUtils.createGameObject(fileName, consoleId, filePath);
    
    const stats = await fs.stat(filePath);
    game.fileSize = stats.size;
    game.lastModified = stats.mtime;
    
    res.json({ success: true, data: game });
  })
);

module.exports = router;
