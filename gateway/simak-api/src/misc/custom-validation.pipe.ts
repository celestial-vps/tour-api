import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
 
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors: ValidationError[] = []) => {
        const messages = errors
          .map(err => {
            return Object.values(err.constraints || {}).join(', ');
          })
          .join(', ');
        return new BadRequestException({
          statusCode: 400,
          error: 'Validation Error',
          message: messages,
        });
      },
    });
  }
}
