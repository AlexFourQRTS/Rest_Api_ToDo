const { getAllConsoles, getConsoleConfig } = require('../config/consoles');
const GameService = require('../services/gameService');
const ErrorHandler = require('../middleware/errorHandler');
const logger = require('../utils/logger');

class ConsoleController {
  /**
   * Получает список всех поддерживаемых консолей
   */
  static async getConsoles(req, res, next) {
    try {
      const consoles = getAllConsoles();
      
      // Добавляем статистику для каждой консоли
      const consolesWithStats = await Promise.all(
        consoles.map(async (console) => {
          try {
            const stats = await GameService.getGameStats(console.id);
            return {
              ...console,
              stats: stats.data.consoles[console.id] || 0
            };
          } catch (error) {
            logger.warn(`Failed to get stats for console ${console.id}`, { error: error.message });
            return {
              ...console,
              stats: 0
            };
          }
        })
      );

      res.json({
        success: true,
        data: consolesWithStats,
        meta: {
          total: consolesWithStats.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получает информацию о конкретной консоли
   */
  static async getConsole(req, res, next) {
    try {
      const { consoleId } = req.params;
      const config = getConsoleConfig(consoleId);
      
      if (!config) {
        throw ErrorHandler.createError(`Console '${consoleId}' not supported`, 404);
      }

      // Получаем статистику консоли
      let stats = null;
      try {
        const statsResult = await GameService.getGameStats(consoleId);
        stats = statsResult.data;
      } catch (error) {
        logger.warn(`Failed to get stats for console ${consoleId}`, { error: error.message });
      }

      const consoleInfo = {
        id: consoleId,
        name: config.name,
        shortName: config.shortName,
        folder: config.folder,
        extensions: config.extensions,
        imageExtensions: config.imageExtensions,
        saveExtensions: config.saveExtensions,
        maxFileSize: config.maxFileSize,
        supportedRegions: config.supportedRegions,
        categories: Object.keys(config.categories),
        stats
      };

      res.json({
        success: true,
        data: consoleInfo
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получает общую статистику по всем консолям
   */
  static async getGlobalStats(req, res, next) {
    try {
      const stats = await GameService.getGameStats();
      
      res.json({
        success: true,
        data: stats.data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Получает информацию о системе
   */
  static async getSystemInfo(req, res, next) {
    try {
      const os = require('os');
      const process = require('process');
      
      const systemInfo = {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        uptime: process.uptime(),
        memory: {
          total: os.totalmem(),
          free: os.freemem(),
          used: os.totalmem() - os.freemem()
        },
        cpus: os.cpus().length,
        hostname: os.hostname(),
        loadAverage: os.loadavg()
      };

      res.json({
        success: true,
        data: systemInfo
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Проверяет здоровье системы
   */
  static async healthCheck(req, res, next) {
    try {
      const fs = require('fs').promises;
      const { getAllConsoles } = require('../config/consoles');
      
      const consoles = getAllConsoles();
      const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        consoles: {}
      };

      // Проверяем доступность каждой консоли
      for (const console of consoles) {
        try {
          const consolePath = require('path').join(process.cwd(), console.folder);
          await fs.access(consolePath);
          healthStatus.consoles[console.id] = {
            status: 'available',
            path: consolePath
          };
        } catch (error) {
          healthStatus.consoles[console.id] = {
            status: 'unavailable',
            error: error.message
          };
          healthStatus.status = 'degraded';
        }
      }

      const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
      res.status(statusCode).json({
        success: true,
        data: healthStatus
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ConsoleController; 