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
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async save(banner, queryRunner) {
        try {
            return await queryRunner.manager.save(banner_entity_1.Banner, banner);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving banner: ' + error.message);
        }
    }
    async update(oid, banner, queryRunner) {
        try {
            const result = await queryRunner.manager.update(banner_entity_1.Banner, { oid }, banner);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Banner with OID ${oid} not found`);
            }
            return await queryRunner.manager.findOneOrFail(banner_entity_1.Banner, {
                where: { oid },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error updating banner: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            const result = await queryRunner.manager.softDelete(banner_entity_1.Banner, { oid });
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Banner with OID ${oid} not found`);
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error deleting banner: ' + error.message);
        }
    }
    async findAll() {
        return this.repo.find();
    }
    async findById(oid) {
        const banner = await this.repo.findOne({
            where: { oid },
        });
        if (!banner) {
            throw new common_1.NotFoundException(`Banner with OID ${oid} not found`);
        }
        return banner;
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const where = this.buildFilter(condition);
        const [banners, count] = await this.repo.findAndCount({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { title: 'ASC' },
        });
        return { banners, count };
    }
    async findCountByCriteria(condition) {
        const where = this.buildFilter(condition);
        return this.repo.count({ where });
    }
    async advanceFilter(condition) {
        const where = this.buildFilter(condition);
        return this.repo.find({
            where,
            order: { title: 'ASC' },
        });
    }
    buildFilter(condition) {
        const where = {};
        if (condition.title) {
            where.title = (0, typeorm_2.Like)(`%${condition.title}%`);
        }
        return where;
    }
};
exports.BannerRepository = BannerRepository;
exports.BannerRepository = BannerRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(banner_entity_1.Banner)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BannerRepository);
//# sourceMappingURL=banner.repository.js.map