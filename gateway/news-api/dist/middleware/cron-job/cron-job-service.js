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
var CronJobService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronJobService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const geo_cache_country_service_1 = require("../../services/geo-cache-country.service");
let CronJobService = CronJobService_1 = class CronJobService {
    geoCacheService;
    logger = new common_1.Logger(CronJobService_1.name);
    constructor(geoCacheService) {
        this.geoCacheService = geoCacheService;
    }
    async handleCron() {
        this.logger.log('🔄 Running cron job for Redis countries');
        try {
            const countries = await this.geoCacheService.getCountries();
            this.logger.debug(`Countries count: ${countries.length}`);
        }
        catch (err) {
            this.logger.error('Cron job error', err);
        }
    }
};
exports.CronJobService = CronJobService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronJobService.prototype, "handleCron", null);
exports.CronJobService = CronJobService = CronJobService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [geo_cache_country_service_1.GeoCacheCountryService])
], CronJobService);
//# sourceMappingURL=cron-job-service.js.map