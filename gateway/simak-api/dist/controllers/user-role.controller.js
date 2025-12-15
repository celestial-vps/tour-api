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
exports.UserRoleController = void 0;
const common_1 = require("@nestjs/common");
const build_response_1 = require("../common/build.response");
const swagger_1 = require("@nestjs/swagger");
const payload_user_role_dto_1 = require("../dtos/payload-user-role-dto");
const user_role_service_1 = require("../services/user-role.service");
const admin_role_guard_1 = require("../middleware/guards/admin-role.guard");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
let UserRoleController = class UserRoleController {
    userRoleService;
    responseService;
    auditTrailService;
    constructor(userRoleService, responseService, auditTrailService) {
        this.userRoleService = userRoleService;
        this.responseService = responseService;
        this.auditTrailService = auditTrailService;
    }
    async create(createUserRoleDto, req) {
        try {
            const userOid = req.userOid || req.user?.oid;
            const userRoleResponse = await this.userRoleService.create(createUserRoleDto, userOid);
            if (userRoleResponse.err) {
                await this.auditTrailService.recordPost({
                    tableName: 'userRoles',
                    recordOid: 'unknown',
                    action: 'CREATE',
                    status: 'ERROR',
                    message: userRoleResponse.err,
                    userOid: req.user?.oid,
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                });
                throw new common_1.BadRequestException(userRoleResponse.err);
            }
            const response = this.responseService.responseOk(userRoleResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
                recordOid: userRoleResponse?.userRole ?? 'unknown',
                action: 'CREATE',
                status: 'SUCCESS',
                message: 'Create Bank success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: userRoleResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
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
    async update(oid, updateUserRoleDto, req) {
        try {
            const userOid = req.userOid || req.user?.oid;
            const userRoleResponse = await this.userRoleService.update(oid, updateUserRoleDto, userOid);
            const response = this.responseService.responseOk(userRoleResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
                recordOid: userRoleResponse?.userRole ?? 'unknown',
                action: 'CREATE',
                status: 'SUCCESS',
                message: 'Create Bank success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: userRoleResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
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
    async deleted(oid, req) {
        try {
            const userOid = req.user?.oid;
            const userRoleResponse = await this.userRoleService.deleted(oid, userOid);
            ;
            const response = this.responseService.responseOk(userRoleResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
                recordOid: userRoleResponse?.userRole ?? 'unknown',
                action: 'DELETE',
                status: 'SUCCESS',
                message: 'Update Bank success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: userRoleResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
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
            const userRoles = await this.userRoleService.findAll();
            const response = this.responseService.responseOk(userRoles.userRoles, userRoles.userRoles ? userRoles.userRoles.length : 0);
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Bank success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
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
            const userRole = await this.userRoleService.findById(oid);
            ;
            const response = this.responseService.responseOk(userRole, 1);
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Bank success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
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
    async find(pageIndex = 1, pageSize = 10, filterUserRoleDto, req) {
        try {
            const userOid = req.user?.oid;
            const { userRoles, total } = await this.userRoleService.findPage(filterUserRoleDto, pageIndex, pageSize);
            const totalPage = Math.ceil(total / pageSize);
            const pagging = {
                page: pageIndex,
                size: pageSize,
                totalItem: total,
                totalPage: totalPage,
            };
            const response = this.responseService.responseOkWithPagination(userRoles, pagging);
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Bank success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'userRoles',
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
exports.UserRoleController = UserRoleController;
__decorate([
    (0, common_1.UseGuards)(admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new UserRole' }),
    (0, swagger_1.ApiBody)({ type: payload_user_role_dto_1.CreateUserRoleDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The userRole has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payload_user_role_dto_1.CreateUserRoleDto, Object]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Put)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a UserRole' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the userRole to be updated' }),
    (0, swagger_1.ApiBody)({ type: payload_user_role_dto_1.UpdateUserRoleDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The userRole has been successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_user_role_dto_1.UpdateUserRoleDto, Object]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Delete)('/delete/:oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a UserRole' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the userRole to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The userRole has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, common_1.Delete)('/delete/:oid'),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "deleted", null);
__decorate([
    (0, common_1.UseGuards)(admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all userRoles' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of all userRoles', type: [payload_user_role_dto_1.CreateUserRoleDto] }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific userRole by OID' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the userRole to retrieve' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The userRole details', type: payload_user_role_dto_1.CreateUserRoleDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('/q'),
    (0, swagger_1.ApiOperation)({ summary: 'Find userRoles with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' }),
    (0, swagger_1.ApiBody)({ type: payload_user_role_dto_1.FilterUserRoleDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of filtered userRoles with pagination', type: payload_user_role_dto_1.CreateUserRoleDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Query)('pageIndex')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, payload_user_role_dto_1.FilterUserRoleDto, Object]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "find", null);
exports.UserRoleController = UserRoleController = __decorate([
    (0, common_1.Controller)('userRole'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('UserRole'),
    __metadata("design:paramtypes", [user_role_service_1.UserRoleService, build_response_1.ResponseService,
        audit_trail_midleware_service_1.AuditTrailService])
], UserRoleController);
//# sourceMappingURL=user-role.controller.js.map