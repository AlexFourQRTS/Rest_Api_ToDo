import { IsString, IsOptional, IsEnum, IsArray, IsUUID, MinLength, MaxLength } from 'class-validator';
import { ChatType } from '../entities/chat.entity';

export class CreateChatDto {
  @IsString({ message: 'Название должно быть строкой' })
  @MinLength(1, { message: 'Название не может быть пустым' })
  @MaxLength(100, { message: 'Название не может быть длиннее 100 символов' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(500, { message: 'Описание не может быть длиннее 500 символов' })
  description?: string;

  @IsOptional()
  @IsEnum(ChatType, { message: 'Неверный тип чата' })
  chatType?: ChatType;

  @IsOptional()
  @IsArray({ message: 'Участники должны быть массивом' })
  @IsUUID('4', { each: true, message: 'Каждый участник должен быть валидным UUID' })
  participants?: string[];

  @IsOptional()
  metadata?: any;
}
