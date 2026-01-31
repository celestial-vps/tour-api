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
exports.TeacherController = void 0;
const common_1 = require("@nestjs/common");
const teacher_service_1 = require("../services/teacher.service");
const payload_teacher_dto_1 = require("../dtos/payload-teacher-dto");
const swagger_1 = require("@nestjs/swagger");
const build_response_1 = require("../common/build.response");
const jwt_guard_1 = require("../middleware/jwt-guard");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const admin_role_guard_1 = require("../middleware/guards/admin-role.guard");
let TeacherController = class TeacherController {
    teacherService;
    responseService;
    auditTrailService;
    constructor(teacherService, responseService, auditTrailService) {
        this.teacherService = teacherService;
        this.responseService = responseService;
        this.auditTrailService = auditTrailService;
    }
    async create(createTeacherDto, req) {
        try {
            const userOid = req.user?.oid;
            const teacherResponse = await this.teacherService.create(createTeacherDto, userOid);
            const response = this.responseService.responseOk(teacherResponse.teacher, 1);
            await this.auditTrailService.recordPost({
                tableName: 'teachers',
                recordOid: teacherResponse?.teacher ?? 'unknown',
                action: 'CREATE',
                status: 'SUCCESS',
                message: 'Create Teacher success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: teacherResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'teachers',
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
    async update(oid, updateTeacherDto, req) {
        try {
            const userOid = req.userOid || req.user?.oid;
            const teacherResponse = await this.teacherService.update(oid, updateTeacherDto, userOid);
            if (teacherResponse.err) {
                await this.auditTrailService.recordPost({
                    tableName: 'teachers',
                    recordOid: 'unknown',
                    action: 'CREATE',
                    status: 'ERROR',
                    message: teacherResponse.err,
                    userOid: req.user?.oid,
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                });
                throw new common_1.BadRequestException(teacherResponse.err);
            }
            const response = this.responseService.responseOk(teacherResponse.teacher, 1);
            await this.auditTrailService.recordPost({
                tableName: 'teachers',
                recordOid: teacherResponse?.teacher ?? 'unknown',
                action: 'UPDATE',
                status: 'SUCCESS',
                message: 'Update Teacher success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: teacherResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'teachers',
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
            const teacherResponse = await this.teacherService.deleted(oid, userOid);
            ;
            const response = this.responseService.responseOk(teacherResponse.teacher, 1);
            await this.auditTrailService.recordPost({
                tableName: 'teachers',
                recordOid: teacherResponse?.teacher ?? 'unknown',
                action: 'DELETE',
                status: 'SUCCESS',
                message: 'Update Teacher success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: teacherResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'teachers',
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
            const teachers = await this.teacherService.findAll();
            const response = this.responseService.responseOk(teachers.teachers, teachers.teachers ? teachers.teachers.length : 0);
            await this.auditTrailService.recordPost({
                tableName: 'teachers',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Teacher success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'teachers',
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
            const teacher = await this.teacherService.findById(oid);
            ;
            const response = this.responseService.responseOk(teacher.teacher, 1);
            await this.auditTrailService.recordPost({
                tableName: 'teachers',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Teacher success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'teachers',
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
    async find(pageIndex = 1, pageSize = 10, filterTeacherDto, req) {
        try {
            const userOid = req.user?.oid;
            const { teachers, total, err } = await this.teacherService.findPage(pageIndex, pageSize, filterTeacherDto);
            const totalPage = Math.ceil(total / pageSize);
            const pagging = {
                page: pageIndex,
                size: pageSize,
                totalItem: total,
                totalPage: totalPage,
            };
            const response = this.responseService.responseOkWithPagination(teachers, pagging);
            await this.auditTrailService.recordPost({
                tableName: 'teachers',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Teacher success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'teachers',
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
exports.TeacherController = TeacherController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Teacher' }),
    (0, swagger_1.ApiBody)({ type: payload_teacher_dto_1.CreateTeacherDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The teacher has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payload_teacher_dto_1.CreateTeacherDto, Object]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Put)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a Teacher' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the teacher to be updated' }),
    (0, swagger_1.ApiBody)({ type: payload_teacher_dto_1.UpdateTeacherDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The teacher has been successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_teacher_dto_1.UpdateTeacherDto, Object]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Teacher' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the teacher to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The teacher has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, common_1.Delete)('/delete/:oid'),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "deleted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all teachers' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of all teachers', type: [payload_teacher_dto_1.CreateTeacherDto] }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific teacher by OID' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the teacher to retrieve' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The teacher details', type: payload_teacher_dto_1.CreateTeacherDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('/q'),
    (0, swagger_1.ApiOperation)({ summary: 'Find teachers with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' }),
    (0, swagger_1.ApiBody)({ type: payload_teacher_dto_1.FilterTeacherDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of filtered teachers with pagination', type: payload_teacher_dto_1.CreateTeacherDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Query)('pageIndex')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, payload_teacher_dto_1.FilterTeacherDto, Object]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "find", null);
exports.TeacherController = TeacherController = __decorate([
    (0, common_1.Controller)('teacher'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Teacher'),
    __metadata("design:paramtypes", [teacher_service_1.TeacherService, build_response_1.ResponseService, audit_trail_midleware_service_1.AuditTrailService])
], TeacherController);
//# sourceMappingURL=teacher.controller.js.map