import { PaginationInfo } from './base/pagination-info-dto';
export declare class FilterBannerDto {
    title?: string;
}
export declare class CreateBannerDto {
    title: string;
    image: string;
    articleId?: string;
}
export declare class UpdateBannerDto {
    title: string;
    image: string;
    articleId?: string;
}
export declare class ResponseBannerVm {
    oid: string;
    title: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class SuccessBannerResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseBannerVm[];
}
export declare class SuccessBannerObjectResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseBannerVm;
}
export declare class SuccessBannerPaginatedResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    pagination: PaginationInfo;
    data: ResponseBannerVm[];
}
