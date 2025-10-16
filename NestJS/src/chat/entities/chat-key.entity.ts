import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  Index
} from 'typeorm';

/**
 * Хранит зашифрованные ключи чатов для каждого участника
 * 
 * Как это работает:
 * 1. Чат создается с сгенерированным ключом
 * 2. Ключ шифруется публичным ключом каждого участника
 * 3. Каждый участник может расшифровать своим приватным ключом
 */
@Entity('chat_keys')
@Index(['chatId', 'userId'], { unique: true })
export class ChatKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  chatId: string;

  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  /**
   * Зашифрованный ключ чата для конкретного пользователя
   * Шифруется публичным ключом пользователя
   * 
   * Формат: Base64 строка зашифрованного AES ключа
   */
  @Column({ type: 'text' })
  encryptedKey: string;

  /**
   * Версия ключа (для ротации)
   * Если нужно обновить ключ - создаем новую версию
   */
  @Column({ type: 'integer', default: 1 })
  version: number;

  /**
   * Когда ключ становится активным
   */
  @Column({ type: 'timestamp', nullable: true })
  validFrom: Date;

  /**
   * Когда ключ перестает быть активным (для ротации)
   */
  @Column({ type: 'timestamp', nullable: true })
  validUntil: Date;

  /**
   * Метаданные (опционально)
   * Может содержать информацию о способе шифрования
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    algorithm?: string; // 'RSA-OAEP' или 'ECDH'
    keySize?: number;   // 256, 384, 512
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default ChatKey;

