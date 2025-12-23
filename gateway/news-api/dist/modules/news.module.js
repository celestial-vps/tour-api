"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const news_entity_1 = require("../models/news.entity");
const news_controller_1 = require("../controllers/news.controller");
const news_service_1 = require("../services/news.service");
const news_repository_1 = require("../repositories/news.repository");
const build_response_1 = require("../common/build.response");
const news_vm_1 = require("../mappings/news-vm");
const user_module_1 = require("./user.module");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const audit_trail_module_1 = require("./audit-trail.module");
const news_image_detail_entity_1 = require("../models/news-image-detail.entity");
const request_handler_service_1 = require("../services/request-handler.service");
let NewsModule = class NewsModule {
};
exports.NewsModule = NewsModule;
exports.NewsModule = NewsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([news_entity_1.News, news_image_detail_entity_1.NewsImageDetail]), user_module_1.UserModule, audit_trail_module_1.AuditTrailModule],
        controllers: [news_controller_1.NewsController],
        providers: [audit_trail_midleware_service_1.AuditTrailService, news_service_1.NewsService, request_handler_service_1.RequestHandlerService, build_response_1.ResponseService, news_repository_1.NewsRepository, news_vm_1.NewsMapping],
        exports: [audit_trail_midleware_service_1.AuditTrailService],
    })
], NewsModule);
//# sourceMappingURL=news.module.js.map