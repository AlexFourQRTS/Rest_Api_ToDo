const express = require('express');
const cors = require('cors');

const RequestLogger = require('./middleware/requestLogger');
const ErrorMiddleware = require('./middleware/error');

const getConsoles = require('./routes/getConsoles');
const getConsole = require('./routes/getConsole');
const health = require('./routes/health');
const getGames = require('./routes/getGames');
const searchGames = require('./routes/searchGames');
const getGameCategories = require('./routes/getGameCategories');
const getGame = require('./routes/getGame');
const downloadGame = require('./routes/downloadGame');

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
    this.app.use('/romserv', getConsoles);
    this.app.use('/', getConsoles);
    
    this.app.use('/romserv', getConsole);
    this.app.use('/', getConsole);
    
    this.app.use('/romserv', health);
    this.app.use('/', health);
    
    this.app.use('/romserv', getGames);
    this.app.use('/', getGames);
    
    this.app.use('/romserv', searchGames);
    this.app.use('/', searchGames);
    
    this.app.use('/romserv', getGameCategories);
    this.app.use('/', getGameCategories);
    
    this.app.use('/romserv', getGame);
    this.app.use('/', getGame);
    
    this.app.use('/romserv', downloadGame);
    this.app.use('/', downloadGame);
    
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
    this.app.use(ErrorMiddleware.handleNotFound);
    
    this.app.use(ErrorMiddleware.handleError);
  }

  start(port =  9999) {
    return new Promise((resolve) => {
      const server = this.app.listen(port, () => {
        resolve(server);
      });

      process.on('SIGTERM', () => {
        server.close(() => {
          process.exit(0);
        });
      });

      process.on('SIGINT', () => {
        server.close(() => {
          process.exit(0);
        });
      });
    });
  }
}

module.exports = App; 