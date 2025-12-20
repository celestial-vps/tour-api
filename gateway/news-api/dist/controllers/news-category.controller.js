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
const error_response_dto_1 = require("../dtos/base/error-response.dto");
const success_response_message_dto_1 = require("../dtos/base/success-response-message-dto");
let NewsCategoryController = class NewsCategoryController {
    newsCategoryService;
    responseService;
    auditTrailService;
    constructor(newsCategoryService, responseService, auditTrailService) {
        this.newsCategoryService = newsCategoryService;
        this.responseService = responseService;
        this.auditTrailService = auditTrailService;
    }
    async handleRequest(fn, action, userOid, recordOid, req, paginate) {
        try {
            const result = await fn();
            await this.auditTrailService.recordPost({
                tableName: 'newsCategorys',
                recordOid: recordOid ?? 'unknown',
                action,
                status: 'SUCCESS',
                message: `${action} NewsCategory success`,
                userOid,
                ipAddress: req?.ip,
                userAgent: req?.headers['user-agent'],
                newData: result,
            });
            if (paginate) {
                return this.responseService.responseOkWithPagination(result.data, {
                    page: result.page,
                    size: result.size,
                    totalItem: result.totalItem,
                    totalPage: result.totalPage,
                });
            }
            return this.responseService.responseOk(result, Array.isArray(result) ? result.length : 1);
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'newsCategorys',
                recordOid: recordOid ?? 'unknown',
                action,
                status: 'ERROR',
                message: error.message,
                userOid,
                ipAddress: req?.ip,
                userAgent: req?.headers['user-agent'],
            });
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.BadRequestException({ code: 400, status: 400, message: error.message });
        }
    }
    async create(createNewsCategoryDto, req) {
        const userOid = req.user?.oid;
        return this.handleRequest(() => this.newsCategoryService.create(createNewsCategoryDto, userOid), 'CREATE', userOid, undefined, req);
    }
    async update(oid, updateNewsCategoryDto, req) {
        const userOid = req.user?.oid;
        return this.handleRequest(() => this.newsCategoryService.update(oid, updateNewsCategoryDto, userOid), 'UPDATE', userOid, oid, req);
    }
    async deleted(oid, req) {
        const userOid = req.user?.oid;
        return this.handleRequest(() => this.newsCategoryService.deleted(oid, userOid), 'DELETE', userOid, oid, req);
    }
    async findAll(req) {
        const userOid = req.user?.oid;
        return this.handleRequest(() => this.newsCategoryService.findAll(), 'READ', userOid, undefined, req);
    }
    async findOne(oid, req) {
        const userOid = req.user?.oid;
        return this.handleRequest(() => this.newsCategoryService.findById(oid), 'READ', userOid, oid, req);
    }
    async find(pageIndex = 1, pageSize = 10, filterNewsCategoryDto, req) {
        const userOid = req.user?.oid;
        const page = Number(pageIndex) || 1;
        const size = Number(pageSize) || 10;
        return this.handleRequest(async () => {
            const { newsCategories, count } = await this.newsCategoryService.findPage(page, size, filterNewsCategoryDto);
            const totalPage = Math.ceil(count / size);
            return {
                page,
                size,
                totalItem: count,
                totalPage,
                data: newsCategories,
            };
        }, 'READ', userOid, undefined, req, true);
    }
};
exports.NewsCategoryController = NewsCategoryController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new NewsCategory' }),
    (0, swagger_1.ApiBody)({ type: payload_news_category_dto_1.CreateNewsCategoryDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Create newsCategorys', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
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
    (0, swagger_1.ApiOkResponse)({ description: 'Update newsCategorys', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_news_category_dto_1.UpdateNewsCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], NewsCategoryController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Delete)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a NewsCategory' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the newsCategory to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Delete newsCategorys', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NewsCategoryController.prototype, "deleted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all newsCategorys' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get all newsCategorys', type: payload_news_category_dto_1.SuccessNewsCategoryResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
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
    (0, swagger_1.ApiOkResponse)({ description: 'Get newsCategory', type: payload_news_category_dto_1.SuccessNewsCategoryObjectResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NewsCategoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('/q'),
    (0, swagger_1.ApiOperation)({ summary: 'Find newsCategorys with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' }),
    (0, swagger_1.ApiBody)({ type: payload_news_category_dto_1.FilterNewsCategoryDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get paginated newsCategorys', type: payload_news_category_dto_1.SuccessNewsCategoryPaginatedResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Query)('pageIndex')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, payload_news_category_dto_1.FilterNewsCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], NewsCategoryController.prototype, "find", null);
exports.NewsCategoryController = NewsCategoryController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('NewsCategory'),
    (0, common_1.Controller)('newsCategory'),
    __metadata("design:paramtypes", [news_category_service_1.NewsCategoryService,
        build_response_1.ResponseService,
        audit_trail_midleware_service_1.AuditTrailService])
], NewsCategoryController);
//# sourceMappingURL=news-category.controller.js.map