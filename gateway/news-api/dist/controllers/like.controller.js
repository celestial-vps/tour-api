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
exports.LikeController = void 0;
const common_1 = require("@nestjs/common");
const like_service_1 = require("../services/like.service");
const payload_like_dto_1 = require("../dtos/payload-like-dto");
const swagger_1 = require("@nestjs/swagger");
const build_response_1 = require("../common/build.response");
const jwt_guard_1 = require("../middleware/jwt-guard");
const admin_role_guard_1 = require("../middleware/guards/admin-role.guard");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const error_response_dto_1 = require("../dtos/base/error-response.dto");
const success_response_message_dto_1 = require("../dtos/base/success-response-message-dto");
let LikeController = class LikeController {
    likeService;
    responseService;
    auditTrailService;
    constructor(likeService, responseService, auditTrailService) {
        this.likeService = likeService;
        this.responseService = responseService;
        this.auditTrailService = auditTrailService;
    }
    async handleRequest(fn, action, userOid, recordOid, req, paginate) {
        try {
            const result = await fn();
            await this.auditTrailService.recordPost({
                tableName: 'likes',
                recordOid: recordOid ?? 'unknown',
                action,
                status: 'SUCCESS',
                message: `${action} Like success`,
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
                tableName: 'likes',
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
    async create(createLikeDto, req) {
        const userOid = req.user?.oid;
        return this.handleRequest(() => this.likeService.create(createLikeDto, userOid), 'CREATE', userOid, undefined, req);
    }
    async update(oid, updateLikeDto, req) {
        const userOid = req.user?.oid;
        return this.handleRequest(() => this.likeService.update(oid, updateLikeDto, userOid), 'UPDATE', userOid, oid, req);
    }
    async deleted(oid, req) {
        const userOid = req.user?.oid;
        return this.handleRequest(() => this.likeService.deleted(oid, userOid), 'DELETE', userOid, oid, req);
    }
    async findAll(req) {
        const userOid = req.user?.oid;
        return this.handleRequest(() => this.likeService.findAll(), 'READ', userOid, undefined, req);
    }
    async findOne(oid, req) {
        const userOid = req.user?.oid;
        return this.handleRequest(() => this.likeService.findById(oid), 'READ', userOid, oid, req);
    }
    async find(pageIndex = 1, pageSize = 10, filterLikeDto, req) {
        const userOid = req.user?.oid;
        const page = Number(pageIndex) || 1;
        const size = Number(pageSize) || 10;
        return this.handleRequest(async () => {
            const { likes, count } = await this.likeService.findPage(page, size, filterLikeDto);
            const totalPage = Math.ceil(count / size);
            return {
                page,
                size,
                totalItem: count,
                totalPage,
                data: likes,
            };
        }, 'READ', userOid, undefined, req, true);
    }
};
exports.LikeController = LikeController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Like' }),
    (0, swagger_1.ApiBody)({ type: payload_like_dto_1.CreateLikeDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Create likes', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payload_like_dto_1.CreateLikeDto, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Put)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a Like' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the like to be updated' }),
    (0, swagger_1.ApiBody)({ type: payload_like_dto_1.UpdateLikeDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Update likes', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_like_dto_1.UpdateLikeDto, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Delete)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Like' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the like to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Delete likes', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "deleted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all likes' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get all likes', type: payload_like_dto_1.SuccessLikeResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific like by OID' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the like to retrieve' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get like', type: payload_like_dto_1.SuccessLikeObjectResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('/q'),
    (0, swagger_1.ApiOperation)({ summary: 'Find likes with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' }),
    (0, swagger_1.ApiBody)({ type: payload_like_dto_1.FilterLikeDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get paginated likes', type: payload_like_dto_1.SuccessLikePaginatedResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Query)('pageIndex')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, payload_like_dto_1.FilterLikeDto, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "find", null);
exports.LikeController = LikeController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Like'),
    (0, common_1.Controller)('like'),
    __metadata("design:paramtypes", [like_service_1.LikeService,
        build_response_1.ResponseService,
        audit_trail_midleware_service_1.AuditTrailService])
], LikeController);
//# sourceMappingURL=like.controller.js.map