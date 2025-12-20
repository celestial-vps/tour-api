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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerService = void 0;
const common_1 = require("@nestjs/common");
const banner_repository_1 = require("../repositories/banner.repository");
const banner_entity_1 = require("../models/banner.entity");
const typeorm_1 = require("typeorm");
const banner_vm_1 = require("../mappings/banner-vm");
let BannerService = class BannerService {
    bannerRepository;
    bannerMapping;
    dataSource;
    constructor(bannerRepository, bannerMapping, dataSource) {
        this.bannerRepository = bannerRepository;
        this.bannerMapping = bannerMapping;
        this.dataSource = dataSource;
    }
    async create(bannerdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const banner = new banner_entity_1.Banner();
            banner.title = bannerdto.title;
            banner.createdBy = userOid;
            banner.createdAt = new Date();
            const savedBanner = await this.bannerRepository.save(banner, queryRunner);
            await queryRunner.commitTransaction();
            return { value: savedBanner.oid, name: savedBanner.title ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error saving banner: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(oid, bannerdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const banner = await this.bannerRepository.findById(oid);
            if (!banner)
                throw new common_1.NotFoundException('Banner data not found');
            banner.title = bannerdto.title;
            banner.lastModifiedBy = userOid;
            banner.updatedAt = new Date();
            const savedBanner = await this.bannerRepository.update(oid, banner, queryRunner);
            await queryRunner.commitTransaction();
            return { value: savedBanner.oid, name: savedBanner.title ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error updating banner: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleted(oid, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const banner = await this.bannerRepository.findById(oid);
            if (!banner)
                throw new common_1.NotFoundException('Banner data not found');
            await this.bannerRepository.delete(oid, queryRunner);
            await queryRunner.commitTransaction();
            return { value: banner.oid, name: banner.title ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error deleting banner: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        try {
            const banners = await this.bannerRepository.findAll();
            return this.bannerMapping.toBannerResponses(banners);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching banners: ' + error.message);
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { banners, count } = await this.bannerRepository.findByCriteriaPage(page, pageSize, condition);
            return { banners: this.bannerMapping.toBannerResponses(banners), count };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching paginated banners: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const banner = await this.bannerRepository.findById(oid);
            if (!banner)
                throw new common_1.NotFoundException('Banner not found');
            return this.bannerMapping.toBannerResponse(banner);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching banner: ' + error.message);
        }
    }
};
exports.BannerService = BannerService;
exports.BannerService = BannerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [banner_repository_1.BannerRepository,
        banner_vm_1.BannerMapping,
        typeorm_1.DataSource])
], BannerService);
//# sourceMappingURL=banner.service.js.map