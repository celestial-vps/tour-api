import { UserMapping, UserVm } from './user-vm';
import { Notification } from '../models/notification.entity';
export declare class NotificationVm {
    oid: string;
    user: UserVm;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class NotificationMapping {
    private readonly userMapping;
    constructor(userMapping: UserMapping);
    toNotificationResponse(notification: Notification): NotificationVm;
    toNotificationResponses(notifications: Notification[]): NotificationVm[];
}
