"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsController = void 0;
const common_1 = require("@nestjs/common");
const news_service_1 = require("../services/news.service");
const payload_news_dto_1 = require("../dtos/payload-news-dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../middleware/jwt-guard");
const admin_role_guard_1 = require("../middleware/guards/admin-role.guard");
const error_response_dto_1 = require("../dtos/base/error-response.dto");
const success_response_message_dto_1 = require("../dtos/base/success-response-message-dto");
const request_handler_service_1 = require("../services/request-handler.service");
let NewsController = class NewsController {
    newsService;
    requestHandler;
    constructor(newsService, requestHandler) {
        this.newsService = newsService;
        this.requestHandler = requestHandler;
    }
    async create(createNewsDto, req) {
        const userOid = req.user?.oid;
        return this.requestHandler.handleRequest(() => this.newsService.create(createNewsDto, userOid), {
            action: 'CREATE',
            tableName: 'news',
            userOid,
            req,
            successMessage: 'Create News success',
        });
    }
    async update(oid, updateNewsDto, req) {
        const userOid = req.user?.oid;
        return this.requestHandler.handleRequest(() => this.newsService.update(oid, updateNewsDto, userOid), {
            action: 'UPDATE',
            tableName: 'news',
            recordOid: oid,
            userOid,
            req,
            successMessage: 'Update News success',
        });
    }
    async deleted(oid, req) {
        const userOid = req.user?.oid;
        return this.requestHandler.handleRequest(() => this.newsService.deleted(oid, userOid), {
            action: 'DELETE',
            tableName: 'news',
            recordOid: oid,
            userOid,
            req,
            successMessage: 'Delete News success',
        });
    }
    async findAll(req) {
        const userOid = req.user?.oid;
        return this.requestHandler.handleRequest(() => this.newsService.findAll(), {
            action: 'READ',
            tableName: 'news',
            userOid,
            req,
            successMessage: 'Get all News success',
        });
    }
    async findOne(oid, req) {
        const userOid = req.user?.oid;
        return this.requestHandler.handleRequest(() => this.newsService.findById(oid), {
            action: 'READ',
            tableName: 'news',
            userOid,
            req,
            successMessage: 'Get all News success',
        });
    }
    async find(pageIndex = 1, pageSize = 10, filterNewsDto, req) {
        const userOid = req.user?.oid;
        const page = Number(pageIndex) || 1;
        const size = Number(pageSize) || 10;
        return this.requestHandler.handleRequest(async () => {
            const { newss, count } = await this.newsService.findPage(page, size, filterNewsDto);
            return {
                page,
                size,
                total: count,
                totalPages: Math.ceil(count / size),
                data: newss,
            };
        }, {
            action: 'READ',
            tableName: 'news',
            userOid,
            req,
            paginate: true,
            successMessage: 'Get paginated News success',
        });
    }
};
exports.NewsController = NewsController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new News' }),
    (0, swagger_1.ApiBody)({ type: payload_news_dto_1.CreateNewsDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Create newss', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payload_news_dto_1.CreateNewsDto, Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Put)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a News' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the news to be updated' }),
    (0, swagger_1.ApiBody)({ type: payload_news_dto_1.UpdateNewsDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Update newss', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_news_dto_1.UpdateNewsDto, Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Delete)('/delete/:oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a News' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the news to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Delete newss', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "deleted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all newss' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get all newss', type: payload_news_dto_1.SuccessNewsResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific news by OID' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the news to retrieve' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get news', type: payload_news_dto_1.SuccessNewsObjectResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('/q'),
    (0, swagger_1.ApiOperation)({ summary: 'Find newss with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' }),
    (0, swagger_1.ApiBody)({ type: payload_news_dto_1.FilterNewsDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get paginated newss', type: payload_news_dto_1.SuccessNewsPaginatedResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Query)('pageIndex')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, payload_news_dto_1.FilterNewsDto, Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "find", null);
exports.NewsController = NewsController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('News'),
    (0, common_1.Controller)('news'),
    __metadata("design:paramtypes", [news_service_1.NewsService,
        request_handler_service_1.RequestHandlerService])
], NewsController);
//# sourceMappingURL=news.controller.js.map