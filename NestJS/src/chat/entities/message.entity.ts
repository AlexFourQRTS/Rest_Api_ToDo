import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { Chat } from './chat.entity';
import { MessageStatus, MessageType } from '../../common/enums';

@Entity('messages')
@Index(['chatId', 'createdAt'])
@Index(['senderId'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  chatId: string;

  @ManyToOne(() => Chat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  @Column({ type: 'uuid' })
  senderId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  type: MessageType;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.SENT,
  })
  status: MessageStatus;

  @Column({ type: 'jsonb', nullable: true })
  attachments: {
    url: string;
    type: string;
    name: string;
    size: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    edited?: boolean;
    editedAt?: Date;
    replyTo?: string; // ID сообщения на которое отвечаем
    mentions?: string[]; // ID упомянутых пользователей
    reactions?: {
      emoji: string;
      userIds: string[];
    }[];
  };

  @Column({ type: 'uuid', array: true, default: '{}' })
  deliveredTo: string[]; // ID пользователей, кому доставлено

  @Column({ type: 'uuid', array: true, default: '{}' })
  readBy: string[]; // ID пользователей, кто прочитал

  @Column({ default: false })
  isEdited: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Message;

