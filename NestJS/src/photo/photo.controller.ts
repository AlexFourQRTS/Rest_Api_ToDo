import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from '../file/interfaces';
import { PhotoService } from './photo.service';
import { Response } from 'express';
import { multerConfig, photoLimits } from '../common/config/multer.config';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('photo', { ...multerConfig, limits: photoLimits }))
  async uploadPhoto(@UploadedFile() photo: MulterFile) {
    if (!photo) {
      throw new BadRequestException('Пожалуйста, загрузите изображение!');
    }
    const fileDetails = await this.photoService.savePhoto(photo);
    return { message: 'Изображение успешно загружено!', data: fileDetails };
  }

  @Get()
  async getPhotos() {
    return this.photoService.getAllPhotos();
  }

  @Get(':id')
  async downloadPhoto(@Param('id') photoId: string, @Res() responseFile: Response) {
    const photoInfo = await this.photoService.getPhotoById(photoId);
    responseFile.sendFile(photoInfo.path);
  }
}