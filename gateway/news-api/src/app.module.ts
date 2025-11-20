import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { typeOrmAsyncConfig } from './db/type-orm-async.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events.gateway';
import { BankModule } from './modules/bank.module';
import { AuthModule } from './modules/auth.module';
import { GeoCacheModule } from './modules/geo-cache.module';
// Modules

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    BankModule,AuthModule,
    GeoCacheModule // GeoCache module added here
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {
  // Optional: middleware example
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes(AppController);
  }
}
