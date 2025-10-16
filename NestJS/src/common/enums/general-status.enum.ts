/**
 * Общие статусы для различных сущностей
 */
export enum EntityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
  SUSPENDED = 'suspended',
}

/**
 * Приоритеты
 */
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Видимость/Уровни доступа
 */
export enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS = 'friends',
  UNLISTED = 'unlisted',
}

/**
 * Статусы обработки
 */
export enum ProcessingStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Статусы модерации
 */
export enum ModerationStatus {
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FLAGGED = 'flagged',
  REMOVED = 'removed',
}

