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
exports.TagController = void 0;
const common_1 = require("@nestjs/common");
const tag_service_1 = require("../services/tag.service");
const payload_tag_dto_1 = require("../dtos/payload-tag-dto");
const swagger_1 = require("@nestjs/swagger");
const build_response_1 = require("../common/build.response");
const jwt_guard_1 = require("../middleware/jwt-guard");
const admin_role_guard_1 = require("../middleware/guards/admin-role.guard");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
let TagController = class TagController {
    tagService;
    responseService;
    auditTrailService;
    constructor(tagService, responseService, auditTrailService) {
        this.tagService = tagService;
        this.responseService = responseService;
        this.auditTrailService = auditTrailService;
    }
    async create(createTagDto, req) {
        try {
            const userOid = req.user?.oid;
            const tagResponse = await this.tagService.create(createTagDto, userOid);
            const response = this.responseService.responseOk(tagResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'tags',
                recordOid: tagResponse?.value ?? 'unknown',
                action: 'CREATE',
                status: 'SUCCESS',
                message: 'Create Tag success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: tagResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'tags',
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
    async update(oid, updateTagDto, req) {
        try {
            const userOid = req.userOid || req.user?.oid;
            const tagResponse = await this.tagService.update(oid, updateTagDto, userOid);
            const response = this.responseService.responseOk(tagResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'tags',
                recordOid: tagResponse?.value ?? 'unknown',
                action: 'UPDATE',
                status: 'SUCCESS',
                message: 'Update Tag success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: tagResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'tags',
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
            const tagResponse = await this.tagService.deleted(oid, userOid);
            ;
            const response = this.responseService.responseOk(tagResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'tags',
                recordOid: tagResponse?.value ?? 'unknown',
                action: 'DELETE',
                status: 'SUCCESS',
                message: 'Update Tag success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: tagResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'tags',
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
            const tags = await this.tagService.findAll();
            const response = this.responseService.responseOk(tags, tags.length);
            await this.auditTrailService.recordPost({
                tableName: 'tags',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Tag success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'tags',
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
            const tag = await this.tagService.findById(oid);
            ;
            const response = this.responseService.responseOk(tag, 1);
            await this.auditTrailService.recordPost({
                tableName: 'tags',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Tag success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'tags',
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
    async find(pageIndex = 1, pageSize = 10, filterTagDto, req) {
        try {
            const userOid = req.user?.oid;
            const { tags, count } = await this.tagService.findPage(pageIndex, pageSize, filterTagDto);
            const totalPage = Math.ceil(count / pageSize);
            const pagging = {
                page: pageIndex,
                size: pageSize,
                totalItem: count,
                totalPage: totalPage,
            };
            const response = this.responseService.responseOkWithPagination(tags, pagging);
            await this.auditTrailService.recordPost({
                tableName: 'tags',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Tag success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'tags',
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
exports.TagController = TagController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Tag' }),
    (0, swagger_1.ApiBody)({ type: payload_tag_dto_1.CreateTagDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The tag has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payload_tag_dto_1.CreateTagDto, Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Put)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a Tag' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the tag to be updated' }),
    (0, swagger_1.ApiBody)({ type: payload_tag_dto_1.UpdateTagDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The tag has been successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_tag_dto_1.UpdateTagDto, Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Tag' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the tag to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The tag has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, common_1.Delete)('/delete/:oid'),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "deleted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tags' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of all tags', type: [payload_tag_dto_1.CreateTagDto] }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific tag by OID' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the tag to retrieve' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The tag details', type: payload_tag_dto_1.CreateTagDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('/q'),
    (0, swagger_1.ApiOperation)({ summary: 'Find tags with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' }),
    (0, swagger_1.ApiBody)({ type: payload_tag_dto_1.FilterTagDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of filtered tags with pagination', type: payload_tag_dto_1.CreateTagDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Query)('pageIndex')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, payload_tag_dto_1.FilterTagDto, Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "find", null);
exports.TagController = TagController = __decorate([
    (0, common_1.Controller)('tag'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Tag'),
    __metadata("design:paramtypes", [tag_service_1.TagService, build_response_1.ResponseService, audit_trail_midleware_service_1.AuditTrailService])
], TagController);
//# sourceMappingURL=tag.controller.js.map