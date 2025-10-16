/**
 * Константы приложения
 * Вместо magic numbers используем именованные константы
 */

// Лимиты сообщений
export const MESSAGE_LIMITS = {
  MAX_LENGTH: 10000,
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
} as const;

// Лимиты файлов
export const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB в байтах
  MAX_FILES_PER_MESSAGE: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/quicktime'],
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
} as const;

// Время жизни токенов
export const TOKEN_EXPIRATION = {
  ACCESS_TOKEN: '15m',
  REFRESH_TOKEN: '7d',
  RESET_PASSWORD: '1h',
  EMAIL_VERIFICATION: '24h',
} as const;

// Rate limiting
export const RATE_LIMITS = {
  DEFAULT: {
    TTL: 60 * 1000,    // 60 секунд
    LIMIT: 100,         // 100 запросов
  },
  AUTH: {
    TTL: 60 * 1000,    // 60 секунд  
    LIMIT: 10,          // 10 попыток входа
  },
  MESSAGES: {
    TTL: 1000,         // 1 секунда
    LIMIT: 10,          // 10 сообщений в секунду
  },
  TYPING: {
    TTL: 3000,         // 3 секунды
    LIMIT: 1,           // 1 событие набора
  },
} as const;

// Кэширование
export const CACHE_TTL = {
  SHORT: 60,           // 1 минута
  MEDIUM: 300,         // 5 минут
  LONG: 3600,          // 1 час
  VERY_LONG: 86400,    // 24 часа
} as const;

// Пагинация
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// WebSocket события (дополнительные настройки)
export const WEBSOCKET_CONFIG = {
  PING_INTERVAL: 25000,       // 25 секунд
  PING_TIMEOUT: 60000,        // 60 секунд
  MAX_PAYLOAD: 1e6,           // 1MB
  RECONNECTION_DELAY: 1000,   // 1 секунда
  RECONNECTION_ATTEMPTS: 5,
} as const;

// Онлайн статус
export const USER_STATUS = {
  ONLINE_TIMEOUT: 30000,      // 30 секунд без активности = оффлайн
  TYPING_TIMEOUT: 3000,       // 3 секунды typing indicator
} as const;

// База данных
export const DATABASE_CONFIG = {
  POOL_SIZE: 20,
  CONNECTION_TIMEOUT: 10000,  // 10 секунд
  QUERY_TIMEOUT: 30000,       // 30 секунд
} as const;

