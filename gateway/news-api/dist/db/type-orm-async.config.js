"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmAsyncConfig = void 0;
const config_1 = require("@nestjs/config");
exports.typeOrmAsyncConfig = {
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: async (configService) => {
        return {
            type: 'mysql',
            host: configService.get('DB_HOST'),
            port: parseInt(configService.get('DB_PORT'), 10),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities: ['dist/**/*.entity.js'],
            migrations: ['dist/migrations/*.js'],
            synchronize: false,
            logging: true,
            logger: 'advanced-console',
        };
    },
};
//# sourceMappingURL=type-orm-async.config.js.map