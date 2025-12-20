import { PaginationInfo } from './base/pagination-info-dto';
export declare class FilterLikeDto {
    articleId?: string;
    userId?: string;
}
export declare class CreateLikeDto {
    articleId: string;
    userId: string;
}
export declare class UpdateLikeDto {
    articleId: string;
    userId: string;
}
export declare class ResponseLikeVm {
    oid: string;
    articleId: string;
    shortName: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class SuccessLikeResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseLikeVm[];
}
export declare class SuccessLikeObjectResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseLikeVm;
}
export declare class SuccessLikePaginatedResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    pagination: PaginationInfo;
    data: ResponseLikeVm[];
}
