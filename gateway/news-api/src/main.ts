import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://192.168.1.6:4200', 'http://localhost:4300'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('REST API NestJS + SocketIO')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document);

  // Rate limiter (mirip Express)
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 menit
      max: 100,
      message: 'Terlalu banyak request, coba lagi nanti',
    }),
  );

  await app.listen(5010);
}
bootstrap();
