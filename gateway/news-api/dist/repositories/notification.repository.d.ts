import { QueryRunner, Repository } from 'typeorm';
import { Notification } from '../models/notification.entity';
import { FilterNotificationDto } from '../dtos/payload-notification-dto';
export declare class NotificationRepository {
    private readonly repo;
    constructor(repo: Repository<Notification>);
    save(notification: Notification, queryRunner: QueryRunner): Promise<Notification>;
    update(oid: string, notification: Partial<Notification>, queryRunner: QueryRunner): Promise<Notification>;
    delete(oid: string, queryRunner: QueryRunner): Promise<void>;
    findAll(): Promise<Notification[]>;
    findById(oid: string): Promise<Notification>;
    findByCriteriaPage(page: number, pageSize: number, condition: FilterNotificationDto): Promise<{
        notifications: Notification[];
        count: number;
    }>;
    findCountByCriteria(condition: FilterNotificationDto): Promise<number>;
    advanceFilter(condition: FilterNotificationDto): Promise<Notification[]>;
    private buildFilter;
}
