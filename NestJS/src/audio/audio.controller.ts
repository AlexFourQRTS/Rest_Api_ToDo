import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from '../file/interfaces'
import { AudioService } from './audio.service';
import { Response } from 'express';
import { multerConfig, audioLimits } from '../common/config/multer.config';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('audio', { ...multerConfig, limits: audioLimits }))
  async uploadAudio(@UploadedFile() audio: MulterFile) {
    if (!audio) {
      throw new BadRequestException('Пожалуйста, загрузите аудио!');
    }

  }


}