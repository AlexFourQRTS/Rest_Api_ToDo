import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { getTypeOrmConfig } from './config/typeorm.config';
import configuration from './config/configuration';
import { validate } from './config/env.validation';

import { FilesModule } from './file/files.module'

import { PhotoModule } from './photo/photo.module';

import { VideoModule } from './video/video.module';

import { AudioModule } from './audio/audio.module';

import { BlogModule } from './blog/blog.module';

import { GlobalMiddleware } from './middleware/globalMiddleware';
import { DdosMonitorController } from './middleware/ddos-monitor.controller';

import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration], 
      validate,              
      cache: true,          
      expandVariables: true,
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [{
        ttl: config.get('throttle.ttl'),
        limit: config.get('throttle.limit'),
      }],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getTypeOrmConfig(configService),
      inject: [ConfigService],
    }),
    FilesModule,
    PhotoModule,
    VideoModule,
    AudioModule,

    BlogModule,

    AuthModule,

    ChatModule,
  ],
  controllers: [DdosMonitorController],
  providers: [GlobalMiddleware],
})
export class AppModule {}