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
exports.KrsController = void 0;
const common_1 = require("@nestjs/common");
const krs_service_1 = require("../services/krs.service");
const payload_krs_dto_1 = require("../dtos/payload-krs-dto");
const swagger_1 = require("@nestjs/swagger");
const build_response_1 = require("../common/build.response");
const jwt_guard_1 = require("../middleware/jwt-guard");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const admin_role_guard_1 = require("../middleware/guards/admin-role.guard");
let KrsController = class KrsController {
    krsService;
    responseService;
    auditTrailService;
    constructor(krsService, responseService, auditTrailService) {
        this.krsService = krsService;
        this.responseService = responseService;
        this.auditTrailService = auditTrailService;
    }
    async create(createKrsDto, req) {
        try {
            const userOid = req.user?.oid;
            const krsResponse = await this.krsService.create(createKrsDto, userOid);
            if (krsResponse.err) {
                await this.auditTrailService.recordPost({
                    tableName: 'krss',
                    recordOid: 'unknown',
                    action: 'CREATE',
                    status: 'ERROR',
                    message: krsResponse.err,
                    userOid: req.user?.oid,
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                });
                throw new common_1.BadRequestException(krsResponse.err);
            }
            const response = this.responseService.responseOk(krsResponse.krs, 1);
            await this.auditTrailService.recordPost({
                tableName: 'krss',
                recordOid: krsResponse?.krs ?? 'unknown',
                action: 'CREATE',
                status: 'SUCCESS',
                message: 'Create Krs success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: krsResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'krss',
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
    async update(oid, updateKrsDto, req) {
        try {
            const userOid = req.userOid || req.user?.oid;
            const krsResponse = await this.krsService.update(oid, updateKrsDto, userOid);
            const response = this.responseService.responseOk(krsResponse.krs, 1);
            await this.auditTrailService.recordPost({
                tableName: 'krss',
                recordOid: krsResponse?.krs ?? 'unknown',
                action: 'UPDATE',
                status: 'SUCCESS',
                message: 'Update Krs success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: krsResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'krss',
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
            const krsResponse = await this.krsService.deleted(oid, userOid);
            ;
            const response = this.responseService.responseOk(krsResponse.krs, 1);
            await this.auditTrailService.recordPost({
                tableName: 'krss',
                recordOid: krsResponse?.krs ?? 'unknown',
                action: 'DELETE',
                status: 'SUCCESS',
                message: 'Update Krs success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: krsResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'krss',
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
            const krss = await this.krsService.findAll();
            const response = this.responseService.responseOk(krss.krss, krss.krss ? krss.krss.length : 0);
            await this.auditTrailService.recordPost({
                tableName: 'krss',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Krs success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'krss',
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
            const krs = await this.krsService.findById(oid);
            ;
            const response = this.responseService.responseOk(krs.krs, 1);
            await this.auditTrailService.recordPost({
                tableName: 'krss',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Krs success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'krss',
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
    async find(pageIndex = 1, pageSize = 10, filterKrsDto, req) {
        try {
            const userOid = req.user?.oid;
            const { krss, total, err } = await this.krsService.findPage(pageIndex, pageSize, filterKrsDto);
            const totalPage = Math.ceil(total / pageSize);
            const pagging = {
                page: pageIndex,
                size: pageSize,
                totalItem: total,
                totalPage: totalPage,
            };
            const response = this.responseService.responseOkWithPagination(krss, pagging);
            await this.auditTrailService.recordPost({
                tableName: 'krss',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Krs success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'krss',
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
exports.KrsController = KrsController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Krs' }),
    (0, swagger_1.ApiBody)({ type: payload_krs_dto_1.CreateKrsDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The krs has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payload_krs_dto_1.CreateKrsDto, Object]),
    __metadata("design:returntype", Promise)
], KrsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Put)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a Krs' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the krs to be updated' }),
    (0, swagger_1.ApiBody)({ type: payload_krs_dto_1.UpdateKrsDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The krs has been successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_krs_dto_1.UpdateKrsDto, Object]),
    __metadata("design:returntype", Promise)
], KrsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Krs' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the krs to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The krs has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, common_1.Delete)('/delete/:oid'),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], KrsController.prototype, "deleted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all krss' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of all krss', type: [payload_krs_dto_1.CreateKrsDto] }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KrsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific krs by OID' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the krs to retrieve' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The krs details', type: payload_krs_dto_1.CreateKrsDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], KrsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('/q'),
    (0, swagger_1.ApiOperation)({ summary: 'Find krss with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' }),
    (0, swagger_1.ApiBody)({ type: payload_krs_dto_1.FilterKrsDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of filtered krss with pagination', type: payload_krs_dto_1.CreateKrsDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Query)('pageIndex')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, payload_krs_dto_1.FilterKrsDto, Object]),
    __metadata("design:returntype", Promise)
], KrsController.prototype, "find", null);
exports.KrsController = KrsController = __decorate([
    (0, common_1.Controller)('krs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Krs'),
    __metadata("design:paramtypes", [krs_service_1.KrsService, build_response_1.ResponseService, audit_trail_midleware_service_1.AuditTrailService])
], KrsController);
//# sourceMappingURL=krs.controller.js.map