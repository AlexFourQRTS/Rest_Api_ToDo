const GameService = require('../services/gameService');
const ErrorHandler = require('../middleware/errorHandler');
const logger = require('../utils/logger');

class GameController {
  /**
   * Получает список всех игр для консоли
   */
  static async getGames(req, res, next) {
    try {
      const { consoleId } = req.params;
      const { 
        page, 
        limit, 
        sortBy, 
        sortOrder, 
        category, 
        region, 
        search 
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        filters: {}
      };

      if (category) options.filters.category = category;
      if (region) options.filters.region = region;
      if (search) options.filters.search = search;

      const result = await GameService.getGames(consoleId, options);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получает конкретную игру
   */
  static async getGame(req, res, next) {
    try {
      const { consoleId, fileName } = req.params;
      const result = await GameService.getGame(consoleId, fileName);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Скачивает файл игры
   */
  static async downloadGame(req, res, next) {
    try {
      const { consoleId, fileName } = req.params;
      const result = await GameService.getGameFile(consoleId, fileName);
      
      // Отправляем файл
      res.download(result.filePath, result.fileName);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получает изображение игры
   */
  static async getGameImage(req, res, next) {
    try {
      const { consoleId, imageName } = req.params;
      const { getConsolePath } = require('../config/consoles');
      
      const consolePath = getConsolePath(consoleId);
      const imagePath = path.join(consolePath, imageName);

      // Проверяем существование файла
      const fs = require('fs');
      if (!fs.existsSync(imagePath)) {
        throw ErrorHandler.createError('Image not found', 404);
      }

      // Отправляем изображение
      res.sendFile(imagePath);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получает файл сохранения игры
   */
  static async getGameSave(req, res, next) {
    try {
      const { consoleId, saveName } = req.params;
      const { getConsolePath } = require('../config/consoles');
      
      const consolePath = getConsolePath(consoleId);
      const savePath = path.join(consolePath, saveName);

      // Проверяем существование файла
      const fs = require('fs');
      if (!fs.existsSync(savePath)) {
        throw ErrorHandler.createError('Save file not found', 404);
      }

      // Отправляем файл сохранения
      res.download(savePath, saveName);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Поиск игр
   */
  static async searchGames(req, res, next) {
    try {
      const { consoleId } = req.params;
      const { q: searchTerm, page, limit, sortBy, sortOrder } = req.query;

      if (!searchTerm) {
        throw ErrorHandler.createError('Search term is required', 400);
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      };

      const result = await GameService.searchGames(consoleId, searchTerm, options);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получает случайную игру
   */
  static async getRandomGame(req, res, next) {
    try {
      const { consoleId } = req.params;
      const result = await GameService.getRandomGame(consoleId);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получает статистику игр
   */
  static async getGameStats(req, res, next) {
    try {
      const { consoleId } = req.params;
      const result = await GameService.getGameStats(consoleId);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получает категории игр
   */
  static async getGameCategories(req, res, next) {
    try {
      const { consoleId } = req.params;
      const result = await GameService.getGameCategories(consoleId);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GameController; 