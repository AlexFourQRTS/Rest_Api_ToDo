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
  Request,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery,
  ApiParam
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateChatDto, UpdateChatDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый чат' })
  @ApiResponse({ 
    status: 201, 
    description: 'Чат успешно создан',
    schema: {
      example: {
        id: 'uuid',
        name: 'Мой чат',
        description: 'Описание чата',
        chatType: 'private',
        createdBy: 'user-uuid',
        participants: ['user-uuid'],
        isActive: true,
        createdAt: '2025-06-20T01:00:00.000Z',
        updatedAt: '2025-06-20T01:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async create(@Body() createChatDto: CreateChatDto, @Request() req) {
    try {
      return await this.chatService.create(createChatDto, req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Ошибка при создании чата',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Получить все чаты пользователя' })
  @ApiQuery({ name: 'type', required: false, enum: ['private', 'group', 'channel'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ 
    status: 200, 
    description: 'Список чатов получен',
    schema: {
      example: {
        chats: [
          {
            id: 'uuid',
            name: 'Мой чат',
            description: 'Описание чата',
            chatType: 'private',
            createdBy: 'user-uuid',
            participants: ['user-uuid'],
            isActive: true,
            createdAt: '2025-06-20T01:00:00.000Z',
            updatedAt: '2025-06-20T01:00:00.000Z'
          }
        ],
        total: 1,
        page: 1,
        totalPages: 1
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async findAll(@Query() query: any, @Request() req) {
    try {
      return await this.chatService.findAll(req.user.id, query);
    } catch (error) {
      throw new HttpException(
        error.message || 'Ошибка при получении чатов',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить чат по ID' })
  @ApiParam({ name: 'id', description: 'ID чата' })
  @ApiResponse({ 
    status: 200, 
    description: 'Чат найден',
    schema: {
      example: {
        id: 'uuid',
        name: 'Мой чат',
        description: 'Описание чата',
        chatType: 'private',
        createdBy: 'user-uuid',
        participants: ['user-uuid'],
        isActive: true,
        createdAt: '2025-06-20T01:00:00.000Z',
        updatedAt: '2025-06-20T01:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Чат не найден' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      return await this.chatService.findOne(id, req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Ошибка при получении чата',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить чат' })
  @ApiParam({ name: 'id', description: 'ID чата' })
  @ApiResponse({ 
    status: 200, 
    description: 'Чат обновлен',
    schema: {
      example: {
        id: 'uuid',
        name: 'Обновленный чат',
        description: 'Новое описание',
        chatType: 'group',
        createdBy: 'user-uuid',
        participants: ['user-uuid'],
        isActive: true,
        createdAt: '2025-06-20T01:00:00.000Z',
        updatedAt: '2025-06-20T01:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Чат не найден' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Нет прав на редактирование' })
  async update(
    @Param('id') id: string,
    @Body() updateChatDto: UpdateChatDto,
    @Request() req
  ) {
    try {
      return await this.chatService.update(id, updateChatDto, req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Ошибка при обновлении чата',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить чат' })
  @ApiParam({ name: 'id', description: 'ID чата' })
  @ApiResponse({ 
    status: 200, 
    description: 'Чат удален',
    schema: {
      example: {
        message: 'Чат успешно удален',
        status: 'success'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Чат не найден' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Нет прав на удаление' })
  async remove(@Param('id') id: string, @Request() req) {
    try {
      return await this.chatService.remove(id, req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Ошибка при удалении чата',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 