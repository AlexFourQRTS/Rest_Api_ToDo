import { IsString, IsOptional, IsEnum, IsArray, IsUUID, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatType } from '../entities/chat.model';

export class CreateChatDto {
  @ApiProperty({
    description: 'Название чата',
    example: 'Мой чат',
    minLength: 1,
    maxLength: 100
  })
  @IsString({ message: 'Название должно быть строкой' })
  @MinLength(1, { message: 'Название не может быть пустым' })
  @MaxLength(100, { message: 'Название не может быть длиннее 100 символов' })
  name: string;

  @ApiPropertyOptional({
    description: 'Описание чата',
    example: 'Описание моего чата',
    maxLength: 500
  })
  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(500, { message: 'Описание не может быть длиннее 500 символов' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Тип чата',
    enum: ChatType,
    default: ChatType.PRIVATE
  })
  @IsOptional()
  @IsEnum(ChatType, { message: 'Неверный тип чата' })
  chatType?: ChatType;

  @ApiPropertyOptional({
    description: 'Список участников (UUID пользователей)',
    example: ['uuid1', 'uuid2'],
    type: [String]
  })
  @IsOptional()
  @IsArray({ message: 'Участники должны быть массивом' })
  @IsUUID('4', { each: true, message: 'Каждый участник должен быть валидным UUID' })
  participants?: string[];

  @ApiPropertyOptional({
    description: 'Дополнительные метаданные чата',
    example: { theme: 'dark', notifications: true }
  })
  @IsOptional()
  metadata?: any;
}
