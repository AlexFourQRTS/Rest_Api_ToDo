import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateChatDto } from './create-chat.dto';

export class UpdateChatDto extends PartialType(CreateChatDto) {
  @ApiProperty({
    description: 'ID чата для обновления',
    example: 'uuid-chat-id'
  })
  id: string;
}
