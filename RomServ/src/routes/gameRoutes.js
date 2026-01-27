const express = require('express');
const GameController = require('../controllers/gameController');
const ErrorHandler = require('../middleware/errorHandler');
const RequestLogger = require('../middleware/requestLogger');

const router = express.Router();

// Middleware для валидации
const { validateConsoleId, validateFileName } = ErrorHandler;


router.get('/consoles/:consoleId/games', 
  validateConsoleId,
  RequestLogger.rateLimiter(200, 15 * 60 * 1000), // 200 запросов в 15 минут
  ErrorHandler.asyncHandler(GameController.getGames)
);


router.get('/consoles/:consoleId/games/search',
  validateConsoleId,
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorHandler.asyncHandler(GameController.searchGames)
);


router.get('/consoles/:consoleId/categories',
  validateConsoleId,
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorHandler.asyncHandler(GameController.getGameCategories)
);


router.get('/consoles/:consoleId/games/:fileName',
  validateConsoleId,
  validateFileName,
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorHandler.asyncHandler(GameController.getGame)
);


router.get('/consoles/:consoleId/roms/:fileName',
  validateConsoleId,
  validateFileName,
  RequestLogger.rateLimiter(50, 15 * 60 * 1000),
  ErrorHandler.asyncHandler(GameController.downloadGame)
);

module.exports = router; 