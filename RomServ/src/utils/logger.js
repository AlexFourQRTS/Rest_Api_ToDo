const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(level, message, data = null) {
    const timestamp = this.getTimestamp();
    let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (data) {
      logMessage += ` | Data: ${JSON.stringify(data)}`;
    }
    
    return logMessage;
  }

  writeToFile(level, message, data = null) {
    const formattedMessage = this.formatMessage(level, message, data);
    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logDir, `${date}.log`);
    
    fs.appendFileSync(logFile, formattedMessage + '\n');
  }

  info(message, data = null) {
    const formattedMessage = this.formatMessage('info', message, data);
    console.log(formattedMessage);
    this.writeToFile('info', message, data);
  }

  warn(message, data = null) {
    const formattedMessage = this.formatMessage('warn', message, data);
    console.warn(formattedMessage);
    this.writeToFile('warn', message, data);
  }

  error(message, data = null) {
    const formattedMessage = this.formatMessage('error', message, data);
    console.error(formattedMessage);
    this.writeToFile('error', message, data);
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('debug', message, data);
      console.log(formattedMessage);
      this.writeToFile('debug', message, data);
    }
  }

  gameRequest(consoleId, action, fileName = null) {
    this.info(`Game ${action}`, { console: consoleId, file: fileName });
  }

  gameError(consoleId, action, error, fileName = null) {
    this.error(`Game ${action} failed`, { 
      console: consoleId, 
      file: fileName, 
      error: error.message 
    });
  }

  apiRequest(method, path, ip) {
    this.info(`API Request`, { method, path, ip });
  }

  apiError(method, path, error, ip) {
    this.error(`API Error`, { method, path, error: error.message, ip });
  }
}

module.exports = new Logger(); 