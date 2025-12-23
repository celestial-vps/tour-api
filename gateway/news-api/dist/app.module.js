"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const configuration_1 = __importDefault(require("./config/configuration"));
const type_orm_async_config_1 = require("./db/type-orm-async.config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const events_gateway_1 = require("./events.gateway");
const bank_module_1 = require("./modules/bank.module");
const auth_module_1 = require("./modules/auth.module");
const geo_cache_module_1 = require("./modules/geo-cache.module");
const news_category_module_1 = require("./modules/news-category.module");
const news_module_1 = require("./modules/news.module");
const country_module_1 = require("./modules/country.module");
const image_file_module_1 = require("./modules/image-file.module");
const tag_module_1 = require("./modules/tag.module");
const news_image_detail_module_1 = require("./modules/news-image-detail.module");
let AppModule = class AppModule {
    configure(consumer) {
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV}`,
                load: [configuration_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync(type_orm_async_config_1.typeOrmAsyncConfig),
            bank_module_1.BankModule, auth_module_1.AuthModule, country_module_1.CountryModule, news_category_module_1.NewsCategoryModule, news_module_1.NewsModule,
            tag_module_1.TagModule, news_image_detail_module_1.NewsImageDetailModule,
            image_file_module_1.ImageFileModule,
            geo_cache_module_1.GeoCacheModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, events_gateway_1.EventsGateway],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map