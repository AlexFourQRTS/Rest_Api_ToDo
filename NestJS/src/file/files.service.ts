import { Injectable, OnModuleDestroy, BadRequestException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ensureDir, writeFile, readFile, unlink } from 'fs-extra';
import { join, extname } from 'path';
import { MulterFile } from './interfaces';
import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService  {
  private client: Client;

  private readonly imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  private readonly videoExtensions = /\.(mp4|webm|mov|avi|mkv)$/i;
  private readonly audioExtensions = /\.(mp3|wav|ogg|flac|m4a)$/i;
  private readonly documentExtensions = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|rtf)$/i;

  private readonly baseUploadDir = join(process.cwd(), 'CloudFile');
  private readonly typeDirs = {
    images: join(this.baseUploadDir, 'Images'),
    videos: join(this.baseUploadDir, 'Video'),
    audio: join(this.baseUploadDir, 'Musik'),
    documents: join(this.baseUploadDir, 'Document'),
    other: join(this.baseUploadDir, 'Other')
  };

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {
    this.client = new Client({
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
    });


  }





  async onModuleDestroy() {
    await this.client.end();
  }
}