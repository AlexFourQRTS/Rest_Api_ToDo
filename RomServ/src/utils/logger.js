class Logger {
  error(message, data = null) {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] [ERROR] ${message}`;
    
    if (data) {
      logMessage += ` | Data: ${JSON.stringify(data)}`;
    }
    
    console.error(logMessage);
  }
}

module.exports = new Logger(); 