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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const banner_entity_1 = require("../models/banner.entity");
let BannerRepository = class BannerRepository {
    bannerRepository;
    constructor(bannerRepository) {
        this.bannerRepository = bannerRepository;
    }
    async save(banner, queryRunner) {
        try {
            const savedBanner = await queryRunner.manager.save(banner_entity_1.Banner, banner);
            return savedBanner;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving banner: ' + error.message);
        }
    }
    async update(oid, banner, queryRunner) {
        try {
            await this.bannerRepository.update(oid, banner);
            return banner;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error update banner: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            await this.bannerRepository.softDelete({ oid });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving banner: ' + error.message);
        }
    }
    async findAll() {
        return this.bannerRepository.find();
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const queryBuilder = this.bannerRepository.createQueryBuilder('banner');
        if (condition.title) {
            queryBuilder.andWhere('banner.title LIKE :title', {
                title: `%${condition.title}%`,
            });
        }
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);
        try {
            const [banners, count] = await queryBuilder.getManyAndCount();
            return { banners, count };
        }
        catch (error) {
            throw new common_1.NotFoundException('Error fetching banners: ' + error.message);
        }
    }
    async findCountByCriteria(condition) {
        const queryBuilder = this.bannerRepository.createQueryBuilder('banner');
        if (condition.title) {
            queryBuilder.andWhere('banner.title LIKE :title', {
                title: `%${condition.title}%`,
            });
        }
        try {
            const count = await queryBuilder.getCount();
            return count;
        }
        catch (error) {
            throw new Error('Error fetching banner count: ' + error.message);
        }
    }
    async advanceFilter(condition) {
        const queryBuilder = this.bannerRepository.createQueryBuilder('banner');
        if (condition.title) {
            queryBuilder.andWhere('banner.title LIKE :title', {
                title: `%${condition.title}%`,
            });
        }
        try {
            const banners = await queryBuilder.getMany();
            return banners;
        }
        catch (error) {
            throw new Error('Error fetching banners: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const banner = await this.bannerRepository.findOne({ where: { oid } });
            if (!banner) {
                throw new common_1.NotFoundException(`Banner with OID ${oid} not found`);
            }
            return banner;
        }
        catch (error) {
            throw new Error('Error fetching banner: ' + error.message);
        }
    }
};
exports.BannerRepository = BannerRepository;
exports.BannerRepository = BannerRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(banner_entity_1.Banner)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BannerRepository);
//# sourceMappingURL=banner.repository.js.map