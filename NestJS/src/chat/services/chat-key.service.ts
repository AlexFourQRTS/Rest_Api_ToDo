import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatKey } from '../entities/chat-key.entity';
import { ErrorCode } from '../../common/enums';

/**
 * Сервис для управления ключами шифрования чатов
 * 
 * ВАЖНО: Этот сервис НЕ расшифровывает ключи!
 * Он только хранит зашифрованные ключи для каждого пользователя
 */
@Injectable()
export class ChatKeyService {
  constructor(
    @InjectRepository(ChatKey)
    private chatKeyRepository: Repository<ChatKey>,
  ) {}

  /**
   * Сохранить зашифрованные ключи для участников чата
   */
  async storeKeys(
    chatId: string,
    encryptedKeys: Record<string, string>, // userId -> encryptedKey
    metadata?: any
  ): Promise<ChatKey[]> {
    const keys: ChatKey[] = [];

    for (const [userId, encryptedKey] of Object.entries(encryptedKeys)) {
      const chatKey = this.chatKeyRepository.create({
        chatId,
        userId,
        encryptedKey,
        version: 1,
        validFrom: new Date(),
        metadata,
      });

      keys.push(await this.chatKeyRepository.save(chatKey));
    }

    return keys;
  }

  /**
   * Получить зашифрованный ключ для конкретного пользователя
   * Пользователь расшифрует его на клиенте своим приватным ключом
   */
  async getKeyForUser(chatId: string, userId: string): Promise<string> {
    const chatKey = await this.chatKeyRepository.findOne({
      where: {
        chatId,
        userId,
        validUntil: null, // Только активные ключи
      },
      order: {
        version: 'DESC', // Последняя версия
      },
    });

    if (!chatKey) {
      throw new NotFoundException({
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: 'Ключ чата не найден для этого пользователя',
      });
    }

    return chatKey.encryptedKey;
  }

  /**
   * Получить все ключи чата (для всех участников)
   * Используется при добавлении нового участника
   */
  async getAllKeysForChat(chatId: string): Promise<ChatKey[]> {
    return await this.chatKeyRepository.find({
      where: {
        chatId,
        validUntil: null,
      },
      order: {
        version: 'DESC',
      },
    });
  }

  /**
   * Добавить ключ для нового участника
   */
  async addKeyForParticipant(
    chatId: string,
    userId: string,
    encryptedKey: string,
    addedBy: string,
  ): Promise<ChatKey> {
    // Проверяем что добавляющий сам участник чата
    const adderKey = await this.chatKeyRepository.findOne({
      where: { chatId, userId: addedBy },
    });

    if (!adderKey) {
      throw new ForbiddenException({
        code: ErrorCode.ACCESS_DENIED,
        message: 'Только участники чата могут добавлять новых участников',
      });
    }

    // Проверяем что ключ для этого пользователя еще не существует
    const existingKey = await this.chatKeyRepository.findOne({
      where: { chatId, userId },
    });

    if (existingKey) {
      throw new ForbiddenException({
        code: ErrorCode.DUPLICATE_ENTRY,
        message: 'Ключ для этого пользователя уже существует',
      });
    }

    const chatKey = this.chatKeyRepository.create({
      chatId,
      userId,
      encryptedKey,
      version: adderKey.version, // Та же версия что у добавляющего
      validFrom: new Date(),
    });

    return await this.chatKeyRepository.save(chatKey);
  }

  /**
   * Ротация ключа (создание новой версии)
   * Используется если ключ скомпрометирован или участник покинул чат
   */
  async rotateKeys(
    chatId: string,
    newEncryptedKeys: Record<string, string>,
    initiatedBy: string,
  ): Promise<ChatKey[]> {
    // Проверяем права
    const initiatorKey = await this.chatKeyRepository.findOne({
      where: { chatId, userId: initiatedBy },
    });

    if (!initiatorKey) {
      throw new ForbiddenException({
        code: ErrorCode.ACCESS_DENIED,
        message: 'Только участники могут ротировать ключи',
      });
    }

    // Деактивируем старые ключи
    await this.chatKeyRepository.update(
      { chatId, validUntil: null },
      { validUntil: new Date() }
    );

    // Создаем новые ключи
    const newVersion = initiatorKey.version + 1;
    const keys: ChatKey[] = [];

    for (const [userId, encryptedKey] of Object.entries(newEncryptedKeys)) {
      const chatKey = this.chatKeyRepository.create({
        chatId,
        userId,
        encryptedKey,
        version: newVersion,
        validFrom: new Date(),
      });

      keys.push(await this.chatKeyRepository.save(chatKey));
    }

    return keys;
  }

  /**
   * Удалить ключ пользователя (когда он покидает чат)
   */
  async removeKeyForUser(chatId: string, userId: string): Promise<void> {
    await this.chatKeyRepository.update(
      { chatId, userId, validUntil: null },
      { validUntil: new Date() }
    );
  }

  /**
   * Проверить есть ли у пользователя доступ к ключу чата
   */
  async hasAccessToChat(chatId: string, userId: string): Promise<boolean> {
    const key = await this.chatKeyRepository.findOne({
      where: {
        chatId,
        userId,
        validUntil: null,
      },
    });

    return !!key;
  }
}

