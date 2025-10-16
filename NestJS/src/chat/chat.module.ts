import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { MessageService } from './message.service';
import { ChatKeyService } from './services/chat-key.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { ChatKey } from './entities/chat-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message, ChatKey])],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, MessageService, ChatKeyService],
  exports: [ChatService, MessageService, ChatKeyService],
})
export class ChatModule {}
