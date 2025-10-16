import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageService } from './message.service';
import { CreateChatDto, UpdateChatDto, SendMessageDto, EditMessageDto, GetMessagesDto } from './dto';
import { SocketEvent, ErrorCode } from '../common/enums';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Мапа для хранения онлайн пользователей: userId -> Set<socketId>
  private onlineUsers = new Map<string, Set<string>>();
  
  // Мапа для хранения пользователей по сокетам: socketId -> userId
  private socketToUser = new Map<string, string>();
  
  // Мапа для хранения набирающих пользователей: chatId -> Set<userId>
  private typingUsers = new Map<string, Set<string>>();

  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  handleConnection(client: AuthenticatedSocket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = this.socketToUser.get(client.id);
    
    if (userId) {
      // Удаляем сокет из списка пользователя
      const userSockets = this.onlineUsers.get(userId);
      if (userSockets) {
        userSockets.delete(client.id);
        
        // Если это был последний сокет пользователя
        if (userSockets.size === 0) {
          this.onlineUsers.delete(userId);
          this.server.emit(SocketEvent.USER_OFFLINE, { userId });
        }
      }
      
      this.socketToUser.delete(client.id);
      
      // Удаляем из списка набирающих
      this.typingUsers.forEach((users, chatId) => {
        if (users.has(userId)) {
          users.delete(userId);
          this.server.to(`chat_${chatId}`).emit(SocketEvent.USER_STOPPED_TYPING, {
            chatId,
            userId
          });
        }
      });
    }
    
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(SocketEvent.AUTHENTICATE)
  async authenticate(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    try {
      const { userId } = data;
      
      if (!userId) {
        throw new WsException({
          code: ErrorCode.WS_NOT_AUTHENTICATED,
          message: 'userId обязателен'
        });
      }

      // Сохраняем связь сокета с пользователем
      client.userId = userId;
      this.socketToUser.set(client.id, userId);
      
      // Добавляем сокет в список пользователя
      if (!this.onlineUsers.has(userId)) {
        this.onlineUsers.set(userId, new Set());
      }
      this.onlineUsers.get(userId).add(client.id);

      // Уведомляем всех об онлайн статусе
      this.server.emit(SocketEvent.USER_ONLINE, { userId });

      client.emit(SocketEvent.AUTHENTICATED, {
        success: true,
        userId,
        message: 'Успешная аутентификация'
      });
    } catch (error) {
      client.emit(SocketEvent.ERROR, {
        code: ErrorCode.WS_NOT_AUTHENTICATED,
        message: error.message
      });
    }
  }

  @SubscribeMessage(SocketEvent.JOIN_CHAT)
  async joinChat(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    try {
      const userId = client.userId;
      if (!userId) {
        throw new WsException({
          code: ErrorCode.WS_NOT_AUTHENTICATED,
          message: 'Пользователь не аутентифицирован'
        });
      }

      // Проверяем доступ к чату
      await this.chatService.findOne(data.chatId, userId);
      
      await client.join(`chat_${data.chatId}`);
      
      // Помечаем сообщения как доставленные
      await this.messageService.markAsDelivered(data.chatId, userId);
      
      client.emit(SocketEvent.JOINED_CHAT, {
        chatId: data.chatId,
        message: 'Успешно присоединились к чату'
      });
      
      // Уведомляем других участников
      client.to(`chat_${data.chatId}`).emit(SocketEvent.PARTICIPANT_JOINED, {
        chatId: data.chatId,
        userId
      });
    } catch (error) {
      client.emit(SocketEvent.ERROR, {
        code: error.code || ErrorCode.WS_ROOM_JOIN_FAILED,
        message: error.message
      });
    }
  }

  @SubscribeMessage(SocketEvent.LEAVE_CHAT)
  async leaveChat(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    try {
      const userId = client.userId;
      
      await client.leave(`chat_${data.chatId}`);
      
      client.emit(SocketEvent.LEFT_CHAT, {
        chatId: data.chatId,
        message: 'Покинули чат'
      });
      
      // Уведомляем других участников
      client.to(`chat_${data.chatId}`).emit(SocketEvent.PARTICIPANT_LEFT, {
        chatId: data.chatId,
        userId
      });
    } catch (error) {
      client.emit(SocketEvent.ERROR, {
        code: ErrorCode.WS_ROOM_LEAVE_FAILED,
        message: error.message
      });
    }
  }

  @SubscribeMessage(SocketEvent.SEND_MESSAGE)
  async sendMessage(
    @MessageBody() sendMessageDto: SendMessageDto,
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    try {
      const userId = client.userId;
      if (!userId) {
        throw new WsException({
          code: ErrorCode.WS_NOT_AUTHENTICATED,
          message: 'Пользователь не аутентифицирован'
        });
      }

      const message = await this.messageService.sendMessage(sendMessageDto, userId);
      
      // Отправляем подтверждение отправителю
      client.emit(SocketEvent.MESSAGE_SENT, message);
      
      // Отправляем сообщение всем участникам чата
      this.server.to(`chat_${sendMessageDto.chatId}`).emit(SocketEvent.NEW_MESSAGE, message);
      
      // Останавливаем индикатор набора
      this.stopTyping(sendMessageDto.chatId, userId, client);
    } catch (error) {
      client.emit(SocketEvent.ERROR, {
        code: error.code || ErrorCode.UNKNOWN_ERROR,
        message: error.message
      });
    }
  }

  @SubscribeMessage(SocketEvent.GET_MESSAGES)
  async getMessages(
    @MessageBody() getMessagesDto: GetMessagesDto,
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    try {
      const userId = client.userId;
      if (!userId) {
        throw new WsException({
          code: ErrorCode.WS_NOT_AUTHENTICATED,
          message: 'Пользователь не аутентифицирован'
        });
      }

      const result = await this.messageService.getMessages(getMessagesDto, userId);
      
      client.emit(SocketEvent.MESSAGES_LIST, result);
    } catch (error) {
      client.emit(SocketEvent.ERROR, {
        code: error.code || ErrorCode.UNKNOWN_ERROR,
        message: error.message
      });
    }
  }

  @SubscribeMessage(SocketEvent.EDIT_MESSAGE)
  async editMessage(
    @MessageBody() editMessageDto: EditMessageDto,
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    try {
      const userId = client.userId;
      if (!userId) {
        throw new WsException({
          code: ErrorCode.WS_NOT_AUTHENTICATED,
          message: 'Пользователь не аутентифицирован'
        });
      }

      const message = await this.messageService.editMessage(editMessageDto, userId);
      
      // Уведомляем всех участников чата об изменении
      this.server.to(`chat_${message.chatId}`).emit(SocketEvent.MESSAGE_EDITED, message);
    } catch (error) {
      client.emit(SocketEvent.ERROR, {
        code: error.code || ErrorCode.UNKNOWN_ERROR,
        message: error.message
      });
    }
  }

  @SubscribeMessage(SocketEvent.DELETE_MESSAGE)
  async deleteMessage(
    @MessageBody() data: { messageId: string },
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    try {
      const userId = client.userId;
      if (!userId) {
        throw new WsException({
          code: ErrorCode.WS_NOT_AUTHENTICATED,
          message: 'Пользователь не аутентифицирован'
        });
      }

      const message = await this.messageService.deleteMessage(data.messageId, userId);
      
      // Уведомляем всех участников чата об удалении
      this.server.to(`chat_${message.chatId}`).emit(SocketEvent.MESSAGE_DELETED, message);
    } catch (error) {
      client.emit(SocketEvent.ERROR, {
        code: error.code || ErrorCode.UNKNOWN_ERROR,
        message: error.message
      });
    }
  }

  @SubscribeMessage(SocketEvent.MARK_AS_READ)
  async markAsRead(
    @MessageBody() data: { chatId: string; messageIds?: string[] },
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    try {
      const userId = client.userId;
      if (!userId) {
        throw new WsException({
          code: ErrorCode.WS_NOT_AUTHENTICATED,
          message: 'Пользователь не аутентифицирован'
        });
      }

      await this.messageService.markAsRead(data.chatId, userId, data.messageIds);
      
      // Уведомляем отправителей о прочтении
      this.server.to(`chat_${data.chatId}`).emit(SocketEvent.MESSAGE_READ, {
        chatId: data.chatId,
        userId,
        messageIds: data.messageIds
      });
    } catch (error) {
      client.emit(SocketEvent.ERROR, {
        code: error.code || ErrorCode.UNKNOWN_ERROR,
        message: error.message
      });
    }
  }

  @SubscribeMessage(SocketEvent.TYPING_START)
  async typingStart(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    try {
      const userId = client.userId;
      if (!userId) return;

      if (!this.typingUsers.has(data.chatId)) {
        this.typingUsers.set(data.chatId, new Set());
      }
      
      this.typingUsers.get(data.chatId).add(userId);
      
      // Уведомляем других участников
      client.to(`chat_${data.chatId}`).emit(SocketEvent.USER_TYPING, {
        chatId: data.chatId,
        userId
      });
    } catch (error) {
      console.error('Error in typingStart:', error);
    }
  }

  @SubscribeMessage(SocketEvent.TYPING_STOP)
  async typingStop(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    try {
      const userId = client.userId;
      if (!userId) return;

      this.stopTyping(data.chatId, userId, client);
    } catch (error) {
      console.error('Error in typingStop:', error);
    }
  }

  private stopTyping(chatId: string, userId: string, client: AuthenticatedSocket) {
    const typingInChat = this.typingUsers.get(chatId);
    if (typingInChat && typingInChat.has(userId)) {
      typingInChat.delete(userId);
      
      client.to(`chat_${chatId}`).emit(SocketEvent.USER_STOPPED_TYPING, {
        chatId,
        userId
      });
    }
  }

  @SubscribeMessage(SocketEvent.GET_ONLINE_USERS)
  async getOnlineUsers(@ConnectedSocket() client: AuthenticatedSocket) {
    try {
      const onlineUserIds = Array.from(this.onlineUsers.keys());
      
      client.emit(SocketEvent.ONLINE_USERS_LIST, {
        users: onlineUserIds,
        count: onlineUserIds.length
      });
    } catch (error) {
      client.emit(SocketEvent.ERROR, {
        code: ErrorCode.UNKNOWN_ERROR,
        message: error.message
      });
    }
  }

  // Вспомогательные методы для отправки событий
  sendMessageToUser(userId: string, event: SocketEvent, data: any) {
    const userSockets = this.onlineUsers.get(userId);
    if (userSockets) {
      userSockets.forEach(socketId => {
        this.server.to(socketId).emit(event, data);
      });
    }
  }

  sendMessageToChat(chatId: string, event: SocketEvent, data: any) {
    this.server.to(`chat_${chatId}`).emit(event, data);
  }
}
