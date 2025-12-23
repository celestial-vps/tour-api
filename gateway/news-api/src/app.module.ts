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
import { NewsCategoryModule } from './modules/news-category.module';
import { NewsModule } from './modules/news.module';
import { CountryModule } from './modules/country.module';
import { ImageFileModule } from './modules/image-file.module';
import { Tag } from './models/tag.entity';
import { TagModule } from './modules/tag.module';
import { BannerModule } from './modules/banner.module';
import { NewsImageDetailModule } from './modules/news-image-detail.module';
// Modules

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`, 
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    BankModule, AuthModule, CountryModule, NewsCategoryModule, NewsModule,
    TagModule,NewsImageDetailModule,
    // BannerModule,
    ImageFileModule,
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
