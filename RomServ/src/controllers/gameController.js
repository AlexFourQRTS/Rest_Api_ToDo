const GameService = require('../services/gameService');
const ErrorHandler = require('../middleware/errorHandler');

class GameController {
  static async getGames(req, res, next) {
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
  }

  static async getGame(req, res, next) {
    const { consoleId, fileName } = req.params;
    const result = await GameService.getGame(consoleId, fileName);
    res.json(result);
  }

  static async downloadGame(req, res, next) {
    const { consoleId, fileName } = req.params;
    const result = await GameService.getGameFile(consoleId, fileName);
    res.download(result.filePath, result.fileName);
  }

  static async searchGames(req, res, next) {
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
  }

  static async getGameCategories(req, res, next) {
    const { consoleId } = req.params;
    const result = await GameService.getGameCategories(consoleId);
    res.json(result);
  }
}

module.exports = GameController; 