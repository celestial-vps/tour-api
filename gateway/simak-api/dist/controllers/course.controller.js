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
exports.CourseController = void 0;
const common_1 = require("@nestjs/common");
const course_service_1 = require("../services/course.service");
const payload_course_dto_1 = require("../dtos/payload-course-dto");
const swagger_1 = require("@nestjs/swagger");
const build_response_1 = require("../common/build.response");
const jwt_guard_1 = require("../middleware/jwt-guard");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const admin_role_guard_1 = require("../middleware/guards/admin-role.guard");
let CourseController = class CourseController {
    courseService;
    responseService;
    auditTrailService;
    constructor(courseService, responseService, auditTrailService) {
        this.courseService = courseService;
        this.responseService = responseService;
        this.auditTrailService = auditTrailService;
    }
    async create(createCourseDto, req) {
        try {
            const userOid = req.user?.oid;
            const courseResponse = await this.courseService.create(createCourseDto, userOid);
            if (courseResponse.err) {
                await this.auditTrailService.recordPost({
                    tableName: 'courses',
                    recordOid: 'unknown',
                    action: 'CREATE',
                    status: 'ERROR',
                    message: courseResponse.err,
                    userOid: req.user?.oid,
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                });
                throw new common_1.BadRequestException(courseResponse.err);
            }
            const response = this.responseService.responseOk(courseResponse.course, 1);
            await this.auditTrailService.recordPost({
                tableName: 'courses',
                recordOid: courseResponse?.course ?? 'unknown',
                action: 'CREATE',
                status: 'SUCCESS',
                message: 'Create Course success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: courseResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'courses',
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
    async update(oid, updateCourseDto, req) {
        try {
            const userOid = req.userOid || req.user?.oid;
            const courseResponse = await this.courseService.update(oid, updateCourseDto, userOid);
            const response = this.responseService.responseOk(courseResponse.course, 1);
            await this.auditTrailService.recordPost({
                tableName: 'courses',
                recordOid: courseResponse?.course ?? 'unknown',
                action: 'UPDATE',
                status: 'SUCCESS',
                message: 'Update Course success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: courseResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'courses',
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
            const courseResponse = await this.courseService.deleted(oid, userOid);
            ;
            const response = this.responseService.responseOk(courseResponse.course, 1);
            await this.auditTrailService.recordPost({
                tableName: 'courses',
                recordOid: courseResponse?.course ?? 'unknown',
                action: 'DELETE',
                status: 'SUCCESS',
                message: 'Update Course success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: courseResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'courses',
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
            const courses = await this.courseService.findAll();
            const response = this.responseService.responseOk(courses.courses, courses.courses ? courses.courses.length : 0);
            await this.auditTrailService.recordPost({
                tableName: 'courses',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Course success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'courses',
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
            const course = await this.courseService.findById(oid);
            ;
            const response = this.responseService.responseOk(course.course, 1);
            await this.auditTrailService.recordPost({
                tableName: 'courses',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Course success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'courses',
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
    async find(pageIndex = 1, pageSize = 10, filterCourseDto, req) {
        try {
            const userOid = req.user?.oid;
            const { courses, total, err } = await this.courseService.findPage(pageIndex, pageSize, filterCourseDto);
            const totalPage = Math.ceil(total / pageSize);
            const pagging = {
                page: pageIndex,
                size: pageSize,
                totalItem: total,
                totalPage: totalPage,
            };
            const response = this.responseService.responseOkWithPagination(courses, pagging);
            await this.auditTrailService.recordPost({
                tableName: 'courses',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Course success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'courses',
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
exports.CourseController = CourseController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Course' }),
    (0, swagger_1.ApiBody)({ type: payload_course_dto_1.CreateCourseDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The course has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payload_course_dto_1.CreateCourseDto, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Put)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a Course' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the course to be updated' }),
    (0, swagger_1.ApiBody)({ type: payload_course_dto_1.UpdateCourseDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The course has been successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_course_dto_1.UpdateCourseDto, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Course' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the course to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The course has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, common_1.Delete)('/delete/:oid'),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "deleted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all courses' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of all courses', type: [payload_course_dto_1.CreateCourseDto] }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific course by OID' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the course to retrieve' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The course details', type: payload_course_dto_1.CreateCourseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('/q'),
    (0, swagger_1.ApiOperation)({ summary: 'Find courses with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' }),
    (0, swagger_1.ApiBody)({ type: payload_course_dto_1.FilterCourseDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of filtered courses with pagination', type: payload_course_dto_1.CreateCourseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Query)('pageIndex')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, payload_course_dto_1.FilterCourseDto, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "find", null);
exports.CourseController = CourseController = __decorate([
    (0, common_1.Controller)('course'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Course'),
    __metadata("design:paramtypes", [course_service_1.CourseService, build_response_1.ResponseService, audit_trail_midleware_service_1.AuditTrailService])
], CourseController);
//# sourceMappingURL=course.controller.js.map