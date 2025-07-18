import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto, UpdateChatDto } from './dto';

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);
      console.log(`User ${userId} disconnected`);
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  async joinChat(@MessageBody() data: { chatId: string; userId: string }, @ConnectedSocket() client: Socket) {
    try {
      this.connectedUsers.set(client.id, data.userId);
      await client.join(`chat_${data.chatId}`);
      
      client.emit('joinedChat', { 
        chatId: data.chatId, 
        message: 'Успешно присоединились к чату' 
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('leaveChat')
  async leaveChat(@MessageBody() data: { chatId: string }, @ConnectedSocket() client: Socket) {
    try {
      await client.leave(`chat_${data.chatId}`);
      client.emit('leftChat', { 
        chatId: data.chatId, 
        message: 'Покинули чат' 
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('createChat')
  async createChat(@MessageBody() createChatDto: CreateChatDto, @ConnectedSocket() client: Socket) {
    try {
      const userId = this.connectedUsers.get(client.id);
      if (!userId) {
        throw new Error('Пользователь не авторизован');
      }

      const chat = await this.chatService.create(createChatDto, userId);
      client.emit('chatCreated', chat);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('getChats')
  async getChats(@MessageBody() query: any, @ConnectedSocket() client: Socket) {
    try {
      const userId = this.connectedUsers.get(client.id);
      if (!userId) {
        throw new Error('Пользователь не авторизован');
      }

      const chats = await this.chatService.findAll(userId, query);
      client.emit('chatsList', chats);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('getChat')
  async getChat(@MessageBody() data: { id: string }, @ConnectedSocket() client: Socket) {
    try {
      const userId = this.connectedUsers.get(client.id);
      if (!userId) {
        throw new Error('Пользователь не авторизован');
      }

      const chat = await this.chatService.findOne(data.id, userId);
      client.emit('chatDetails', chat);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('updateChat')
  async updateChat(@MessageBody() updateChatDto: UpdateChatDto, @ConnectedSocket() client: Socket) {
    try {
      const userId = this.connectedUsers.get(client.id);
      if (!userId) {
        throw new Error('Пользователь не авторизован');
      }

      const chat = await this.chatService.update(updateChatDto.id, updateChatDto, userId);
      client.emit('chatUpdated', chat);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('deleteChat')
  async deleteChat(@MessageBody() data: { id: string }, @ConnectedSocket() client: Socket) {
    try {
      const userId = this.connectedUsers.get(client.id);
      if (!userId) {
        throw new Error('Пользователь не авторизован');
      }

      const result = await this.chatService.remove(data.id, userId);
      client.emit('chatDeleted', result);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('addParticipant')
  async addParticipant(@MessageBody() data: { chatId: string; participantId: string }, @ConnectedSocket() client: Socket) {
    try {
      const userId = this.connectedUsers.get(client.id);
      if (!userId) {
        throw new Error('Пользователь не авторизован');
      }

      const chat = await this.chatService.addParticipant(data.chatId, userId, data.participantId);
      this.server.to(`chat_${data.chatId}`).emit('participantAdded', {
        chatId: data.chatId,
        participantId: data.participantId,
        chat
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('removeParticipant')
  async removeParticipant(@MessageBody() data: { chatId: string; participantId: string }, @ConnectedSocket() client: Socket) {
    try {
      const userId = this.connectedUsers.get(client.id);
      if (!userId) {
        throw new Error('Пользователь не авторизован');
      }

      const chat = await this.chatService.removeParticipant(data.chatId, userId, data.participantId);
      this.server.to(`chat_${data.chatId}`).emit('participantRemoved', {
        chatId: data.chatId,
        participantId: data.participantId,
        chat
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }
}
