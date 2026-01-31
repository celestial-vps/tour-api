import { PaginationInfo } from './base/pagination-info-dto';
export declare class FilterNewsCategoryDto {
    categoryName?: string;
}
export declare class CreateNewsCategoryDto {
    categoryName: string;
}
export declare class UpdateNewsCategoryDto {
    categoryName: string;
}
export declare class ResponseNewsCategoryVm {
    oid: string;
    categoryName: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class SuccessNewsCategoryResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseNewsCategoryVm[];
}
export declare class SuccessNewsCategoryObjectResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseNewsCategoryVm;
}
export declare class SuccessNewsCategoryPaginatedResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    pagination: PaginationInfo;
    data: ResponseNewsCategoryVm[];
}
