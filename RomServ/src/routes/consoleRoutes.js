const express = require('express');
const ConsoleController = require('../controllers/consoleController');
const ErrorHandler = require('../middleware/errorHandler');
const RequestLogger = require('../middleware/requestLogger');

const router = express.Router();

// Middleware для валидации
const { validateConsoleId } = ErrorHandler;

router.get('/consoles',
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorHandler.asyncHandler(ConsoleController.getConsoles)
);


router.get('/consoles/:consoleId',
  validateConsoleId,
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorHandler.asyncHandler(ConsoleController.getConsole)
);

router.get('/health',
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorHandler.asyncHandler(ConsoleController.healthCheck)
);

module.exports = router; 