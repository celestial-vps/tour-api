import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: ['http://192.168.1.6:4200', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  // Global API prefix
  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('REST API NestJS + SocketIO')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Terlalu banyak request, coba lagi nanti',
    }),
  );
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
