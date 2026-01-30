import { Injectable, HttpException, HttpStatus, OnModuleDestroy } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ensureDir, writeFile, readFile, unlink } from 'fs-extra';
import { join, extname } from 'path';
import { MulterFile } from '../file/interfaces';
import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VideoService implements OnModuleDestroy {
  private client: Client;
  private readonly baseUploadDir = join(process.cwd(), 'storage', 'videos');
  private readonly tempUploadDir = join(process.cwd(), 'uploads');
  private readonly allowedExtensions = /\.(mp4|avi|mov|wmv|flv|mkv)$/i; 

  constructor(private readonly configService: ConfigService) {
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