/**
 * Централизованная конфигурация приложения
 * Это правильный NestJS way вместо прямого использования process.env
 */

export default () => ({
  // Основные настройки приложения
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || 'api',
  },

  // База данных
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'nestjs_db',
    synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
    logging: process.env.DB_LOGGING === 'true' || false,
  },

  // JWT конфигурация
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    accessTokenExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshTokenExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },

  // Redis конфигурация
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    ttl: parseInt(process.env.REDIS_TTL, 10) || 3600, // 1 час по умолчанию
  },

  // Rate limiting
  throttle: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60000, // 60 секунд
    limit: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100, // 100 запросов
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },

  // WebSocket
  websocket: {
    port: parseInt(process.env.WS_PORT, 10) || 3001,
    namespace: process.env.WS_NAMESPACE || '/chat',
  },

  // Файлы и хранилище
  storage: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760, // 10MB
    allowedMimeTypes: process.env.ALLOWED_MIME_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'audio/mpeg',
    ],
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },

  // Логирование
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    prettyPrint: process.env.LOG_PRETTY === 'true' || false,
  },

  // Сообщения (чаты)
  messages: {
    maxLength: parseInt(process.env.MESSAGE_MAX_LENGTH, 10) || 10000,
    pageSize: parseInt(process.env.MESSAGE_PAGE_SIZE, 10) || 50,
    maxPageSize: parseInt(process.env.MESSAGE_MAX_PAGE_SIZE, 10) || 100,
  },

  // Email (для будущего)
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true' || false,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@example.com',
  },
});

