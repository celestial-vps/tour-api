import { PaginationInfo } from './base/pagination-info-dto';
export declare class FilterNewsDto {
    title?: string;
    content?: string;
}
export declare class CreateNewsDto {
    title: string;
    content: string;
    summary?: string;
    author?: string;
    imageOid?: string;
    categoryOid: string;
    status?: string;
    publishedAt?: Date;
    tags?: string;
    views?: number;
    language?: string;
}
export declare class UpdateNewsDto {
    title: string;
    content: string;
    summary?: string;
    author?: string;
    imageOid?: string;
    categoryOid: string;
    status?: string;
    publishedAt?: Date;
    tags?: string;
    views?: number;
    language?: string;
}
export declare class ResponseNewsVm {
    oid: string;
    title: string;
    content: string;
    summary: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class SuccessNewsResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseNewsVm[];
}
export declare class SuccessNewsObjectResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseNewsVm;
}
export declare class SuccessNewsPaginatedResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    pagination: PaginationInfo;
    data: ResponseNewsVm[];
}
