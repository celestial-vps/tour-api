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
let BannerController = class BannerController {
    bannerService;
    responseService;
    auditTrailService;
    constructor(bannerService, responseService, auditTrailService) {
        this.bannerService = bannerService;
        this.responseService = responseService;
        this.auditTrailService = auditTrailService;
    }
    async create(createBannerDto, req) {
        try {
            const userOid = req.user?.oid;
            const bannerResponse = await this.bannerService.create(createBannerDto, userOid);
            const response = this.responseService.responseOk(bannerResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'banners',
                recordOid: bannerResponse?.value ?? 'unknown',
                action: 'CREATE',
                status: 'SUCCESS',
                message: 'Create Banner success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: bannerResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'banners',
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
    async update(oid, updateBannerDto, req) {
        try {
            const userOid = req.userOid || req.user?.oid;
            const bannerResponse = await this.bannerService.update(oid, updateBannerDto, userOid);
            const response = this.responseService.responseOk(bannerResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'banners',
                recordOid: bannerResponse?.value ?? 'unknown',
                action: 'UPDATE',
                status: 'SUCCESS',
                message: 'Update Banner success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: bannerResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'banners',
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
            const bannerResponse = await this.bannerService.deleted(oid, userOid);
            ;
            const response = this.responseService.responseOk(bannerResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'banners',
                recordOid: bannerResponse?.value ?? 'unknown',
                action: 'DELETE',
                status: 'SUCCESS',
                message: 'Update Banner success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: bannerResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'banners',
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
            const banners = await this.bannerService.findAll();
            const response = this.responseService.responseOk(banners, banners.length);
            await this.auditTrailService.recordPost({
                tableName: 'banners',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Banner success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'banners',
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
            const banner = await this.bannerService.findById(oid);
            ;
            const response = this.responseService.responseOk(banner, 1);
            await this.auditTrailService.recordPost({
                tableName: 'banners',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Banner success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'banners',
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
    async find(pageIndex = 1, pageSize = 10, filterBannerDto, req) {
        try {
            const userOid = req.user?.oid;
            const { banners, count } = await this.bannerService.findPage(pageIndex, pageSize, filterBannerDto);
            const totalPage = Math.ceil(count / pageSize);
            const pagging = {
                page: pageIndex,
                size: pageSize,
                totalItem: count,
                totalPage: totalPage,
            };
            const response = this.responseService.responseOkWithPagination(banners, pagging);
            await this.auditTrailService.recordPost({
                tableName: 'banners',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Banner success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'banners',
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
exports.BannerController = BannerController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Banner' }),
    (0, swagger_1.ApiBody)({ type: payload_banner_dto_1.CreateBannerDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The banner has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
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
    (0, swagger_1.ApiOkResponse)({ description: 'The banner has been successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_banner_dto_1.UpdateBannerDto, Object]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Banner' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the banner to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The banner has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, common_1.Delete)('/delete/:oid'),
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
    (0, swagger_1.ApiOkResponse)({ description: 'List of all banners', type: [payload_banner_dto_1.CreateBannerDto] }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
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
    (0, swagger_1.ApiOkResponse)({ description: 'The banner details', type: payload_banner_dto_1.CreateBannerDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
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
    (0, swagger_1.ApiOkResponse)({ description: 'List of filtered banners with pagination', type: payload_banner_dto_1.CreateBannerDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Query)('pageIndex')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, payload_banner_dto_1.FilterBannerDto, Object]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "find", null);
exports.BannerController = BannerController = __decorate([
    (0, common_1.Controller)('banner'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Banner'),
    __metadata("design:paramtypes", [banner_service_1.BannerService, build_response_1.ResponseService, audit_trail_midleware_service_1.AuditTrailService])
], BannerController);
//# sourceMappingURL=banner.controller.js.map