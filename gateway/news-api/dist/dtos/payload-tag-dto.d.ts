import { PaginationInfo } from './base/pagination-info-dto';
export declare class FilterTagDto {
    name?: string;
}
export declare class CreateTagDto {
    name: string;
    slug: string;
}
export declare class UpdateTagDto {
    name: string;
    slug: string;
}
export declare class ResponseTagVm {
    oid: string;
    name: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class SuccessTagResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseTagVm[];
}
export declare class SuccessTagObjectResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseTagVm;
}
export declare class SuccessTagPaginatedResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    pagination: PaginationInfo;
    data: ResponseTagVm[];
}
