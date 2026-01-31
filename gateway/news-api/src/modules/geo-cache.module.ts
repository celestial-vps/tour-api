// src/geo-cache/geo-cache.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { GeoCacheCountryService } from '../services/geo-cache-country.service';

@Module({
  imports: [ConfigModule],
  providers: [GeoCacheCountryService],
  exports: [GeoCacheCountryService],
})
export class GeoCacheModule {}
