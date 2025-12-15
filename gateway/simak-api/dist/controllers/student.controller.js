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
exports.StudentController = void 0;
const common_1 = require("@nestjs/common");
const student_service_1 = require("../services/student.service");
const payload_student_dto_1 = require("../dtos/payload-student-dto");
const swagger_1 = require("@nestjs/swagger");
const build_response_1 = require("../common/build.response");
const jwt_guard_1 = require("../middleware/jwt-guard");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const admin_role_guard_1 = require("../middleware/guards/admin-role.guard");
let StudentController = class StudentController {
    studentService;
    responseService;
    auditTrailService;
    constructor(studentService, responseService, auditTrailService) {
        this.studentService = studentService;
        this.responseService = responseService;
        this.auditTrailService = auditTrailService;
    }
    async create(createStudentDto, req) {
        try {
            const userOid = req.user?.oid;
            const studentResponse = await this.studentService.create(createStudentDto, userOid);
            if (studentResponse.err) {
                await this.auditTrailService.recordPost({
                    tableName: 'students',
                    recordOid: 'unknown',
                    action: 'CREATE',
                    status: 'ERROR',
                    message: studentResponse.err,
                    userOid: req.user?.oid,
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                });
                throw new common_1.BadRequestException(studentResponse.err);
            }
            const response = this.responseService.responseOk(studentResponse.student, 1);
            await this.auditTrailService.recordPost({
                tableName: 'students',
                recordOid: studentResponse?.student ?? 'unknown',
                action: 'CREATE',
                status: 'SUCCESS',
                message: 'Create Student success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: studentResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'students',
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
    async update(oid, updateStudentDto, req) {
        try {
            const userOid = req.userOid || req.user?.oid;
            const studentResponse = await this.studentService.update(oid, updateStudentDto, userOid);
            const response = this.responseService.responseOk(studentResponse.student, 1);
            await this.auditTrailService.recordPost({
                tableName: 'students',
                recordOid: studentResponse?.student ?? 'unknown',
                action: 'UPDATE',
                status: 'SUCCESS',
                message: 'Update Student success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: studentResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'students',
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
            const studentResponse = await this.studentService.deleted(oid, userOid);
            ;
            const response = this.responseService.responseOk(studentResponse.student, 1);
            await this.auditTrailService.recordPost({
                tableName: 'students',
                recordOid: studentResponse?.student ?? 'unknown',
                action: 'DELETE',
                status: 'SUCCESS',
                message: 'Update Student success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: studentResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'students',
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
            const students = await this.studentService.findAll();
            const response = this.responseService.responseOk(students.students, students.students ? students.students.length : 0);
            await this.auditTrailService.recordPost({
                tableName: 'students',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Student success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'students',
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
            const student = await this.studentService.findById(oid);
            ;
            const response = this.responseService.responseOk(student.student, 1);
            await this.auditTrailService.recordPost({
                tableName: 'students',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Student success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'students',
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
    async find(pageIndex = 1, pageSize = 10, filterStudentDto, req) {
        try {
            const userOid = req.user?.oid;
            const { students, total, err } = await this.studentService.findPage(pageIndex, pageSize, filterStudentDto);
            const totalPage = Math.ceil(total / pageSize);
            const pagging = {
                page: pageIndex,
                size: pageSize,
                totalItem: total,
                totalPage: totalPage,
            };
            const response = this.responseService.responseOkWithPagination(students, pagging);
            await this.auditTrailService.recordPost({
                tableName: 'students',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Student success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'students',
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
exports.StudentController = StudentController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Student' }),
    (0, swagger_1.ApiBody)({ type: payload_student_dto_1.CreateStudentDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The student has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payload_student_dto_1.CreateStudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Put)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a Student' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the student to be updated' }),
    (0, swagger_1.ApiBody)({ type: payload_student_dto_1.UpdateStudentDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The student has been successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_student_dto_1.UpdateStudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Student' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the student to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The student has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, common_1.Delete)('/delete/:oid'),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "deleted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all students' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of all students', type: [payload_student_dto_1.CreateStudentDto] }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific student by OID' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the student to retrieve' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The student details', type: payload_student_dto_1.CreateStudentDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('/q'),
    (0, swagger_1.ApiOperation)({ summary: 'Find students with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' }),
    (0, swagger_1.ApiBody)({ type: payload_student_dto_1.FilterStudentDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of filtered students with pagination', type: payload_student_dto_1.CreateStudentDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Query)('pageIndex')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, payload_student_dto_1.FilterStudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "find", null);
exports.StudentController = StudentController = __decorate([
    (0, common_1.Controller)('student'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Student'),
    __metadata("design:paramtypes", [student_service_1.StudentService, build_response_1.ResponseService, audit_trail_midleware_service_1.AuditTrailService])
], StudentController);
//# sourceMappingURL=student.controller.js.map