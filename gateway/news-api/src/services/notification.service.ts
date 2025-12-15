import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { Notification } from '../models/notification.entity';
import { CreateNotificationDto, FilterNotificationDto, UpdateNotificationDto } from '../dtos/payload-notification-dto';
import { DataSource, getConnection } from 'typeorm';
import { MessageVm } from '../mappings/message-vm'; 
import { ConfigService } from '@nestjs/config';
import { NotificationMapping, NotificationVm } from '../mappings/notification-vm';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository, private readonly notificationMapping: NotificationMapping, 
    private readonly dataSource: DataSource,
  ) { } 

  async create(notificationdto: CreateNotificationDto, userOid: string): Promise<MessageVm> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const notification = new Notification();
      notification.title = notificationdto.title;
      // notification.user = notificationdto.user;
      notification.createdBy = userOid;
      notification.createdAt = new Date();
      const savedNotification = await this.notificationRepository.save(notification, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedNotification.oid;
      messageVm.name = savedNotification.title ?? '';
      return messageVm;
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
      const notification = await this.notificationRepository.findById(oid)
      if (!notification) {
        throw new NotFoundException('Notification data not found');
      }

      notification.title = notificationdto.title;
      // notification.user = notificationdto.user;
      const savedNotification = await this.notificationRepository.update(oid, notification, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedNotification.oid;
      messageVm.name = savedNotification.title ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error update notification: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const notification = await this.notificationRepository.findById(oid)
      if (!notification) {
        throw new NotFoundException('Notification data not found');
      }
      this.notificationRepository.delete(oid, queryRunner)
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = notification.oid;
      messageVm.name = notification.title ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error Delete notification: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }


  async findAll(): Promise<NotificationVm[]> {
    try {
      const notifications = await this.notificationRepository.findAll();
      return this.notificationMapping.toNotificationResponses(notifications);
    } catch (error) {
      throw new InternalServerErrorException('Error Find notification: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterNotificationDto):
    Promise<{ notifications: NotificationVm[]; count: number }> {

    try { 
      const { notifications, count } = await this.notificationRepository.findByCriteriaPage(page, pageSize, condition); 
      const notificationResponses = this.notificationMapping.toNotificationResponses(notifications); 
      return { notifications: notificationResponses, count };

    } catch (error) {
      throw new InternalServerErrorException('Error Find notification: ' + error.message);
    }
  }

  async findById(oid: string): Promise<NotificationVm> {
    try {
      const notification = await this.notificationRepository.findById(oid);
      return this.notificationMapping.toNotificationResponse(notification);
    } catch (error) {
      throw new InternalServerErrorException('Error Find notification: ' + error.message);
    }
  }

}
