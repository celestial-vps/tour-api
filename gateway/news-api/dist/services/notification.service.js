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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const notification_repository_1 = require("../repositories/notification.repository");
const notification_entity_1 = require("../models/notification.entity");
const typeorm_1 = require("typeorm");
const message_vm_1 = require("../mappings/message-vm");
const notification_vm_1 = require("../mappings/notification-vm");
let NotificationService = class NotificationService {
    notificationRepository;
    notificationMapping;
    dataSource;
    constructor(notificationRepository, notificationMapping, dataSource) {
        this.notificationRepository = notificationRepository;
        this.notificationMapping = notificationMapping;
        this.dataSource = dataSource;
    }
    async create(notificationdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const notification = new notification_entity_1.Notification();
            notification.title = notificationdto.title;
            notification.createdBy = userOid;
            notification.createdAt = new Date();
            const savedNotification = await this.notificationRepository.save(notification, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedNotification.oid;
            messageVm.name = savedNotification.title ?? '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error saving notification: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(oid, notificationdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const notification = await this.notificationRepository.findById(oid);
            if (!notification) {
                throw new common_1.NotFoundException('Notification data not found');
            }
            notification.title = notificationdto.title;
            const savedNotification = await this.notificationRepository.update(oid, notification, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedNotification.oid;
            messageVm.name = savedNotification.title ?? '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error update notification: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleted(oid, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const notification = await this.notificationRepository.findById(oid);
            if (!notification) {
                throw new common_1.NotFoundException('Notification data not found');
            }
            this.notificationRepository.delete(oid, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = notification.oid;
            messageVm.name = notification.title ?? '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error Delete notification: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        try {
            const notifications = await this.notificationRepository.findAll();
            return this.notificationMapping.toNotificationResponses(notifications);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find notification: ' + error.message);
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { notifications, count } = await this.notificationRepository.findByCriteriaPage(page, pageSize, condition);
            const notificationResponses = this.notificationMapping.toNotificationResponses(notifications);
            return { notifications: notificationResponses, count };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find notification: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const notification = await this.notificationRepository.findById(oid);
            return this.notificationMapping.toNotificationResponse(notification);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find notification: ' + error.message);
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_repository_1.NotificationRepository, notification_vm_1.NotificationMapping,
        typeorm_1.DataSource])
], NotificationService);
//# sourceMappingURL=notification.service.js.map