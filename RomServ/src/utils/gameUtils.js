const path = require('path');
const { getConsoleConfig } = require('../config/consoles');

class GameUtils {
  /**
   * Извлекает чистое имя игры из имени файла
   */
  static extractGameName(fileName, consoleId) {
    const config = getConsoleConfig(consoleId);
    if (!config) return fileName;

    // Удаляем расширение файла
    let gameName = fileName;
    for (const ext of config.extensions) {
      if (gameName.toLowerCase().endsWith(ext.toLowerCase())) {
        gameName = gameName.slice(0, -ext.length);
        break;
      }
    }

    // Удаляем региональные метки в скобках
    gameName = gameName.replace(/\([^)]*\)/g, '').trim();
    
    // Удаляем лишние пробелы
    gameName = gameName.replace(/\s+/g, ' ');
    
    // Удаляем специальные символы в начале и конце
    gameName = gameName.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');

    return gameName || fileName;
  }

  /**
   * Определяет категорию игры на основе названия
   */
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

  /**
   * Проверяет, является ли файл валидным ROM для консоли
   */
  static isValidRomFile(fileName, consoleId) {
    const config = getConsoleConfig(consoleId);
    if (!config) return false;

    const ext = path.extname(fileName).toLowerCase();
    return config.extensions.includes(ext);
  }

  /**
   * Проверяет, является ли файл изображением
   */
  static isImageFile(fileName, consoleId) {
    const config = getConsoleConfig(consoleId);
    if (!config) return false;

    const ext = path.extname(fileName).toLowerCase();
    return config.imageExtensions.includes(ext);
  }

  /**
   * Проверяет, является ли файл файлом сохранения
   */
  static isSaveFile(fileName, consoleId) {
    const config = getConsoleConfig(consoleId);
    if (!config) return false;

    const ext = path.extname(fileName).toLowerCase();
    return config.saveExtensions.includes(ext);
  }

  /**
   * Извлекает регион из имени файла
   */
  static extractRegion(fileName, consoleId) {
    const config = getConsoleConfig(consoleId);
    if (!config) return 'Unknown';

    const name = fileName.toLowerCase();
    
    // Поиск региональных меток
    if (name.includes('(usa)') || name.includes('(us)')) return 'USA';
    if (name.includes('(europe)') || name.includes('(eu)')) return 'Europe';
    if (name.includes('(japan)') || name.includes('(jp)')) return 'Japan';
    if (name.includes('(asia)')) return 'Asia';
    
    return 'Unknown';
  }

  /**
   * Создает объект игры с полной информацией
   */
  static createGameObject(fileName, consoleId, filePath) {
    const gameName = this.extractGameName(fileName, consoleId);
    const category = this.categorizeGame(gameName, consoleId);
    const region = this.extractRegion(fileName, consoleId);
    
    return {
      id: fileName,
      name: gameName,
      fileName: fileName,
      path: `/romserv/api/v1/consoles/${consoleId}/roms/${encodeURIComponent(fileName)}`,
      category,
      region,
      console: consoleId,
      hasImage: false, // Будет обновлено позже
      hasSave: false   // Будет обновлено позже
    };
  }

  /**
   * Сортирует игры по различным критериям
   */
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

  /**
   * Фильтрует игры по различным критериям
   */
  static filterGames(games, filters = {}) {
    return games.filter(game => {
      // Фильтр по категории
      if (filters.category && game.category !== filters.category) {
        return false;
      }
      
      // Фильтр по региону
      if (filters.region && game.region !== filters.region) {
        return false;
      }
      
      // Фильтр по поиску
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

  /**
   * Группирует игры по категориям
   */
  static groupGamesByCategory(games) {
    const grouped = {};
    
    games.forEach(game => {
      if (!grouped[game.category]) {
        grouped[game.category] = [];
      }
      grouped[game.category].push(game);
    });
    
    return grouped;
  }

  /**
   * Получает статистику по играм
   */
  static getGameStats(games) {
    const stats = {
      total: games.length,
      categories: {},
      regions: {},
      consoles: {}
    };
    
    games.forEach(game => {
      // Статистика по категориям
      stats.categories[game.category] = (stats.categories[game.category] || 0) + 1;
      
      // Статистика по регионам
      stats.regions[game.region] = (stats.regions[game.region] || 0) + 1;
      
      // Статистика по консолям
      stats.consoles[game.console] = (stats.consoles[game.console] || 0) + 1;
    });
    
    return stats;
  }
}

module.exports = GameUtils; 