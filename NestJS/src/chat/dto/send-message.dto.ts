import { IsString, IsOptional, IsEnum, IsUUID, IsArray, ValidateNested, MaxLength, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageType } from '../../common/enums';

class AttachmentDto {
  @IsString()
  url: string;

  @IsString()
  type: string;

  @IsString()
  name: string;

  size: number;
}

export class SendMessageDto {
  @IsUUID('4', { message: 'chatId должен быть валидным UUID' })
  @IsNotEmpty({ message: 'chatId обязателен' })
  chatId: string;

  @IsString({ message: 'Контент должен быть строкой' })
  @MaxLength(10000, { message: 'Сообщение не может быть длиннее 10000 символов' })
  @IsNotEmpty({ message: 'Контент сообщения не может быть пустым' })
  content: string;

  @IsOptional()
  @IsEnum(MessageType, { message: 'Неверный тип сообщения' })
  type?: MessageType;

  @IsOptional()
  @IsArray({ message: 'Вложения должны быть массивом' })
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @IsOptional()
  @IsUUID('4', { message: 'replyTo должен быть валидным UUID' })
  replyTo?: string;

  @IsOptional()
  @IsArray({ message: 'Mentions должны быть массивом' })
  @IsUUID('4', { each: true, message: 'Каждый mention должен быть валидным UUID' })
  mentions?: string[];
}

