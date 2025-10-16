import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Message } from './entities/message.entity';
import { ChatService } from './chat.service';
import { SendMessageDto, EditMessageDto, GetMessagesDto } from './dto';
import { MessageStatus, ErrorCode } from '../common/enums';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private chatService: ChatService,
  ) {}

  async sendMessage(sendMessageDto: SendMessageDto, userId: string): Promise<Message> {
    const { chatId, content, type, attachments, replyTo, mentions } = sendMessageDto;

    // Проверяем что пользователь участник чата
    const chat = await this.chatService.findOne(chatId, userId);
    
    if (!chat.isActive) {
      throw new BadRequestException({
        code: ErrorCode.CHAT_INACTIVE,
        message: 'Чат неактивен'
      });
    }

    // Если есть ответ на сообщение, проверяем что оно существует
    if (replyTo) {
      const replyMessage = await this.messageRepository.findOne({
        where: { id: replyTo, chatId }
      });
      if (!replyMessage) {
        throw new NotFoundException({
          code: ErrorCode.MESSAGE_NOT_FOUND,
          message: 'Сообщение для ответа не найдено'
        });
      }
    }

    const message = this.messageRepository.create({
      chatId,
      senderId: userId,
      content,
      type,
      attachments,
      status: MessageStatus.SENT,
      metadata: {
        replyTo,
        mentions,
        reactions: []
      },
      deliveredTo: [userId],
      readBy: [userId],
    });

    return await this.messageRepository.save(message);
  }

  async getMessages(getMessagesDto: GetMessagesDto, userId: string): Promise<{
    messages: Message[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { chatId, page = 1, limit = 50, lastMessageId } = getMessagesDto;

    // Проверяем доступ к чату
    await this.chatService.findOne(chatId, userId);

    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .where('message.chatId = :chatId', { chatId })
      .andWhere('message.isDeleted = false')
      .orderBy('message.createdAt', 'DESC');

    // Если указан lastMessageId, загружаем сообщения старше его
    if (lastMessageId) {
      const lastMessage = await this.messageRepository.findOne({
        where: { id: lastMessageId }
      });
      if (lastMessage) {
        queryBuilder.andWhere('message.createdAt < :lastMessageDate', {
          lastMessageDate: lastMessage.createdAt
        });
      }
    }

    const skip = (page - 1) * limit;
    const [messages, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      messages: messages.reverse(), // Возвращаем в хронологическом порядке
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async editMessage(editMessageDto: EditMessageDto, userId: string): Promise<Message> {
    const { messageId, content } = editMessageDto;

    const message = await this.messageRepository.findOne({
      where: { id: messageId }
    });

    if (!message) {
      throw new NotFoundException({
        code: ErrorCode.MESSAGE_NOT_FOUND,
        message: 'Сообщение не найдено'
      });
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException({
        code: ErrorCode.ACCESS_DENIED,
        message: 'Вы можете редактировать только свои сообщения'
      });
    }

    if (message.isDeleted) {
      throw new BadRequestException({
        code: ErrorCode.MESSAGE_NOT_FOUND,
        message: 'Сообщение удалено'
      });
    }

    message.content = content;
    message.isEdited = true;
    message.metadata = {
      ...message.metadata,
      edited: true,
      editedAt: new Date(),
    };

    return await this.messageRepository.save(message);
  }

  async deleteMessage(messageId: string, userId: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId }
    });

    if (!message) {
      throw new NotFoundException({
        code: ErrorCode.MESSAGE_NOT_FOUND,
        message: 'Сообщение не найдено'
      });
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException({
        code: ErrorCode.ACCESS_DENIED,
        message: 'Вы можете удалять только свои сообщения'
      });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    message.content = 'Сообщение удалено';

    return await this.messageRepository.save(message);
  }

  async markAsRead(chatId: string, userId: string, messageIds?: string[]): Promise<void> {
    // Проверяем доступ к чату
    await this.chatService.findOne(chatId, userId);

    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .where('message.chatId = :chatId', { chatId })
      .andWhere('message.senderId != :userId', { userId })
      .andWhere('NOT (:userId = ANY(message.readBy))', { userId });

    if (messageIds && messageIds.length > 0) {
      queryBuilder.andWhere('message.id IN (:...messageIds)', { messageIds });
    }

    const messages = await queryBuilder.getMany();

    for (const message of messages) {
      message.readBy = [...new Set([...message.readBy, userId])];
      message.status = MessageStatus.READ;
    }

    if (messages.length > 0) {
      await this.messageRepository.save(messages);
    }
  }

  async markAsDelivered(chatId: string, userId: string): Promise<void> {
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.chatId = :chatId', { chatId })
      .andWhere('message.senderId != :userId', { userId })
      .andWhere('NOT (:userId = ANY(message.deliveredTo))', { userId })
      .andWhere('message.status = :status', { status: MessageStatus.SENT })
      .getMany();

    for (const message of messages) {
      message.deliveredTo = [...new Set([...message.deliveredTo, userId])];
      message.status = MessageStatus.DELIVERED;
    }

    if (messages.length > 0) {
      await this.messageRepository.save(messages);
    }
  }

  async addReaction(messageId: string, userId: string, emoji: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId }
    });

    if (!message) {
      throw new NotFoundException({
        code: ErrorCode.MESSAGE_NOT_FOUND,
        message: 'Сообщение не найдено'
      });
    }

    const reactions = message.metadata?.reactions || [];
    const existingReaction = reactions.find(r => r.emoji === emoji);

    if (existingReaction) {
      if (!existingReaction.userIds.includes(userId)) {
        existingReaction.userIds.push(userId);
      }
    } else {
      reactions.push({
        emoji,
        userIds: [userId]
      });
    }

    message.metadata = {
      ...message.metadata,
      reactions
    };

    return await this.messageRepository.save(message);
  }

  async removeReaction(messageId: string, userId: string, emoji: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId }
    });

    if (!message) {
      throw new NotFoundException({
        code: ErrorCode.MESSAGE_NOT_FOUND,
        message: 'Сообщение не найдено'
      });
    }

    const reactions = message.metadata?.reactions || [];
    const reactionIndex = reactions.findIndex(r => r.emoji === emoji);

    if (reactionIndex !== -1) {
      const userIndex = reactions[reactionIndex].userIds.indexOf(userId);
      if (userIndex !== -1) {
        reactions[reactionIndex].userIds.splice(userIndex, 1);
        
        // Удаляем реакцию если больше нет пользователей
        if (reactions[reactionIndex].userIds.length === 0) {
          reactions.splice(reactionIndex, 1);
        }
      }
    }

    message.metadata = {
      ...message.metadata,
      reactions
    };

    return await this.messageRepository.save(message);
  }
}

