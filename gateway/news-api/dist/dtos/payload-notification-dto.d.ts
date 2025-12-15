export declare class FilterNotificationDto {
    userId?: string;
    isRead?: boolean;
}
export declare class CreateNotificationDto {
    userId: string;
    title: string;
    message: string;
    isRead?: boolean;
}
export declare class UpdateNotificationDto {
    title: string;
    message: string;
    isRead: boolean;
}
