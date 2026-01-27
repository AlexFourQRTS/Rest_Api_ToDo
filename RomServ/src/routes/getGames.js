const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { getConsoleConfig, getConsolePath } = require('../config/consoles');
const GameUtils = require('../utils/gameUtils');
const ErrorMiddleware = require('../middleware/error');
const RequestLogger = require('../middleware/requestLogger');

const router = express.Router();

async function enrichGamesWithMetadata(games, consolePath, allFiles) {
  const fileSet = new Set(allFiles);
  
  return games.map(game => {
    const baseName = path.parse(game.fileName).name;
    
    for (const ext of ['.png', '.jpg', '.jpeg']) {
      if (fileSet.has(baseName + ext)) {
        game.hasImage = true;
        game.imagePath = `/consoles/${game.console}/images/${encodeURIComponent(baseName + ext)}`;
        break;
      }
    }
    
    const config = getConsoleConfig(game.console);
    if (config) {
      for (const ext of config.saveExtensions) {
        if (fileSet.has(baseName + ext)) {
          game.hasSave = true;
          game.savePath = `/consoles/${game.console}/saves/${encodeURIComponent(baseName + ext)}`;
          break;
        }
      }
    }
    
    return game;
  });
}

router.get('/consoles/:consoleId/games',
  ErrorMiddleware.validateConsoleId,
  RequestLogger.rateLimiter(200, 15 * 60 * 1000),
  ErrorMiddleware.asyncHandler(async (req, res) => {
    const { consoleId } = req.params;
    const { page, limit, sortBy, sortOrder, category, region, search } = req.query;

    const config = getConsoleConfig(consoleId);
    if (!config) {
      throw ErrorMiddleware.createError(`Console '${consoleId}' not supported`, 400);
    }

    const consolePath = getConsolePath(consoleId);
    const files = await fs.readdir(consolePath);
    
    const romFiles = files.filter(file => GameUtils.isValidRomFile(file, consoleId));
    
    let games = romFiles.map(fileName => {
      const filePath = path.join(consolePath, fileName);
      return GameUtils.createGameObject(fileName, consoleId, filePath);
    });

    games = await enrichGamesWithMetadata(games, consolePath, files);

    if (category || region || search) {
      const filters = {};
      if (category) filters.category = category;
      if (region) filters.region = region;
      if (search) filters.search = search;
      games = GameUtils.filterGames(games, filters);
    }

    const sortByParam = sortBy || 'name';
    const sortOrderParam = sortOrder || 'asc';
    games = GameUtils.sortGames(games, sortByParam, sortOrderParam);

    if (page && limit) {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 50;
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      games = games.slice(startIndex, endIndex);
    }
    
    res.json({
      success: true,
      data: games,
      meta: {
        total: romFiles.length,
        console: consoleId,
        consoleName: config.name
      }
    });
  })
);

module.exports = router;
