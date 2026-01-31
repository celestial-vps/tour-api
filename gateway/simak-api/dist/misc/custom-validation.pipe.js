"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class CustomValidationPipe extends common_1.ValidationPipe {
    constructor() {
        super({
            exceptionFactory: (errors = []) => {
                const messages = errors
                    .map(err => {
                    return Object.values(err.constraints || {}).join(', ');
                })
                    .join(', ');
                return new common_1.BadRequestException({
                    statusCode: 400,
                    error: 'Validation Error',
                    message: messages,
                });
            },
        });
    }
}
exports.CustomValidationPipe = CustomValidationPipe;
//# sourceMappingURL=custom-validation.pipe.js.map