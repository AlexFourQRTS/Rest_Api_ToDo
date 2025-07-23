const express = require('express');
const GameController = require('../controllers/gameController');
const ErrorHandler = require('../middleware/errorHandler');
const RequestLogger = require('../middleware/requestLogger');

const router = express.Router();

// Middleware для валидации
const { validateConsoleId, validateFileName } = ErrorHandler;

/**
 * @swagger
 * /consoles/{consoleId}/games:
 *   get:
 *     summary: Получить список игр для консоли
 *     description: Возвращает список игр с поддержкой пагинации, сортировки и фильтрации
 *     tags: [Games]
 *     parameters:
 *       - $ref: '#/components/parameters/consoleId'
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - $ref: '#/components/parameters/sortBy'
 *       - $ref: '#/components/parameters/sortOrder'
 *       - $ref: '#/components/parameters/category'
 *       - $ref: '#/components/parameters/region'
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
 *                     $ref: '#/components/schemas/Game'
 *                 meta:
 *                   $ref: '#/components/schemas/Success/properties/meta'
 *       400:
 *         description: Неподдерживаемая консоль
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/consoles/:consoleId/games', 
  validateConsoleId,
  RequestLogger.rateLimiter(200, 15 * 60 * 1000), // 200 запросов в 15 минут
  ErrorHandler.asyncHandler(GameController.getGames)
);

/**
 * @swagger
 * /consoles/{consoleId}/games/search:
 *   get:
 *     summary: Поиск игр
 *     description: Поиск игр по названию в рамках конкретной консоли
 *     tags: [Games]
 *     parameters:
 *       - $ref: '#/components/parameters/consoleId'
 *       - $ref: '#/components/parameters/search'
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - $ref: '#/components/parameters/sortBy'
 *       - $ref: '#/components/parameters/sortOrder'
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
 *                     $ref: '#/components/schemas/Game'
 *                 meta:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Success/properties/meta'
 *                     - type: object
 *                       properties:
 *                         searchTerm:
 *                           type: string
 *                           example: mario
 *                         resultsCount:
 *                           type: number
 *                           example: 15
 *       400:
 *         description: Неподдерживаемая консоль или отсутствует поисковый запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/consoles/:consoleId/games/search',
  validateConsoleId,
  RequestLogger.rateLimiter(100, 15 * 60 * 1000), // 100 запросов в 15 минут
  ErrorHandler.asyncHandler(GameController.searchGames)
);

/**
 * @swagger
 * /consoles/{consoleId}/games/random:
 *   get:
 *     summary: Получить случайную игру
 *     description: Возвращает случайную игру для указанной консоли
 *     tags: [Games]
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
 *                   $ref: '#/components/schemas/Game'
 *       400:
 *         description: Неподдерживаемая консоль
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Игры не найдены
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/consoles/:consoleId/games/random',
  validateConsoleId,
  RequestLogger.rateLimiter(50, 15 * 60 * 1000), // 50 запросов в 15 минут
  ErrorHandler.asyncHandler(GameController.getRandomGame)
);

/**
 * @swagger
 * /consoles/{consoleId}/games/stats:
 *   get:
 *     summary: Получить статистику игр консоли
 *     description: Возвращает статистику игр для конкретной консоли
 *     tags: [Games]
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
 *                   $ref: '#/components/schemas/GameStats'
 *       400:
 *         description: Неподдерживаемая консоль
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/consoles/:consoleId/games/stats',
  validateConsoleId,
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorHandler.asyncHandler(GameController.getGameStats)
);

/**
 * @swagger
 * /consoles/{consoleId}/categories:
 *   get:
 *     summary: Получить категории игр
 *     description: Возвращает доступные категории игр для консоли
 *     tags: [Games]
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: action
 *                       name:
 *                         type: string
 *                         example: Action
 *                       keywords:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["action", "adventure", "arcade"]
 *       400:
 *         description: Неподдерживаемая консоль
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/consoles/:consoleId/categories',
  validateConsoleId,
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorHandler.asyncHandler(GameController.getGameCategories)
);

/**
 * @swagger
 * /consoles/{consoleId}/games/{fileName}:
 *   get:
 *     summary: Получить информацию об игре
 *     description: Возвращает детальную информацию о конкретной игре
 *     tags: [Games]
 *     parameters:
 *       - $ref: '#/components/parameters/consoleId'
 *       - $ref: '#/components/parameters/fileName'
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
 *                   allOf:
 *                     - $ref: '#/components/schemas/Game'
 *                     - type: object
 *                       properties:
 *                         fileSize:
 *                           type: number
 *                           example: 40960
 *                         lastModified:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-06-23T14:30:00.000Z
 *       400:
 *         description: Неподдерживаемая консоль или невалидный файл
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Игра не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/consoles/:consoleId/games/:fileName',
  validateConsoleId,
  validateFileName,
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorHandler.asyncHandler(GameController.getGame)
);

/**
 * @swagger
 * /consoles/{consoleId}/roms/{fileName}:
 *   get:
 *     summary: Скачать ROM файл
 *     description: Скачивает ROM файл игры
 *     tags: [Games]
 *     parameters:
 *       - $ref: '#/components/parameters/consoleId'
 *       - $ref: '#/components/parameters/fileName'
 *     responses:
 *       200:
 *         description: ROM файл
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Неподдерживаемая консоль или невалидный файл
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: ROM файл не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/consoles/:consoleId/roms/:fileName',
  validateConsoleId,
  validateFileName,
  RequestLogger.rateLimiter(50, 15 * 60 * 1000), // Ограничиваем скачивания
  ErrorHandler.asyncHandler(GameController.downloadGame)
);

/**
 * @swagger
 * /consoles/{consoleId}/images/{imageName}:
 *   get:
 *     summary: Получить изображение игры
 *     description: Возвращает изображение для игры
 *     tags: [Games]
 *     parameters:
 *       - $ref: '#/components/parameters/consoleId'
 *       - name: imageName
 *         in: path
 *         required: true
 *         description: Имя файла изображения
 *         schema:
 *           type: string
 *         example: Super Mario Bros.png
 *     responses:
 *       200:
 *         description: Изображение
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Неподдерживаемая консоль
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Изображение не найдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/consoles/:consoleId/images/:imageName',
  validateConsoleId,
  validateFileName,
  RequestLogger.rateLimiter(200, 15 * 60 * 1000),
  ErrorHandler.asyncHandler(GameController.getGameImage)
);

/**
 * @swagger
 * /consoles/{consoleId}/saves/{saveName}:
 *   get:
 *     summary: Получить файл сохранения
 *     description: Скачивает файл сохранения игры
 *     tags: [Games]
 *     parameters:
 *       - $ref: '#/components/parameters/consoleId'
 *       - name: saveName
 *         in: path
 *         required: true
 *         description: Имя файла сохранения
 *         schema:
 *           type: string
 *         example: Super Mario Bros.srm
 *     responses:
 *       200:
 *         description: Файл сохранения
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Неподдерживаемая консоль
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Файл сохранения не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/consoles/:consoleId/saves/:saveName',
  validateConsoleId,
  validateFileName,
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorHandler.asyncHandler(GameController.getGameSave)
);

module.exports = router; 