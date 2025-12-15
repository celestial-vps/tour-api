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
const build_response_1 = require("../common/build.response");
const jwt_guard_1 = require("../middleware/jwt-guard");
const admin_role_guard_1 = require("../middleware/guards/admin-role.guard");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
let NewsController = class NewsController {
    newsService;
    responseService;
    auditTrailService;
    constructor(newsService, responseService, auditTrailService) {
        this.newsService = newsService;
        this.responseService = responseService;
        this.auditTrailService = auditTrailService;
    }
    async create(createNewsDto, req) {
        try {
            const userOid = req.user?.oid;
            const newsResponse = await this.newsService.create(createNewsDto, userOid);
            const response = this.responseService.responseOk(newsResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'newss',
                recordOid: newsResponse?.value ?? 'unknown',
                action: 'CREATE',
                status: 'SUCCESS',
                message: 'Create News success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: newsResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'newss',
                recordOid: 'unknown',
                action: 'CREATE',
                status: 'ERROR',
                message: error.message,
                userOid: req.user?.oid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            });
            throw new common_1.BadRequestException(error.message);
        }
    }
    async update(oid, updateNewsDto, req) {
        try {
            const userOid = req.userOid || req.user?.oid;
            const newsResponse = await this.newsService.update(oid, updateNewsDto, userOid);
            const response = this.responseService.responseOk(newsResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'newss',
                recordOid: newsResponse?.value ?? 'unknown',
                action: 'UPDATE',
                status: 'SUCCESS',
                message: 'Update News success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: newsResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'newss',
                recordOid: 'unknown',
                action: 'UPDATE',
                status: 'ERROR',
                message: error.message,
                userOid: req.user?.oid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            });
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleted(oid, req) {
        try {
            const userOid = req.user?.oid;
            const newsResponse = await this.newsService.deleted(oid, userOid);
            ;
            const response = this.responseService.responseOk(newsResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'newss',
                recordOid: newsResponse?.value ?? 'unknown',
                action: 'DELETE',
                status: 'SUCCESS',
                message: 'Update News success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: newsResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'newss',
                recordOid: 'unknown',
                action: 'DELETE',
                status: 'ERROR',
                message: error.message,
                userOid: req.user?.oid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            });
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findAll(req) {
        try {
            const userOid = req.user?.oid;
            const newss = await this.newsService.findAll();
            const response = this.responseService.responseOk(newss, newss.length);
            await this.auditTrailService.recordPost({
                tableName: 'newss',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update News success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'newss',
                recordOid: 'unknown',
                action: 'READ',
                status: 'ERROR',
                message: error.message,
                userOid: req.user?.oid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            });
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findOne(oid, req) {
        try {
            const userOid = req.user?.oid;
            const news = await this.newsService.findById(oid);
            ;
            const response = this.responseService.responseOk(news, 1);
            await this.auditTrailService.recordPost({
                tableName: 'newss',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update News success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'newss',
                recordOid: 'unknown',
                action: 'READ',
                status: 'ERROR',
                message: error.message,
                userOid: req.user?.oid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            });
            throw new common_1.BadRequestException(error.message);
        }
    }
    async find(pageIndex = 1, pageSize = 10, filterNewsDto, req) {
        try {
            const userOid = req.user?.oid;
            const { newss, count } = await this.newsService.findPage(pageIndex, pageSize, filterNewsDto);
            const totalPage = Math.ceil(count / pageSize);
            const pagging = {
                page: pageIndex,
                size: pageSize,
                totalItem: count,
                totalPage: totalPage,
            };
            const response = this.responseService.responseOkWithPagination(newss, pagging);
            await this.auditTrailService.recordPost({
                tableName: 'newss',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update News success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'newss',
                recordOid: 'unknown',
                action: 'READ',
                status: 'ERROR',
                message: error.message,
                userOid: req.user?.oid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            });
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.NewsController = NewsController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new News' }),
    (0, swagger_1.ApiBody)({ type: payload_news_dto_1.CreateNewsDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The news has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
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
    (0, swagger_1.ApiOkResponse)({ description: 'The news has been successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_news_dto_1.UpdateNewsDto, Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a News' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the news to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The news has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, common_1.Delete)('/delete/:oid'),
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
    (0, swagger_1.ApiOkResponse)({ description: 'List of all newss', type: [payload_news_dto_1.CreateNewsDto] }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
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
    (0, swagger_1.ApiOkResponse)({ description: 'The news details', type: payload_news_dto_1.CreateNewsDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
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
    (0, swagger_1.ApiOkResponse)({ description: 'List of filtered newss with pagination', type: payload_news_dto_1.CreateNewsDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Query)('pageIndex')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, payload_news_dto_1.FilterNewsDto, Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "find", null);
exports.NewsController = NewsController = __decorate([
    (0, common_1.Controller)('news'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('News'),
    __metadata("design:paramtypes", [news_service_1.NewsService, build_response_1.ResponseService, audit_trail_midleware_service_1.AuditTrailService])
], NewsController);
//# sourceMappingURL=news.controller.js.map