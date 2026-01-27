const App = require('./src/app');
const logger = require('./src/utils/logger');

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason: reason?.message || reason, promise });
  process.exit(1);
});

// Запуск приложения
async function startServer() {
  try {
    const app = new App();
    await app.start();
  } catch (error) {
    // RequestLogger.console.log();
    
    console.log('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

startServer(); 