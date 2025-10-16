import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../auth/entities/User.entity';
import { Blog } from '../blog/entities/blog.entity';
import { Comment } from '../blog/entities/comment.entity';
import { File } from '../file/entities/file.entity';
import { Chat } from '../chat/entities/chat.entity';
import { Message } from '../chat/entities/message.entity';
import { ChatKey } from '../chat/entities/chat-key.entity';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [User, Blog, Comment, File, Chat, Message, ChatKey],
  synchronize: true,
  logging: false,
  autoLoadEntities: true,
});

