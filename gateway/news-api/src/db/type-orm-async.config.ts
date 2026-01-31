import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'mysql',
      host: configService.get<string>('DB_HOST')!,       // pakai nama dari .env
      port: parseInt(configService.get<string>('DB_PORT')!, 10),
      username: configService.get<string>('DB_USERNAME')!,
      password: configService.get<string>('DB_PASSWORD')!,
      database: configService.get<string>('DB_NAME')!,
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
      synchronize: false,
      logging: true,
      logger: 'advanced-console',
    };
  },
};
