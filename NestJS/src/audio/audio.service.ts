import { Injectable, HttpException, HttpStatus, OnModuleDestroy } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ensureDir, writeFile, readFile, unlink } from 'fs-extra';
import { join, extname } from 'path';
import { MulterFile } from '../file/interfaces'
import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AudioService {
  private client: Client;
  private readonly baseUploadDir = join(process.cwd(), 'storage', 'audio');
  private readonly tempUploadDir = join(process.cwd(), 'uploads');
  private readonly allowedExtensions = /\.(mp3|wav|ogg|flac|aac)$/i;


}



