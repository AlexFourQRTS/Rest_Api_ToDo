import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { FilesModule } from './file/files.module'
import { PhotoModule } from './photo/photo.module';
import { VideoModule } from './video/video.module';
import { AudioModule } from './audio/audio.module';
import { BlogModule } from './blog/blog.module';

import { GlobalMiddleware } from './middleware/globalMiddleware';
import { DdosMonitorController } from './middleware/ddos-monitor.controller';

import { AuthModule } from './auth/auth.module';
import { ThinkModule } from './think/think.module';
import { ChatModule } from './chat/chat.module';
import { NestFrameModule } from './nest-frame/nest-frame.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 100, 
    }]),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        models: [__dirname + '/**/*.model{.ts,.js}'],
        autoLoadModels: true,
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    FilesModule,
    PhotoModule,
    VideoModule,
    AudioModule,
    BlogModule,
    AuthModule,
    ThinkModule,
    ChatModule,
    NestFrameModule
  ],
  controllers: [AppController, DdosMonitorController],
  providers: [AppService, GlobalMiddleware],
})
export class AppModule {}