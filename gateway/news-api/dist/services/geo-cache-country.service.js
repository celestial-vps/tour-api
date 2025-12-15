"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var GeoCacheCountryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoCacheCountryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
let GeoCacheCountryService = GeoCacheCountryService_1 = class GeoCacheCountryService {
    configService;
    logger = new common_1.Logger(GeoCacheCountryService_1.name);
    redisClient;
    redisKey = 'geo:countries';
    constructor(configService) {
        this.configService = configService;
        const redisUrl = this.configService.get('REDIS_URL');
        const redisHost = this.configService.get('REDIS_HOST', '127.0.0.1');
        const redisPort = this.configService.get('REDIS_PORT', 6379);
        if (redisUrl) {
            this.logger.log(`Connecting to Redis using URL: ${redisUrl}`);
            this.redisClient = new ioredis_1.default(redisUrl);
        }
        else {
            this.logger.log(`Connecting to Redis: ${redisHost}:${redisPort}`);
            this.redisClient = new ioredis_1.default({
                host: redisHost,
                port: redisPort,
            });
        }
    }
    async onModuleDestroy() {
        await this.redisClient.quit();
    }
    async upsertCountry(country) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            const countries = data ? JSON.parse(data) : [];
            const index = countries.findIndex(c => c.oid === country.oid);
            if (index !== -1) {
                countries[index] = country;
            }
            else {
                countries.push(country);
            }
            await this.redisClient.set(this.redisKey, JSON.stringify(countries));
        }
        catch (err) {
            this.logger.error('Redis error (upsertCountry)', err);
            throw err;
        }
    }
    async getCountries() {
        try {
            const data = await this.redisClient.get(this.redisKey);
            return data ? JSON.parse(data) : [];
        }
        catch (err) {
            this.logger.error('Redis error (getCountries)', err);
            return [];
        }
    }
    async deleteCountry(oid) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            let countries = data ? JSON.parse(data) : [];
            countries = countries.filter(c => c.oid !== oid);
            await this.redisClient.set(this.redisKey, JSON.stringify(countries));
        }
        catch (err) {
            this.logger.error('Redis error (deleteCountry)', err);
            throw err;
        }
    }
    async clearCountries() {
        try {
            await this.redisClient.del(this.redisKey);
        }
        catch (err) {
            this.logger.error('Redis error (clearCountries)', err);
            throw err;
        }
    }
    async getCountryById(oid) {
        try {
            const countries = await this.getCountries();
            return countries.find(c => c.oid === oid) || null;
        }
        catch (err) {
            this.logger.error('Redis error (getCountryById)', err);
            return null;
        }
    }
    async searchCountriesByName(name) {
        try {
            const countries = await this.getCountries();
            const lowerName = name.toLowerCase();
            return countries.filter(c => c.countryName?.toLowerCase().includes(lowerName));
        }
        catch (err) {
            this.logger.error('Redis error (searchCountriesByName)', err);
            return [];
        }
    }
};
exports.GeoCacheCountryService = GeoCacheCountryService;
exports.GeoCacheCountryService = GeoCacheCountryService = GeoCacheCountryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeoCacheCountryService);
//# sourceMappingURL=geo-cache-country.service.js.map