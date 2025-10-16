/**
 * Статусы сообщений
 */
export enum MessageStatus {
  SENDING = 'sending',      // Отправляется
  SENT = 'sent',            // Отправлено на сервер
  DELIVERED = 'delivered',  // Доставлено получателю
  READ = 'read',            // Прочитано
  FAILED = 'failed',        // Ошибка отправки
}

/**
 * Типы сообщений
 */
export enum MessageType {
  TEXT = 'text',           // Обычное текстовое сообщение
  IMAGE = 'image',         // Изображение
  VIDEO = 'video',         // Видео
  AUDIO = 'audio',         // Аудио
  FILE = 'file',           // Файл
  VOICE = 'voice',         // Голосовое сообщение
  LOCATION = 'location',   // Геолокация
  CONTACT = 'contact',     // Контакт
  SYSTEM = 'system',       // Системное сообщение
  STICKER = 'sticker',     // Стикер
  GIF = 'gif',             // GIF
}

