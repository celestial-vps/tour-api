import { PaginationInfo } from './base/pagination-info-dto';
export declare class FilterNotificationDto {
    title?: string;
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
export declare class ResponseNotificationVm {
    oid: string;
    title: string;
    message: string;
    isRead: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class SuccessNotificationResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseNotificationVm[];
}
export declare class SuccessNotificationObjectResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseNotificationVm;
}
export declare class SuccessNotificationPaginatedResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    pagination: PaginationInfo;
    data: ResponseNotificationVm[];
}
