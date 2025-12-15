// response.service.ts
import { Injectable } from '@nestjs/common'; 
import { DefaultResponse, DefaultResponseWithPagination } from './response';

@Injectable()
export class ResponseService {

  responseOk<T>(data: T, total: number): DefaultResponse<T> {
    return new DefaultResponse("200", 200, "success", total, data);
  }

  responseOkWithPagination<T>(data: T, pagging: any): DefaultResponseWithPagination<T> {
    return new DefaultResponseWithPagination("200", 200, "success", pagging, data);
  }

  responseDeleteOk<T>(data: T): DefaultResponse<T> {
    return new DefaultResponse("200", 200, "success", 1, data);
  }

  responseDataNotFound<T>(data: T): DefaultResponse<T> {
    return new DefaultResponse("200", 200, "data not found", 0, data);
  }

  responseInternalServerError<T>(data: T): DefaultResponse<T> {
    return new DefaultResponse("40401", 404, "Not Found", 0, data);
  }

  responseBadRequest<T>(error: T): DefaultResponse<T> {
    return new DefaultResponse("400", 400, "bad_request", 0, error);
  }

  responseUnauthorized<T>(error: T): DefaultResponse<T> {
    return new DefaultResponse("401", 401, "unauthorized", 0, error);
  }

  responseForm1Forbidden<T>(error: T): DefaultResponse<T> {
    return new DefaultResponse("40300", 403, "missing_or_invalid_parameter", 0, error);
  }

  responseFinValidatorError<T>(error: T): DefaultResponse<T> {
    return new DefaultResponse("40300", 403, "missing_or_invalid_parameter", 0, error);
  }

  responseErrorInserted<T>(error: T): DefaultResponse<T> {
    return new DefaultResponse("500", 500, "internal server error", 1, error);
  }

  responseErrorUpdate<T>(error: T): DefaultResponse<T> {
    return new DefaultResponse("500", 500, "internal server error", 1, error);
  }

  responseErrorDelete<T>(error: T): DefaultResponse<T> {
    return new DefaultResponse("500", 500, "internal server error", 1, error);
  }

  responseErrorGet<T>(error: T): DefaultResponse<T> {
    return new DefaultResponse("500", 500, "internal server error", 1, error);
  }

  responseError(error: any): DefaultResponse<any> {
    const statusCode = error || 500; // Fallback to 500 if not provided
    if (statusCode === 500) {
      return new DefaultResponse("500", 500, "Internal server error", 1, "Internal server error");
    } else if (statusCode === 404) {
      return new DefaultResponse("404", 404, "Record Not found", 1, "Record Not found");
    } else {
      return new DefaultResponse("400", 400, "Bad request", 1, "Bad request");
    }
  }
}
