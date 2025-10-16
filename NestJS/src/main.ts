import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { NotFoundFilter } from './filters/not-found.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { GlobalMiddleware } from './middleware/globalMiddleware';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const globalMiddleware = app.get(GlobalMiddleware);
  app.use(globalMiddleware.use.bind(globalMiddleware));
  
 
  app.enableCors({
    origin: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

 
  app.useStaticAssets(join(__dirname, '..', 'storage'), {
    prefix: '/files/',
  });

  
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  
  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });

  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'JWT-auth')
    .build();
  
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);


  app.useGlobalFilters(new HttpExceptionFilter(), new NotFoundFilter());

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();