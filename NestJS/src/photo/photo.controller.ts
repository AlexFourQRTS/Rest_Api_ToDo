import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from '../file/interfaces';
import { PhotoService } from './photo.service';
import { Response } from 'express';
import { multerConfig, photoLimits } from '../common/config/multer.config';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}




}