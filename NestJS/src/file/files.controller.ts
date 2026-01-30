import { Controller, Post, Get, Param, UseInterceptors, UploadedFiles, BadRequestException, HttpStatus, HttpException, Res, Req, Delete } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname, join } from 'path';

import { Response, Request } from 'express'; 

import { MulterFile } from './interfaces';
import { FilesService } from './files.service';

import * as fs from 'fs'; 
import { promisify } from 'util';



@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }


}

