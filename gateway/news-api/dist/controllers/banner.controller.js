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
exports.BannerController = void 0;
const common_1 = require("@nestjs/common");
const banner_service_1 = require("../services/banner.service");
const payload_banner_dto_1 = require("../dtos/payload-banner-dto");
const swagger_1 = require("@nestjs/swagger");
const build_response_1 = require("../common/build.response");
const jwt_guard_1 = require("../middleware/jwt-guard");
const admin_role_guard_1 = require("../middleware/guards/admin-role.guard");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const error_response_dto_1 = require("../dtos/base/error-response.dto");
const success_response_message_dto_1 = require("../dtos/base/success-response-message-dto");
let BannerController = class BannerController {
    bannerService;
    responseService;
    auditTrailService;
    constructor(bannerService, responseService, auditTrailService) {
        this.bannerService = bannerService;
        this.responseService = responseService;
        this.auditTrailService = auditTrailService;
    }
    async handleRequest(fn, action, userOid, recordOid, req, paginate) {
        try {
            const result = await fn();
            await this.auditTrailService.recordPost({
                tableName: 'banners',
                recordOid: recordOid ?? 'unknown',
                action,
                status: 'SUCCESS',
                message: `${action} Banner success`,
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
                tableName: 'banners',
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
    async create(createBannerDto, req) {
        const userOid = req.user?.oid;
        return this.handleRequest(() => this.bannerService.create(createBannerDto, userOid), 'CREATE', userOid, undefined, req);
    }
    async update(oid, updateBannerDto, req) {
        const userOid = req.user?.oid;
        return this.handleRequest(() => this.bannerService.update(oid, updateBannerDto, userOid), 'UPDATE', userOid, oid, req);
    }
    async deleted(oid, req) {
        const userOid = req.user?.oid;
        return this.handleRequest(() => this.bannerService.deleted(oid, userOid), 'DELETE', userOid, oid, req);
    }
    async findAll(req) {
        const userOid = req.user?.oid;
        return this.handleRequest(() => this.bannerService.findAll(), 'READ', userOid, undefined, req);
    }
    async findOne(oid, req) {
        const userOid = req.user?.oid;
        return this.handleRequest(() => this.bannerService.findById(oid), 'READ', userOid, oid, req);
    }
    async find(pageIndex = 1, pageSize = 10, filterBannerDto, req) {
        const userOid = req.user?.oid;
        const page = Number(pageIndex) || 1;
        const size = Number(pageSize) || 10;
        return this.handleRequest(async () => {
            const { banners, count } = await this.bannerService.findPage(page, size, filterBannerDto);
            const totalPage = Math.ceil(count / size);
            return {
                page,
                size,
                totalItem: count,
                totalPage,
                data: banners,
            };
        }, 'READ', userOid, undefined, req, true);
    }
};
exports.BannerController = BannerController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Banner' }),
    (0, swagger_1.ApiBody)({ type: payload_banner_dto_1.CreateBannerDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Create banners', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payload_banner_dto_1.CreateBannerDto, Object]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Put)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a Banner' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the banner to be updated' }),
    (0, swagger_1.ApiBody)({ type: payload_banner_dto_1.UpdateBannerDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Update banners', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_banner_dto_1.UpdateBannerDto, Object]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Delete)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Banner' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the banner to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Delete banners', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "deleted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all banners' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get all banners', type: payload_banner_dto_1.SuccessBannerResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific banner by OID' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the banner to retrieve' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get banner', type: payload_banner_dto_1.SuccessBannerObjectResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('/q'),
    (0, swagger_1.ApiOperation)({ summary: 'Find banners with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' }),
    (0, swagger_1.ApiBody)({ type: payload_banner_dto_1.FilterBannerDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get paginated banners', type: payload_banner_dto_1.SuccessBannerPaginatedResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Query)('pageIndex')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, payload_banner_dto_1.FilterBannerDto, Object]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "find", null);
exports.BannerController = BannerController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Banner'),
    (0, common_1.Controller)('banner'),
    __metadata("design:paramtypes", [banner_service_1.BannerService,
        build_response_1.ResponseService,
        audit_trail_midleware_service_1.AuditTrailService])
], BannerController);
//# sourceMappingURL=banner.controller.js.map