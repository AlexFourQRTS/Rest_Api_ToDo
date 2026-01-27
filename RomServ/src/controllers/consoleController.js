const fs = require('fs').promises;
const path = require('path');
const { getAllConsoles, getConsoleConfig } = require('../config/consoles');
const ErrorHandler = require('../middleware/errorHandler');

class ConsoleController {
  static async getConsoles(req, res, next) {
    const consoles = getAllConsoles();

    res.json({
      success: true,
      data: consoles,
      meta: {
        total: consoles.length
      }
    });
  }

  static async getConsole(req, res, next) {
    const { consoleId } = req.params;
    const config = getConsoleConfig(consoleId);
    
    if (!config) {
      throw ErrorHandler.createError(`Console '${consoleId}' not supported`, 404);
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
      categories: Object.keys(config.categories)
    };

    res.json({
      success: true,
      data: consoleInfo
    });
  }

  static async healthCheck(req, res, next) {
    const consoles = getAllConsoles();
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      consoles: {}
    };

    for (const console of consoles) {
      try {
        const consolePath = path.join(process.cwd(), console.folder);
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
  }
}

module.exports = ConsoleController; 