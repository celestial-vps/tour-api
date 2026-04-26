export declare class DefaultResponse<T> {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: T;
    constructor(resultCode: string, httpStatus: number, message: string, total: number, data: T);
}
export declare class DefaultResponseWithPagination<T> {
    resultCode: string;
    httpStatus: number;
    message: string;
    pagination: any;
    data: T;
    constructor(resultCode: string, httpStatus: number, message: string, pagination: any, data: T);
}
