const fs = require('fs').promises;
const path = require('path');
const { getConsoleConfig, getConsolePath } = require('../config/consoles');
const GameUtils = require('../utils/gameUtils');
const logger = require('../utils/logger');
const ErrorHandler = require('../middleware/errorHandler');

class GameService {
  /**
   * Получает список всех игр для конкретной консоли
   */
  static async getGames(consoleId, options = {}) {
    try {
      const config = getConsoleConfig(consoleId);
      if (!config) {
        throw ErrorHandler.createError(`Console '${consoleId}' not supported`, 400);
      }

      const consolePath = getConsolePath(consoleId);
      const files = await fs.readdir(consolePath);
      
      // Фильтруем только ROM файлы
      const romFiles = files.filter(file => GameUtils.isValidRomFile(file, consoleId));
      
      // Создаем объекты игр
      let games = romFiles.map(fileName => {
        const filePath = path.join(consolePath, fileName);
        return GameUtils.createGameObject(fileName, consoleId, filePath);
      });

      // Проверяем наличие изображений и файлов сохранения
      games = await this.enrichGamesWithMetadata(games, consolePath, files);

      // Применяем фильтры
      if (options.filters) {
        games = GameUtils.filterGames(games, options.filters);
      }

      // Применяем сортировку
      const sortBy = options.sortBy || 'name';
      const sortOrder = options.sortOrder || 'asc';
      games = GameUtils.sortGames(games, sortBy, sortOrder);

      // Применяем пагинацию
      if (options.page && options.limit) {
        const page = parseInt(options.page) || 1;
        const limit = parseInt(options.limit) || 50;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        games = games.slice(startIndex, endIndex);
      }

      logger.gameRequest(consoleId, 'list', null);
      
      return {
        success: true,
        data: games,
        meta: {
          total: romFiles.length,
          console: consoleId,
          consoleName: config.name
        }
      };

    } catch (error) {
      logger.gameError(consoleId, 'list', error);
      throw error;
    }
  }

  /**
   * Получает конкретную игру по имени файла
   */
  static async getGame(consoleId, fileName) {
    try {
      const config = getConsoleConfig(consoleId);
      if (!config) {
        throw ErrorHandler.createError(`Console '${consoleId}' not supported`, 400);
      }

      const consolePath = getConsolePath(consoleId);
      const filePath = path.join(consolePath, fileName);

      // Проверяем существование файла
      try {
        await fs.access(filePath);
      } catch (error) {
        throw ErrorHandler.createError(`Game file '${fileName}' not found`, 404);
      }

      // Проверяем, что это валидный ROM файл
      if (!GameUtils.isValidRomFile(fileName, consoleId)) {
        throw ErrorHandler.createError(`File '${fileName}' is not a valid ROM for ${config.name}`, 400);
      }

      const game = GameUtils.createGameObject(fileName, consoleId, filePath);
      
      // Получаем метаданные файла
      const stats = await fs.stat(filePath);
      game.fileSize = stats.size;
      game.lastModified = stats.mtime;

      logger.gameRequest(consoleId, 'get', fileName);
      
      return {
        success: true,
        data: game
      };

    } catch (error) {
      logger.gameError(consoleId, 'get', error, fileName);
      throw error;
    }
  }

  /**
   * Получает файл игры для скачивания
   */
  static async getGameFile(consoleId, fileName) {
    try {
      const config = getConsoleConfig(consoleId);
      if (!config) {
        throw ErrorHandler.createError(`Console '${consoleId}' not supported`, 400);
      }

      const consolePath = getConsolePath(consoleId);
      const filePath = path.join(consolePath, fileName);

      // Проверяем существование файла
      try {
        await fs.access(filePath);
      } catch (error) {
        throw ErrorHandler.createError(`Game file '${fileName}' not found`, 404);
      }

      // Проверяем, что это валидный ROM файл
      if (!GameUtils.isValidRomFile(fileName, consoleId)) {
        throw ErrorHandler.createError(`File '${fileName}' is not a valid ROM for ${config.name}`, 400);
      }

      logger.gameRequest(consoleId, 'download', fileName);
      
      return {
        success: true,
        filePath,
        fileName,
        consoleId
      };

    } catch (error) {
      logger.gameError(consoleId, 'download', error, fileName);
      throw error;
    }
  }

  /**
   * Получает статистику по играм
   */
  static async getGameStats(consoleId = null) {
    try {
      const { getAllConsoles } = require('../config/consoles');
      const consoles = consoleId ? [consoleId] : getAllConsoles().map(c => c.id);
      
      let allGames = [];
      
      for (const cId of consoles) {
        try {
          const result = await this.getGames(cId);
          allGames = allGames.concat(result.data);
        } catch (error) {
          logger.warn(`Failed to get games for console ${cId}`, { error: error.message });
        }
      }

      const stats = GameUtils.getGameStats(allGames);
      
      return {
        success: true,
        data: stats
      };

    } catch (error) {
      logger.error('Failed to get game stats', { error: error.message });
      throw error;
    }
  }

  /**
   * Получает категории игр
   */
  static async getGameCategories(consoleId) {
    try {
      const config = getConsoleConfig(consoleId);
      if (!config) {
        throw ErrorHandler.createError(`Console '${consoleId}' not supported`, 400);
      }

      const categories = Object.keys(config.categories).map(category => ({
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        keywords: config.categories[category]
      }));

      return {
        success: true,
        data: categories
      };

    } catch (error) {
      logger.error('Failed to get game categories', { error: error.message });
      throw error;
    }
  }

  /**
   * Обогащает игры метаданными (изображения, сохранения)
   */
  static async enrichGamesWithMetadata(games, consolePath, allFiles) {
    const fileSet = new Set(allFiles);
    
    return games.map(game => {
      const baseName = path.parse(game.fileName).name;
      
      // Проверяем наличие изображения
      for (const ext of ['.png', '.jpg', '.jpeg']) {
        if (fileSet.has(baseName + ext)) {
          game.hasImage = true;
          game.imagePath = `romserv/api/v1/consoles/${game.console}/images/${encodeURIComponent(baseName + ext)}`;
          break;
        }
      }
      
      // Проверяем наличие файла сохранения
      const config = getConsoleConfig(game.console);
      if (config) {
        for (const ext of config.saveExtensions) {
          if (fileSet.has(baseName + ext)) {
            game.hasSave = true;
            game.savePath = `romserv/api/v1/consoles/${game.console}/saves/${encodeURIComponent(baseName + ext)}`;
            break;
          }
        }
      }
      
      return game;
    });
  }

  /**
   * Поиск игр по названию
   */
  static async searchGames(consoleId, searchTerm, options = {}) {
    try {
      const result = await this.getGames(consoleId, {
        ...options,
        filters: { search: searchTerm }
      });

      return {
        success: true,
        data: result.data,
        meta: {
          ...result.meta,
          searchTerm,
          resultsCount: result.data.length
        }
      };

    } catch (error) {
      logger.error('Failed to search games', { error: error.message });
      throw error;
    }
  }

  /**
   * Получает случайную игру
   */
  static async getRandomGame(consoleId) {
    try {
      const result = await this.getGames(consoleId);
      
      if (result.data.length === 0) {
        throw ErrorHandler.createError('No games found for this console', 404);
      }

      const randomIndex = Math.floor(Math.random() * result.data.length);
      const randomGame = result.data[randomIndex];

      return {
        success: true,
        data: randomGame
      };

    } catch (error) {
      logger.error('Failed to get random game', { error: error.message });
      throw error;
    }
  }
}

module.exports = GameService; 