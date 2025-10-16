import { IsString, IsUUID, MaxLength, IsNotEmpty } from 'class-validator';

export class EditMessageDto {
  @IsUUID('4', { message: 'messageId должен быть валидным UUID' })
  @IsNotEmpty({ message: 'messageId обязателен' })
  messageId: string;

  @IsString({ message: 'Контент должен быть строкой' })
  @MaxLength(10000, { message: 'Сообщение не может быть длиннее 10000 символов' })
  @IsNotEmpty({ message: 'Контент сообщения не может быть пустым' })
  content: string;
}

