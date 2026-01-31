import { NotificationRepository } from '../repositories/notification.repository';
import { CreateNotificationDto, FilterNotificationDto, UpdateNotificationDto } from '../dtos/payload-notification-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { NotificationMapping, NotificationVm } from '../mappings/notification-vm';
export declare class NotificationService {
    private readonly notificationRepository;
    private readonly notificationMapping;
    private readonly dataSource;
    constructor(notificationRepository: NotificationRepository, notificationMapping: NotificationMapping, dataSource: DataSource);
    create(notificationdto: CreateNotificationDto, userOid: string): Promise<MessageVm>;
    update(oid: string, notificationdto: UpdateNotificationDto, userOid: string): Promise<MessageVm>;
    deleted(oid: string, userOid: string): Promise<MessageVm>;
    findAll(): Promise<NotificationVm[]>;
    findPage(page: number, pageSize: number, condition: FilterNotificationDto): Promise<{
        notifications: NotificationVm[];
        count: number;
    }>;
    findById(oid: string): Promise<NotificationVm>;
}
