import { BaseEntity } from './base/base';
import { User } from './user.entity';
export declare class Notification extends BaseEntity {
    oid: string;
    user: User;
    title: string;
    message: string;
    isRead: boolean;
}
