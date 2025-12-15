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
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async save(notification, queryRunner) {
        try {
            const savedNotification = await queryRunner.manager.save(notification_entity_1.Notification, notification);
            return savedNotification;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving notification: ' + error.message);
        }
    }
    async update(oid, notification, queryRunner) {
        try {
            await this.notificationRepository.update(oid, notification);
            return notification;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error update notification: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            await this.notificationRepository.softDelete({ oid });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving notification: ' + error.message);
        }
    }
    async findAll() {
        return this.notificationRepository.find();
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const queryBuilder = this.notificationRepository.createQueryBuilder('notification');
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);
        try {
            const [notifications, count] = await queryBuilder.getManyAndCount();
            return { notifications, count };
        }
        catch (error) {
            throw new common_1.NotFoundException('Error fetching notifications: ' + error.message);
        }
    }
    async findCountByCriteria(condition) {
        const queryBuilder = this.notificationRepository.createQueryBuilder('notification');
        try {
            const count = await queryBuilder.getCount();
            return count;
        }
        catch (error) {
            throw new Error('Error fetching notification count: ' + error.message);
        }
    }
    async advanceFilter(condition) {
        const queryBuilder = this.notificationRepository.createQueryBuilder('notification');
        try {
            const notifications = await queryBuilder.getMany();
            return notifications;
        }
        catch (error) {
            throw new Error('Error fetching notifications: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const notification = await this.notificationRepository.findOne({ where: { oid } });
            if (!notification) {
                throw new common_1.NotFoundException(`Notification with OID ${oid} not found`);
            }
            return notification;
        }
        catch (error) {
            throw new Error('Error fetching notification: ' + error.message);
        }
    }
};
exports.NotificationRepository = NotificationRepository;
exports.NotificationRepository = NotificationRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationRepository);
//# sourceMappingURL=notification.repository.js.map