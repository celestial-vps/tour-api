import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ResponseService } from '../common/build.response';

// Define the structure of the exception response for type safety
interface ExceptionResponse {
  message?: string;
}

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(private readonly responseService: ResponseService) { } // inject service

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    // Get the response object from the exception
    const exceptionResponse = exception.getResponse();

    // Determine if exceptionResponse is a string or an object
    let message: string;
    if (typeof exceptionResponse === 'string') {
      // If it's a string, use it directly
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      // If it's an object with a message property
      message = (exceptionResponse as ExceptionResponse).message || 'Unknown error';
    } else {
      // Fallback for unexpected structures
      message = 'Unknown error';
    }

    // Create a custom forbidden response
    const customResponse = this.responseService.responseForm1Forbidden(message);

    // Send the custom response with the appropriate status code
    response.status(status).json(customResponse);
  }
}
