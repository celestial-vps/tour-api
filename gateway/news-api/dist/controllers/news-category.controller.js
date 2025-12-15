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
exports.NewsCategoryController = void 0;
const common_1 = require("@nestjs/common");
const news_category_service_1 = require("../services/news-category.service");
const payload_news_category_dto_1 = require("../dtos/payload-news-category-dto");
const swagger_1 = require("@nestjs/swagger");
const build_response_1 = require("../common/build.response");
const jwt_guard_1 = require("../middleware/jwt-guard");
const admin_role_guard_1 = require("../middleware/guards/admin-role.guard");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
let NewsCategoryController = class NewsCategoryController {
    newsCategoryService;
    responseService;
    auditTrailService;
    constructor(newsCategoryService, responseService, auditTrailService) {
        this.newsCategoryService = newsCategoryService;
        this.responseService = responseService;
        this.auditTrailService = auditTrailService;
    }
    async create(createNewsCategoryDto, req) {
        try {
            const userOid = req.user?.oid;
            const newsCategoryResponse = await this.newsCategoryService.create(createNewsCategoryDto, userOid);
            const response = this.responseService.responseOk(newsCategoryResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'newsCategories',
                recordOid: newsCategoryResponse?.value ?? 'unknown',
                action: 'CREATE',
                status: 'SUCCESS',
                message: 'Create NewsCategory success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: newsCategoryResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'newsCategories',
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
    async update(oid, updateNewsCategoryDto, req) {
        try {
            const userOid = req.userOid || req.user?.oid;
            const newsCategoryResponse = await this.newsCategoryService.update(oid, updateNewsCategoryDto, userOid);
            const response = this.responseService.responseOk(newsCategoryResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'newsCategories',
                recordOid: newsCategoryResponse?.value ?? 'unknown',
                action: 'UPDATE',
                status: 'SUCCESS',
                message: 'Update NewsCategory success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: newsCategoryResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'newsCategories',
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
            const newsCategoryResponse = await this.newsCategoryService.deleted(oid, userOid);
            ;
            const response = this.responseService.responseOk(newsCategoryResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'newsCategories',
                recordOid: newsCategoryResponse?.value ?? 'unknown',
                action: 'DELETE',
                status: 'SUCCESS',
                message: 'Update NewsCategory success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: newsCategoryResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'newsCategories',
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
            const newsCategories = await this.newsCategoryService.findAll();
            const response = this.responseService.responseOk(newsCategories, newsCategories.length);
            await this.auditTrailService.recordPost({
                tableName: 'newsCategories',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update NewsCategory success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'newsCategories',
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
            const newsCategory = await this.newsCategoryService.findById(oid);
            ;
            const response = this.responseService.responseOk(newsCategory, 1);
            await this.auditTrailService.recordPost({
                tableName: 'newsCategories',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update NewsCategory success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'newsCategories',
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
    async find(pageIndex = 1, pageSize = 10, filterNewsCategoryDto, req) {
        try {
            const userOid = req.user?.oid;
            const { newsCategories, count } = await this.newsCategoryService.findPage(pageIndex, pageSize, filterNewsCategoryDto);
            const totalPage = Math.ceil(count / pageSize);
            const pagging = {
                page: pageIndex,
                size: pageSize,
                totalItem: count,
                totalPage: totalPage,
            };
            const response = this.responseService.responseOkWithPagination(newsCategories, pagging);
            await this.auditTrailService.recordPost({
                tableName: 'newsCategories',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update NewsCategory success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'newsCategories',
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
exports.NewsCategoryController = NewsCategoryController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new NewsCategory' }),
    (0, swagger_1.ApiBody)({ type: payload_news_category_dto_1.CreateNewsCategoryDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The newsCategory has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payload_news_category_dto_1.CreateNewsCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], NewsCategoryController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Put)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a NewsCategory' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the newsCategory to be updated' }),
    (0, swagger_1.ApiBody)({ type: payload_news_category_dto_1.UpdateNewsCategoryDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The newsCategory has been successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_news_category_dto_1.UpdateNewsCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], NewsCategoryController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a NewsCategory' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the newsCategory to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The newsCategory has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, common_1.Delete)('/delete/:oid'),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NewsCategoryController.prototype, "deleted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all newsCategories' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of all newsCategories', type: [payload_news_category_dto_1.CreateNewsCategoryDto] }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewsCategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific newsCategory by OID' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the newsCategory to retrieve' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The newsCategory details', type: payload_news_category_dto_1.CreateNewsCategoryDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NewsCategoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('/q'),
    (0, swagger_1.ApiOperation)({ summary: 'Find newsCategories with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' }),
    (0, swagger_1.ApiBody)({ type: payload_news_category_dto_1.FilterNewsCategoryDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of filtered newsCategories with pagination', type: payload_news_category_dto_1.CreateNewsCategoryDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Query)('pageIndex')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, payload_news_category_dto_1.FilterNewsCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], NewsCategoryController.prototype, "find", null);
exports.NewsCategoryController = NewsCategoryController = __decorate([
    (0, common_1.Controller)('news-category'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('News Category'),
    __metadata("design:paramtypes", [news_category_service_1.NewsCategoryService, build_response_1.ResponseService, audit_trail_midleware_service_1.AuditTrailService])
], NewsCategoryController);
//# sourceMappingURL=news-category.controller.js.map