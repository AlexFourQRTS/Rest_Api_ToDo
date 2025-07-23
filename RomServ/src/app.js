const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const logger = require('./utils/logger');
const RequestLogger = require('./middleware/requestLogger');
const ErrorHandler = require('./middleware/errorHandler');

const gameRoutes = require('./routes/gameRoutes');
const consoleRoutes = require('./routes/consoleRoutes');

class App {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    this.app.use(express.json({ limit: '10000mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
      credentials: true
    }));

    this.app.use(RequestLogger.logRequest);
    
    this.app.set('trust proxy', 1);
  }

  setupRoutes() {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Retro Games API Documentation',
      customfavIcon: '/favicon.ico',
      swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        showRequestHeaders: true,
        tryItOutEnabled: true
      }
    }));

    const apiV1Router = express.Router();
    
    apiV1Router.use('/', consoleRoutes);
    apiV1Router.use('/', gameRoutes);
    
    this.app.use('romserv/api/v1', apiV1Router);
    
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Retro Games API Server',
        version: '1.0.0',
        documentation: 'romserv/api-docs',
        endpoints: {
          consoles: 'romserv/api/v1/consoles',
          games: 'romserv/api/v1/consoles/:consoleId/games',
          health: '/api/v1/health',
          docs: '/api-docs'
        },
        supportedConsoles: ['nes', 'megadrive', 'snes', 'gba', 'gbc', 'psx', 'atari']
      });
    });

    this.app.get('/api/v1/docs', (req, res) => {
      res.json({
        success: true,
        message: 'API Documentation',
        version: '1.0.0',
        swagger: '/api-docs',
        endpoints: {
          consoles: {
            'GET romserv/api/v1/consoles': 'Get all supported consoles',
            'GET romserv/api/v1/consoles/:consoleId': 'Get console information',
            'GET romserv/api/v1/stats': 'Get global statistics',
            'GET romserv/api/v1/health': 'Health check',
            'GET romserv/api/v1/system/info': 'System information'
          },
          games: {
            'GET romserv/api/v1/consoles/:consoleId/games': 'Get games list with pagination and filtering',
            'GET romserv/api/v1/consoles/:consoleId/games/search': 'Search games by name',
            'GET romserv/api/v1/consoles/:consoleId/games/random': 'Get random game',
            'GET romserv/api/v1/consoles/:consoleId/games/stats': 'Get games statistics',
            'GET romserv/api/v1/consoles/:consoleId/categories': 'Get game categories',
            'GET romserv/api/v1/consoles/:consoleId/games/:fileName': 'Get game information',
            'GET romserv/api/v1/consoles/:consoleId/roms/:fileName': 'Download game ROM',
            'GET romserv/api/v1/consoles/:consoleId/images/:imageName': 'Get game image',
            'GET romserv/api/v1/consoles/:consoleId/saves/:saveName': 'Get save file'
          }
        },
        queryParameters: {
          games: {
            page: 'Page number (default: 1)',
            limit: 'Items per page (default: 50)',
            sortBy: 'Sort field (name, category, region, fileName)',
            sortOrder: 'Sort order (asc, desc)',
            category: 'Filter by category',
            region: 'Filter by region',
            search: 'Search term'
          }
        }
      });
    });

    if (process.env.NODE_ENV === 'production') {
      this.app.use(express.static(path.join(__dirname, '../client/build')));
      
      this.app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
      });
    }
  }

  setupErrorHandling() {
    this.app.use(ErrorHandler.handleNotFound);
    
    this.app.use(ErrorHandler.handleError);
  }

  start(port = process.env.PORT || 9999) {
    return new Promise((resolve) => {
      const server = this.app.listen(port, () => {
        logger.info(`Server started on port ${port}`, {
          port,
          environment: process.env.NODE_ENV || 'development',
          nodeVersion: process.version
        });
        
        const { getAllConsoles } = require('./config/consoles');
        const consoles = getAllConsoles();
        logger.info(`Available consoles: ${consoles.map(c => c.id).join(', ')}`);
        
        logger.info(`API Documentation available at: http:/localhost:${port}/api-docs`);
        
        resolve(server);
      });

      process.on('SIGTERM', () => {
        logger.info('SIGTERM received, shutting down gracefully');
        server.close(() => {
          logger.info('Process terminated');
          process.exit(0);
        });
      });

      process.on('SIGINT', () => {
        logger.info('SIGINT received, shutting down gracefully');
        server.close(() => {
          logger.info('Process terminated');
          process.exit(0);
        });
      });
    });
  }
}

module.exports = App; 