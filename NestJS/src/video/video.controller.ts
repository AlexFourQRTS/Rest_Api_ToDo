import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from '../file/interfaces';
import { VideoService } from './video.service';
import { Response } from 'express';
import { multerConfig, videoLimits } from '../common/config/multer.config';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('video', { ...multerConfig, limits: videoLimits }))
  async uploadVideo(@UploadedFile() video: MulterFile) {
    if (!video) {
      throw new BadRequestException('Пожалуйста, загрузите видео!');
    }
    const fileDetails = await this.videoService.saveVideo(video);
    return { message: 'Видео успешно загружено!', data: fileDetails };
  }

  @Get()
  async getVideos() {
    return this.videoService.getAllVideos();
  }

  @Get(':id')
  async downloadVideo(@Param('id') videoId: string, @Res() responseFile: Response) {
    const videoInfo = await this.videoService.getVideoById(videoId);
    responseFile.sendFile(videoInfo.path);
  }
}