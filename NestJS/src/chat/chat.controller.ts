import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards,
  Request
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatKeyService } from './services/chat-key.service';
import { CreateChatDto, UpdateChatDto, CreateEncryptedChatDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatKeyService: ChatKeyService,
  ) {}

  @Post()
  async create(@Body() createChatDto: CreateChatDto, @Request() req) {
    return this.chatService.create(createChatDto, req.user.id);
  }

  @Post('encrypted')
  async createEncrypted(@Body() dto: CreateEncryptedChatDto, @Request() req) {
    return this.chatService.createEncrypted(dto, req.user.id);
  }

  @Get(':chatId/key')
  async getChatKey(@Param('chatId') chatId: string, @Request() req) {
    const encryptedKey = await this.chatKeyService.getKeyForUser(chatId, req.user.id);
    return {
      chatId,
      encryptedKey,
      message: 'Decrypt this key with your private key on the client',
    };
  }

  @Post(':chatId/key/participant')
  async addKeyForParticipant(
    @Param('chatId') chatId: string,
    @Body() body: { userId: string; encryptedKey: string },
    @Request() req
  ) {
    const chatKey = await this.chatKeyService.addKeyForParticipant(
      chatId,
      body.userId,
      body.encryptedKey,
      req.user.id,
    );
    return {
      chatSuccess: true,
      message: 'Ключ добавлен для нового участника',
      chatKey,
    };
  }

  @Get()
  async findAll(@Query() queryParams: any, @Request() req) {
    return this.chatService.findAll(req.user.id, queryParams);
  }

  @Get(':id')
  async findOne(@Param('id') chatId: string, @Request() req) {
    return this.chatService.findOne(chatId, req.user.id);
  }

  @Patch(':id')
  async update(@Param('id') chatId: string, @Body() updateChatDto: UpdateChatDto, @Request() req) {
    return this.chatService.update(chatId, updateChatDto, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') chatId: string, @Request() req) {
    return this.chatService.remove(chatId, req.user.id);
  }
}