const path = require('path');
const { getConsoleConfig } = require('../config/consoles');

class GameUtils {
  static extractGameName(fileName, consoleId) {
    const config = getConsoleConfig(consoleId);
    if (!config) return fileName;

    let gameName = fileName;
    for (const ext of config.extensions) {
      if (gameName.toLowerCase().endsWith(ext.toLowerCase())) {
        gameName = gameName.slice(0, -ext.length);
        break;
      }
    }

    gameName = gameName.replace(/\([^)]*\)/g, '').trim();
    
    gameName = gameName.replace(/\s+/g, ' ');
    
    gameName = gameName.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');

    return gameName || fileName;
  }

  static categorizeGame(gameName, consoleId) {
    const config = getConsoleConfig(consoleId);
    if (!config || !config.categories) return 'other';

    const name = gameName.toLowerCase();
    
    for (const [category, keywords] of Object.entries(config.categories)) {
      if (keywords.some(keyword => name.includes(keyword))) {
        return category;
      }
    }
    
    return 'other';
  }

  static isValidRomFile(fileName, consoleId) {
    const config = getConsoleConfig(consoleId);
    if (!config) return false;

    const ext = path.extname(fileName).toLowerCase();
    return config.extensions.includes(ext);
  }

  static extractRegion(fileName, consoleId) {
    const config = getConsoleConfig(consoleId);
    if (!config) return 'Unknown';

    const name = fileName.toLowerCase();
    
    if (name.includes('(usa)') || name.includes('(us)')) return 'USA';
    if (name.includes('(europe)') || name.includes('(eu)')) return 'Europe';
    if (name.includes('(japan)') || name.includes('(jp)')) return 'Japan';
    if (name.includes('(asia)')) return 'Asia';
    
    return 'Unknown';
  }

  static createGameObject(fileName, consoleId, filePath) {
    const gameName = this.extractGameName(fileName, consoleId);
    const category = this.categorizeGame(gameName, consoleId);
    const region = this.extractRegion(fileName, consoleId);
    
    return {
      id: fileName,
      name: gameName,
      fileName: fileName,
      path: `/consoles/${consoleId}/roms/${encodeURIComponent(fileName)}`,
      category,
      region,
      console: consoleId,
      hasImage: false,
      hasSave: false
    };
  }

  static sortGames(games, sortBy = 'name', order = 'asc') {
    const sortedGames = [...games];
    
    sortedGames.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'region':
          comparison = a.region.localeCompare(b.region);
          break;
        case 'fileName':
          comparison = a.fileName.localeCompare(b.fileName);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return order === 'desc' ? -comparison : comparison;
    });
    
    return sortedGames;
  }

  static filterGames(games, filters = {}) {
    return games.filter(game => {
      if (filters.category && game.category !== filters.category) {
        return false;
      }
      
      if (filters.region && game.region !== filters.region) {
        return false;
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesName = game.name.toLowerCase().includes(searchTerm);
        const matchesFileName = game.fileName.toLowerCase().includes(searchTerm);
        if (!matchesName && !matchesFileName) {
          return false;
        }
      }
      
      return true;
    });
  }

}

module.exports = GameUtils; 