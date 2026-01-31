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
exports.NotificationRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../models/notification.entity");
let NotificationRepository = class NotificationRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async save(notification, queryRunner) {
        try {
            return await queryRunner.manager.save(notification_entity_1.Notification, notification);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving notification: ' + error.message);
        }
    }
    async update(oid, notification, queryRunner) {
        try {
            const result = await queryRunner.manager.update(notification_entity_1.Notification, { oid }, notification);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Notification with OID ${oid} not found`);
            }
            return await queryRunner.manager.findOneOrFail(notification_entity_1.Notification, {
                where: { oid },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error updating notification: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            const result = await queryRunner.manager.softDelete(notification_entity_1.Notification, { oid });
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Notification with OID ${oid} not found`);
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error deleting notification: ' + error.message);
        }
    }
    async findAll() {
        return this.repo.find();
    }
    async findById(oid) {
        const notification = await this.repo.findOne({
            where: { oid },
        });
        if (!notification) {
            throw new common_1.NotFoundException(`Notification with OID ${oid} not found`);
        }
        return notification;
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const where = this.buildFilter(condition);
        const [notifications, count] = await this.repo.findAndCount({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { title: 'ASC' },
        });
        return { notifications, count };
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
exports.NotificationRepository = NotificationRepository;
exports.NotificationRepository = NotificationRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationRepository);
//# sourceMappingURL=notification.repository.js.map