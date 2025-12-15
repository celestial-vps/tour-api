"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsCategoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const build_response_1 = require("../common/build.response");
const user_module_1 = require("./user.module");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const audit_trail_module_1 = require("./audit-trail.module");
const news_category_entity_1 = require("../models/news-category.entity");
const news_category_controller_1 = require("../controllers/news-category.controller");
const news_category_service_1 = require("../services/news-category.service");
const news_category_repository_1 = require("../repositories/news-category.repository");
const news_category_vm_1 = require("../mappings/news-category-vm");
let NewsCategoryModule = class NewsCategoryModule {
};
exports.NewsCategoryModule = NewsCategoryModule;
exports.NewsCategoryModule = NewsCategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([news_category_entity_1.NewsCategory]), user_module_1.UserModule, audit_trail_module_1.AuditTrailModule],
        controllers: [news_category_controller_1.NewsCategoryController],
        providers: [audit_trail_midleware_service_1.AuditTrailService, news_category_service_1.NewsCategoryService, build_response_1.ResponseService, news_category_repository_1.NewsCategoryRepository, news_category_vm_1.NewsCategoryMapping],
        exports: [audit_trail_midleware_service_1.AuditTrailService],
    })
], NewsCategoryModule);
//# sourceMappingURL=news-category.module.js.map