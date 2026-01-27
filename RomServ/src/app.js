const express = require('express');
const cors = require('cors');
const path = require('path');
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
    const apiV1Router = express.Router();
    
    apiV1Router.use('/', consoleRoutes);
    apiV1Router.use('/', gameRoutes);
    
    this.app.use('/romserv', apiV1Router);
    this.app.use('/', apiV1Router);
    
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Retro Games API Server',
        version: '1.0.0',
        endpoints: {
          consoles: '/consoles',
          games: '/consoles/:consoleId/games',
          health: '/health'
        },
        supportedConsoles: ['nes', 'megadrive', 'snes', 'gba', 'gbc', 'psx', 'atari']
      });
    });



  }

  setupErrorHandling() {
    this.app.use(ErrorHandler.handleNotFound);
    
    this.app.use(ErrorHandler.handleError);
  }

  start(port =  9999) {
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