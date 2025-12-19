import { PaginationInfo } from './base/pagination-info-dto';
export declare class FilterBankDto {
    bankCode?: string;
    bankName?: string;
}
export declare class CreateBankDto {
    bankCode: string;
    bankName: string;
    shortName: string;
}
export declare class UpdateBankDto {
    bankCode: string;
    bankName: string;
    shortName: string;
}
export declare class ResponseBankVm {
    oid: string;
    bankCode: string;
    bankName: string;
    shortName: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class SuccessBankResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseBankVm[];
}
export declare class SuccessBankObjectResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseBankVm;
}
export declare class SuccessBankPaginatedResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    pagination: PaginationInfo;
    data: ResponseBankVm[];
}
