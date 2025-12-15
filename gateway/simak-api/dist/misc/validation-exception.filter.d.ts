import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { ResponseService } from '../common/build.response';
export declare class ValidationExceptionFilter implements ExceptionFilter {
    private readonly responseService;
    constructor(responseService: ResponseService);
    catch(exception: HttpException, host: ArgumentsHost): void;
}
