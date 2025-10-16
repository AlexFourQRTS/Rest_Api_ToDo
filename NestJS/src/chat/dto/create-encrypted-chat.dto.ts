import { IsString, IsOptional, IsEnum, IsArray, IsUUID, IsObject, MaxLength, MinLength } from 'class-validator';
import { ChatType } from '../entities/chat.entity';

export class CreateEncryptedChatDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsEnum(ChatType)
  chatType: ChatType;

  @IsArray()
  @IsUUID('4', { each: true })
  participants: string[];

  @IsObject()
  encryptedKeys: Record<string, string>;

  @IsOptional()
  @IsObject()
  metadata?: {
    isEncrypted: boolean;
    algorithm?: string;
    [key: string]: any;
  };
}

