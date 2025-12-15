import { DefaultResponse, DefaultResponseWithPagination } from './response';
export declare class ResponseService {
    responseOk<T>(data: T, total: number): DefaultResponse<T>;
    responseOkWithPagination<T>(data: T, pagging: any): DefaultResponseWithPagination<T>;
    responseDeleteOk<T>(data: T): DefaultResponse<T>;
    responseDataNotFound<T>(data: T): DefaultResponse<T>;
    responseInternalServerError<T>(data: T): DefaultResponse<T>;
    responseBadRequest<T>(error: T): DefaultResponse<T>;
    responseUnauthorized<T>(error: T): DefaultResponse<T>;
    responseForm1Forbidden<T>(error: T): DefaultResponse<T>;
    responseFinValidatorError<T>(error: T): DefaultResponse<T>;
    responseErrorInserted<T>(error: T): DefaultResponse<T>;
    responseErrorUpdate<T>(error: T): DefaultResponse<T>;
    responseErrorDelete<T>(error: T): DefaultResponse<T>;
    responseErrorGet<T>(error: T): DefaultResponse<T>;
    responseError(error: any): DefaultResponse<any>;
}
