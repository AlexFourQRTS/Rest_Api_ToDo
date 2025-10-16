import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn
} from 'typeorm';

export enum ChatType {
  PRIVATE = 'private',
  GROUP = 'group',
  CHANNEL = 'channel'
}

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'chat_type',
    type: 'enum',
    enum: ChatType,
    nullable: false,
    default: ChatType.PRIVATE,
  })
  chatType: ChatType;

  @Column({ name: 'created_by', type: 'uuid', nullable: false })
  createdBy: string;

  @Column({ name: 'participants', type: 'uuid', array: true, nullable: true })
  participants: string[];

  @Column({ name: 'is_active', type: 'boolean', nullable: false, default: true })
  isActive: boolean;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Chat;

