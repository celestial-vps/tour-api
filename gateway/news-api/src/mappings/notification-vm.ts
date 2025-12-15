import { Injectable } from '@nestjs/common'; 
import { UserMapping, UserVm } from './user-vm'; 
import { Notification } from '../models/notification.entity';   
export class NotificationVm {
  oid: string;
  user: UserVm;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

@Injectable()
export class NotificationMapping {

  constructor(private readonly userMapping: UserMapping) {}

  toNotificationResponse(notification: Notification): NotificationVm {
    return {
      oid: notification.oid,
      user: this.userMapping.toUserResponse(notification.user),
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }

  toNotificationResponses(notifications: Notification[]): NotificationVm[] {
    return notifications.map(n => this.toNotificationResponse(n));
  }
}
