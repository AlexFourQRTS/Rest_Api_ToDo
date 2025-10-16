import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from '../file/interfaces'
import { AudioService } from './audio.service';
import { Response } from 'express';
import { multerConfig, audioLimits } from '../common/config/multer.config';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('audio', { ...multerConfig, limits: audioLimits }))
  async uploadAudio(@UploadedFile() audio: MulterFile) {
    if (!audio) {
      throw new BadRequestException('Пожалуйста, загрузите аудио!');
    }
    const fileDetails = await this.audioService.saveAudio(audio);
    return { message: 'Аудио успешно загружено!', data: fileDetails };
  }

  @Get()
  async getAudio() {
    return this.audioService.getAllAudio();
  }

  @Get(':id')
  async downloadAudio(@Param('id') audioId: string, @Res() responseFile: Response) {
    const audioInfo = await this.audioService.getAudioById(audioId);
    responseFile.sendFile(audioInfo.path);
  }
}