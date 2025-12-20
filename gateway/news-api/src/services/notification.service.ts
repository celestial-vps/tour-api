import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { Notification } from '../models/notification.entity';
import { CreateNotificationDto, FilterNotificationDto, UpdateNotificationDto } from '../dtos/payload-notification-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { NotificationMapping, NotificationVm } from '../mappings/notification-vm';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationMapping: NotificationMapping,
    private readonly dataSource: DataSource,
  ) {}

  async create(notificationdto: CreateNotificationDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const notification = new Notification();
      // notification.user = notificationdto.user;
      notification.title = notificationdto.title;
      notification.message = notificationdto.message;
      notification.createdBy = userOid;
      notification.createdAt = new Date();

      const savedNotification = await this.notificationRepository.save(notification, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedNotification.oid, name: savedNotification.title ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error saving notification: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(oid: string, notificationdto: UpdateNotificationDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const notification = await this.notificationRepository.findById(oid);
      if (!notification) throw new NotFoundException('Notification data not found');

      // notification.user = notificationdto.user;
      notification.title = notificationdto.title;
      notification.message = notificationdto.message;
      notification.lastModifiedBy = userOid;
      notification.updatedAt = new Date();

      const savedNotification = await this.notificationRepository.update(oid, notification, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedNotification.oid, name: savedNotification.title ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error updating notification: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const notification = await this.notificationRepository.findById(oid);
      if (!notification) throw new NotFoundException('Notification data not found');

      await this.notificationRepository.delete(oid, queryRunner); // <--- tambahkan await
      await queryRunner.commitTransaction();

      return { value: notification.oid, name: notification.title ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error deleting notification: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<NotificationVm[]> {
    try {
      const notifications = await this.notificationRepository.findAll();
      return this.notificationMapping.toNotificationResponses(notifications);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching notifications: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterNotificationDto): Promise<{ notifications: NotificationVm[]; count: number }> {
    try {
      const { notifications, count } = await this.notificationRepository.findByCriteriaPage(page, pageSize, condition);
      return { notifications: this.notificationMapping.toNotificationResponses(notifications), count };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching paginated notifications: ' + error.message);
    }
  }

  async findById(oid: string): Promise<NotificationVm> {
    try {
      const notification = await this.notificationRepository.findById(oid);
      if (!notification) throw new NotFoundException('Notification not found');
      return this.notificationMapping.toNotificationResponse(notification);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching notification: ' + error.message);
    }
  }
}
