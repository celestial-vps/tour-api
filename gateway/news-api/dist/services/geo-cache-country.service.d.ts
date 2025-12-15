import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export interface Country {
    oid: string;
    countryName: string;
}
export declare class GeoCacheCountryService implements OnModuleDestroy {
    private readonly configService;
    private readonly logger;
    private readonly redisClient;
    private readonly redisKey;
    constructor(configService: ConfigService);
    onModuleDestroy(): Promise<void>;
    upsertCountry(country: Country): Promise<void>;
    getCountries(): Promise<Country[]>;
    deleteCountry(oid: string): Promise<void>;
    clearCountries(): Promise<void>;
    getCountryById(oid: string): Promise<Country | null>;
    searchCountriesByName(name: string): Promise<Country[]>;
}
