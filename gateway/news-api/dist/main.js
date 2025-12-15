"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.enableCors({
        origin: ['http://192.168.1.6:4200', 'http://localhost:4200', 'http://192.168.1.6:4300', 'http://localhost:4300'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('REST API NestJS + SocketIO')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/v1', app, document);
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Terlalu banyak request, coba lagi nanti',
    }));
    const port = configService.get('PORT', 5201);
    await app.listen(port);
    console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map