const express = require('express');
const ConsoleController = require('../controllers/consoleController');
const ErrorHandler = require('../middleware/errorHandler');
const RequestLogger = require('../middleware/requestLogger');

const router = express.Router();

// Middleware для валидации
const { validateConsoleId } = ErrorHandler;

/**
 * @swagger
 * /api/v1/consoles:
 *   get:
 *     summary: Получить список всех поддерживаемых консолей
 *     description: Возвращает список всех доступных консолей с их статистикой
 *     tags: [Consoles]
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Console'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       example: 7
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/consoles',
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorHandler.asyncHandler(ConsoleController.getConsoles)
);

/**
 * @swagger
 * /api/v1/consoles/{consoleId}:
 *   get:
 *     summary: Получить информацию о конкретной консоли
 *     description: Возвращает детальную информацию о консоли и статистику игр
 *     tags: [Consoles]
 *     parameters:
 *       - $ref: '#/components/parameters/consoleId'
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: nes
 *                     name:
 *                       type: string
 *                       example: Nintendo Entertainment System
 *                     shortName:
 *                       type: string
 *                       example: NES
 *                     folder:
 *                       type: string
 *                       example: Games/NES
 *                     extensions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [".nes"]
 *                     imageExtensions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [".png", ".jpg", ".jpeg"]
 *                     saveExtensions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [".srm"]
 *                     maxFileSize:
 *                       type: number
 *                       example: 2097152
 *                     supportedRegions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["USA", "Europe", "Japan", "Asia"]
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["action", "puzzle", "sports", "rpg", "platform", "strategy"]
 *                     stats:
 *                       $ref: '#/components/schemas/GameStats'
 *       400:
 *         description: Неподдерживаемая консоль
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Консоль не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/consoles/:consoleId',
  validateConsoleId,
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorHandler.asyncHandler(ConsoleController.getConsole)
);

/**
 * @swagger
 * /api/v1/stats:
 *   get:
 *     summary: Получить глобальную статистику
 *     description: Возвращает общую статистику по всем консолям и играм
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/GameStats'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/stats',
  RequestLogger.rateLimiter(50, 15 * 60 * 1000),
  ErrorHandler.asyncHandler(ConsoleController.getGlobalStats)
);

/**
 * @swagger
 * /api/v1/system/info:
 *   get:
 *     summary: Получить информацию о системе
 *     description: Возвращает техническую информацию о сервере
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     platform:
 *                       type: string
 *                       example: linux
 *                     arch:
 *                       type: string
 *                       example: x64
 *                     nodeVersion:
 *                       type: string
 *                       example: v18.17.0
 *                     uptime:
 *                       type: number
 *                       example: 3600
 *                     memory:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                           example: 8589934592
 *                         free:
 *                           type: number
 *                           example: 4294967296
 *                         used:
 *                           type: number
 *                           example: 4294967296
 *                     cpus:
 *                       type: number
 *                       example: 8
 *                     hostname:
 *                       type: string
 *                       example: server-01
 *                     loadAverage:
 *                       type: array
 *                       items:
 *                         type: number
 *                       example: [1.5, 1.2, 0.8]
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/system/info',
  RequestLogger.rateLimiter(30, 15 * 60 * 1000), // Ограничиваем системную информацию
  ErrorHandler.asyncHandler(ConsoleController.getSystemInfo)
);

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Проверка здоровья системы
 *     description: Проверяет состояние сервера и доступность всех консолей
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Система здорова
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: healthy
 *                       enum: [healthy, degraded]
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-06-23T14:30:00.000Z
 *                     version:
 *                       type: string
 *                       example: 1.0.0
 *                     consoles:
 *                       type: object
 *                       additionalProperties:
 *                         type: object
 *                         properties:
 *                           status:
 *                             type: string
 *                             enum: [available, unavailable]
 *                           path:
 *                             type: string
 *                           error:
 *                             type: string
 *       503:
 *         description: Система нездорова
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: degraded
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     version:
 *                       type: string
 *                     consoles:
 *                       type: object
 */
router.get('/health',
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorHandler.asyncHandler(ConsoleController.healthCheck)
);

module.exports = router; 