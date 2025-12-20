import { PaginationInfo } from './base/pagination-info-dto';
export declare class FilterBookmarkDto {
    articleId?: string;
    userId?: string;
}
export declare class CreateBookmarkDto {
    userId: string;
    articleId: string;
}
export declare class UpdateBookmarkDto {
    userId: string;
    articleId: string;
}
export declare class ResponseBookmarkVm {
    oid: string;
    articleId: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class SuccessBookmarkResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseBookmarkVm[];
}
export declare class SuccessBookmarkObjectResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseBookmarkVm;
}
export declare class SuccessBookmarkPaginatedResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    pagination: PaginationInfo;
    data: ResponseBookmarkVm[];
}
