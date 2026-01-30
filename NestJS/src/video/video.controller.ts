import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from '../file/interfaces';
import { VideoService } from './video.service';
import { Response } from 'express';
import { multerConfig, videoLimits } from '../common/config/multer.config';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}







}