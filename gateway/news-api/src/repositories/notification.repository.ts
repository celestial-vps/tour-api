import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, QueryRunner, Repository } from 'typeorm';
import { Notification } from '../models/notification.entity';
import { CreateNotificationDto, FilterNotificationDto, UpdateNotificationDto } from '../dtos/payload-notification-dto';

@Injectable()
export class NotificationRepository {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
    ) { }

    async save(notification: Notification, queryRunner: QueryRunner): Promise<Notification> {
        try {
            const savedNotification = await queryRunner.manager.save(Notification, notification);
            return savedNotification;
        } catch (error) {
            throw new InternalServerErrorException('Error saving notification: ' + error.message);
        }
    }

    async update(oid: string, notification: Notification, queryRunner: QueryRunner): Promise<Notification> {
        try {
            await this.notificationRepository.update(oid, notification)
            return notification;
        } catch (error) {
            throw new InternalServerErrorException('Error update notification: ' + error.message);
        }
    }

    async delete(oid: string, queryRunner: QueryRunner): Promise<void> {

        try {
            await this.notificationRepository.softDelete({ oid })
        } catch (error) {
            throw new InternalServerErrorException('Error saving notification: ' + error.message);
        }
    }

    async findAll(): Promise<Notification[]> {
        return this.notificationRepository.find();
    }


    async findByCriteriaPage(
        page: number,
        pageSize: number,
        condition: FilterNotificationDto,
    ): Promise<{ notifications: Notification[]; count: number }> {
        // Initialize the query builder
        const queryBuilder = this.notificationRepository.createQueryBuilder('notification');

        // Apply filters based on the condition
        // if (condition.notificationCode) {
        //     queryBuilder.andWhere('notification.notificationCode LIKE :notificationCode', {
        //         notificationCode: `%${condition.notificationCode}%`,
        //     });
        // }
        // if (condition.notificationName) {
        //     queryBuilder.orWhere('notification.notificationName LIKE :notificationName', {
        //         notificationName: `%${condition.notificationName}%`,
        //     });
        // }

        // Apply pagination
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);

        // Execute the query and return results
        try {
            const [notifications, count] = await queryBuilder.getManyAndCount();
            return { notifications, count };
        } catch (error) {
            throw new NotFoundException('Error fetching notifications: ' + error.message);
        }
    }

    async findCountByCriteria(
        condition: FilterNotificationDto,
    ): Promise<number> {
        // Initialize the query builder
        const queryBuilder = this.notificationRepository.createQueryBuilder('notification');

        // Apply filters based on the condition
        // if (condition.notificationCode) {
        //     queryBuilder.andWhere('notification.notificationCode LIKE :notificationCode', {
        //         notificationCode: `%${condition.notificationCode}%`,
        //     });
        // }
        // if (condition.notificationName) {
        //     queryBuilder.orWhere('notification.notificationName LIKE :notificationName', {
        //         notificationName: `%${condition.notificationName}%`,
        //     });
        // }

        // Count total records matching the condition
        try {
            const count = await queryBuilder.getCount();
            return count;
        } catch (error) {
            throw new Error('Error fetching notification count: ' + error.message);
        }
    }

    async advanceFilter(
        condition: FilterNotificationDto,
    ): Promise<Notification[]> {
        // Initialize the query builder
        const queryBuilder = this.notificationRepository.createQueryBuilder('notification');

        // Apply filters based on the condition
        // if (condition.notificationCode) {
        //     queryBuilder.andWhere('notification.notificationCode LIKE :notificationCode', {
        //         notificationCode: `%${condition.notificationCode}%`,
        //     });
        // }
        // if (condition.notificationName) {
        //     queryBuilder.orWhere('notification.notificationName LIKE :notificationName', {
        //         notificationName: `%${condition.notificationName}%`,
        //     });
        // }

        // Execute the query to retrieve the matching records
        try {
            const notifications = await queryBuilder.getMany();
            return notifications;
        } catch (error) {
            throw new Error('Error fetching notifications: ' + error.message);
        }
    }

    async findById(oid: string): Promise<Notification> {
        try {
            // Try to find the notification by the given OID
            const notification = await this.notificationRepository.findOne({ where: { oid } });

            // If no notification is found, throw a NotFoundException
            if (!notification) {
                throw new NotFoundException(`Notification with OID ${oid} not found`);
            }

            return notification;
        } catch (error) {
            // You can throw any custom error here or handle the error differently
            throw new Error('Error fetching notification: ' + error.message);
        }
    }


}
