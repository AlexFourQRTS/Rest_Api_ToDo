import { IsUUID, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMessagesDto {
  @IsUUID('4', { message: 'chatId должен быть валидным UUID' })
  chatId: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page должен быть числом' })
  @Min(1, { message: 'page должен быть >= 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit должен быть числом' })
  @Min(1, { message: 'limit должен быть >= 1' })
  @Max(100, { message: 'limit должен быть <= 100' })
  limit?: number = 50;

  @IsOptional()
  @IsUUID('4', { message: 'lastMessageId должен быть валидным UUID' })
  lastMessageId?: string;
}

