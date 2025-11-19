// response.ts
export class DefaultResponse<T> {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: T;
  
    constructor(resultCode: string, httpStatus: number, message: string, total: number, data: T) {
      this.resultCode = resultCode;
      this.httpStatus = httpStatus;
      this.message = message;
      this.total = total;
      this.data = data;
    }
  }
  
  export class DefaultResponseWithPagination<T> {
    resultCode: string;
    httpStatus: number;
    message: string;
    pagging: any;
    data: T;
  
    constructor(resultCode: string, httpStatus: number, message: string, pagging: any, data: T) {
      this.resultCode = resultCode;
      this.httpStatus = httpStatus;
      this.message = message;
      this.pagging = pagging;
      this.data = data;
    }
  }
  