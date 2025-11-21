// src/geo-cache/geo-cache-country.service.ts

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export interface Country {
  id: string;
  countryName: string;
}

@Injectable()
export class GeoCacheCountryService implements OnModuleDestroy {
  private readonly logger = new Logger(GeoCacheCountryService.name);
  private readonly redisClient: Redis;
  private readonly redisKey = 'geo:countries';

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    const redisHost = this.configService.get<string>('REDIS_HOST', '127.0.0.1');
    const redisPort = this.configService.get<number>('REDIS_PORT', 6379);

    // Priority:
    // 1. REDIS_URL
    // 2. REDIS_HOST + REDIS_PORT
    if (redisUrl) {
      this.logger.log(`Connecting to Redis using URL: ${redisUrl}`);
      this.redisClient = new Redis(redisUrl);
    } else {
      this.logger.log(`Connecting to Redis: ${redisHost}:${redisPort}`);
      this.redisClient = new Redis({
        host: redisHost,
        port: redisPort,
      });
    }
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  /** Insert atau update country di Redis */
  async upsertCountry(country: Country) {
    try {
      const data = await this.redisClient.get(this.redisKey);
      const countries: Country[] = data ? JSON.parse(data) : [];

      const index = countries.findIndex(c => c.id === country.id);

      if (index !== -1) {
        countries[index] = country;
      } else {
        countries.push(country);
      }

      await this.redisClient.set(this.redisKey, JSON.stringify(countries));
    } catch (err) {
      this.logger.error('Redis error (upsertCountry)', err);
      throw err;
    }
  }

  /** Get all countries */
  async getCountries(): Promise<Country[]> {
    try {
      const data = await this.redisClient.get(this.redisKey);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      this.logger.error('Redis error (getCountries)', err);
      return [];
    }
  }

  /** Delete a country by ID */
  async deleteCountry(id: string) {
    try {
      const data = await this.redisClient.get(this.redisKey);
      let countries: Country[] = data ? JSON.parse(data) : [];

      countries = countries.filter(c => c.id !== id);

      await this.redisClient.set(this.redisKey, JSON.stringify(countries));
    } catch (err) {
      this.logger.error('Redis error (deleteCountry)', err);
      throw err;
    }
  }

  /** Clear all countries */
  async clearCountries() {
    try {
      await this.redisClient.del(this.redisKey);
    } catch (err) {
      this.logger.error('Redis error (clearCountries)', err);
      throw err;
    }
  }

  /** Get a country by ID */
  async getCountryById(id: string): Promise<Country | null> {
    try {
      const countries = await this.getCountries();
      return countries.find(c => c.id === id) || null;
    } catch (err) {
      this.logger.error('Redis error (getCountryById)', err);
      return null;
    }
  }

  /** Search countries by name */
  async searchCountriesByName(name: string): Promise<Country[]> {
    try {
      const countries = await this.getCountries();
      const lowerName = name.toLowerCase();
      return countries.filter(c => c.countryName?.toLowerCase().includes(lowerName));
    } catch (err) {
      this.logger.error('Redis error (searchCountriesByName)', err);
      return [];
    }
  }
}
