import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ArrayContains } from 'typeorm';
import { Chat, ChatType } from './entities/chat.entity';
import { CreateChatDto, UpdateChatDto, CreateEncryptedChatDto } from './dto';
import { ChatKeyService } from './services/chat-key.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private chatKeyService: ChatKeyService,
  ) {}

  async create(createChatDto: CreateChatDto, userId: string): Promise<Chat> {
    const chat = this.chatRepository.create({
      ...createChatDto,
      createdBy: userId,
      participants: createChatDto.participants 
        ? [...new Set([userId, ...createChatDto.participants])] 
        : [userId],
      chatType: createChatDto.chatType || ChatType.PRIVATE,
    });

    return await this.chatRepository.save(chat);
  }

  async createEncrypted(dto: CreateEncryptedChatDto, userId: string) {
    const createdChat = await this.create({
      name: dto.name,
      description: dto.description,
      chatType: dto.chatType,
      participants: dto.participants,
      metadata: {
        ...dto.metadata,
        isEncrypted: true,
      },
    }, userId);

    await this.chatKeyService.storeKeys(
      createdChat.id,
      dto.encryptedKeys,
      { algorithm: 'AES-256-GCM' }
    );

    return {
      ...createdChat,
      message: '🔐 E2E encrypted chat created. Server cannot read messages!',
    };
  }

  async findAll(userId: string, query: any = {}): Promise<{ chats: Chat[]; total: number; page: number; totalPages: number }> {
    const { type, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
      participants: ArrayContains([userId])
    };

    if (type && Object.values(ChatType).includes(type)) {
      where.chatType = type;
    }

    const [chats, total] = await this.chatRepository.findAndCount({
      where,
      skip,
      take: parseInt(limit),
      order: { updatedAt: 'DESC' },
    });

    return {
      chats,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: {
        id,
        isActive: true,
        participants: ArrayContains([userId])
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

    Object.assign(chat, updateChatDto);
    return await this.chatRepository.save(chat);
  }

  async remove(id: string, userId: string): Promise<{ message: string; status: string }> {
    const chat = await this.findOne(id, userId);

    // Проверяем права на удаление
    if (chat.createdBy !== userId) {
      throw new ForbiddenException('Нет прав на удаление этого чата');
    }

    chat.isActive = false;
    await this.chatRepository.save(chat);
    
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
      chat.participants = participants;
      await this.chatRepository.save(chat);
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
    
    chat.participants = updatedParticipants;
    await this.chatRepository.save(chat);

    return chat;
  }
}
