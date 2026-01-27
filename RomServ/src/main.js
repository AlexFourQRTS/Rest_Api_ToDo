const App = require('./app');
const logger = require('./utils/logger');

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason: reason?.message || reason, promise });
  process.exit(1);
});

async function startServer() {
  try {
    const app = new App();
    await app.start();
  } catch (error) {
    console.log('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

startServer();
