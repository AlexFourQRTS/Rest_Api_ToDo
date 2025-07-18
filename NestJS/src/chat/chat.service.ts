import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Chat, ChatType } from './entities/chat.model';
import { CreateChatDto, UpdateChatDto } from './dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat)
    private chatModel: typeof Chat,
  ) {}

  async create(createChatDto: CreateChatDto, userId: string): Promise<Chat> {
    const chat = await this.chatModel.create({
      ...createChatDto,
      createdBy: userId,
      participants: createChatDto.participants 
        ? [...new Set([userId, ...createChatDto.participants])] 
        : [userId],
      chatType: createChatDto.chatType || ChatType.PRIVATE,
    });

    return chat;
  }

  async findAll(userId: string, query: any = {}): Promise<{ chats: Chat[]; total: number; page: number; totalPages: number }> {
    const { type, page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const where: any = {
      isActive: true,
      participants: {
        [Op.contains]: [userId]
      }
    };

    if (type && Object.values(ChatType).includes(type)) {
      where.chatType = type;
    }

    const { rows: chats, count: total } = await this.chatModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      order: [['updatedAt', 'DESC']],
    });

    return {
      chats,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string): Promise<Chat> {
    const chat = await this.chatModel.findOne({
      where: {
        id,
        isActive: true,
        participants: {
          [Op.contains]: [userId]
        }
      }
    });

    if (!chat) {
      throw new NotFoundException('Чат не найден');
    }

    return chat;
  }

  async update(id: string, updateChatDto: UpdateChatDto, userId: string): Promise<Chat> {
    const chat = await this.findOne(id, userId);

    // Проверяем права на редактирование
    if (chat.createdBy !== userId && chat.chatType !== ChatType.GROUP) {
      throw new ForbiddenException('Нет прав на редактирование этого чата');
    }

    await chat.update(updateChatDto);
    return chat;
  }

  async remove(id: string, userId: string): Promise<{ message: string; status: string }> {
    const chat = await this.findOne(id, userId);

    // Проверяем права на удаление
    if (chat.createdBy !== userId) {
      throw new ForbiddenException('Нет прав на удаление этого чата');
    }

    await chat.update({ isActive: false });
    
    return {
      message: 'Чат успешно удален',
      status: 'success'
    };
  }

  async addParticipant(chatId: string, userId: string, participantId: string): Promise<Chat> {
    const chat = await this.findOne(chatId, userId);

    if (chat.createdBy !== userId) {
      throw new ForbiddenException('Нет прав на добавление участников');
    }

    const participants = chat.participants || [];
    if (!participants.includes(participantId)) {
      participants.push(participantId);
      await chat.update({ participants });
    }

    return chat;
  }

  async removeParticipant(chatId: string, userId: string, participantId: string): Promise<Chat> {
    const chat = await this.findOne(chatId, userId);

    if (chat.createdBy !== userId) {
      throw new ForbiddenException('Нет прав на удаление участников');
    }

    const participants = chat.participants || [];
    const updatedParticipants = participants.filter(id => id !== participantId);
    
    await chat.update({ participants: updatedParticipants });

    return chat;
  }
}
