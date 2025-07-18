import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  CreatedAt, 
  UpdatedAt,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';

export enum ChatType {
  PRIVATE = 'private',
  GROUP = 'group',
  CHANNEL = 'channel'
}

@Table({
  tableName: 'chats',
  timestamps: true,
  freezeTableName: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
})
export class Chat extends Model<Chat> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.ENUM(...Object.values(ChatType)),
    allowNull: false,
    defaultValue: ChatType.PRIVATE,
    field: 'chat_type'
  })
  declare chatType: ChatType;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'created_by'
  })
  declare createdBy: string;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: true,
    field: 'participants'
  })
  declare participants: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  })
  declare isActive: boolean;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'metadata'
  })
  declare metadata: any;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}

export default Chat;
