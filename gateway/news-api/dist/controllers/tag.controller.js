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
const jwt_guard_1 = require("../middleware/jwt-guard");
const admin_role_guard_1 = require("../middleware/guards/admin-role.guard");
const error_response_dto_1 = require("../dtos/base/error-response.dto");
const success_response_message_dto_1 = require("../dtos/base/success-response-message-dto");
const request_handler_service_1 = require("../services/request-handler.service");
let TagController = class TagController {
    tagService;
    requestHandler;
    constructor(tagService, requestHandler) {
        this.tagService = tagService;
        this.requestHandler = requestHandler;
    }
    async create(createTagDto, req) {
        const userOid = req.user?.oid;
        return this.requestHandler.handleRequest(() => this.tagService.create(createTagDto, userOid), {
            action: 'CREATE',
            tableName: 'tags',
            userOid,
            req,
            successMessage: 'Create Tag success',
        });
    }
    async update(oid, updateTagDto, req) {
        const userOid = req.user?.oid;
        return this.requestHandler.handleRequest(() => this.tagService.update(oid, updateTagDto, userOid), {
            action: 'UPDATE',
            tableName: 'tags',
            recordOid: oid,
            userOid,
            req,
            successMessage: 'Update Tag success',
        });
    }
    async deleted(oid, req) {
        const userOid = req.user?.oid;
        return this.requestHandler.handleRequest(() => this.tagService.deleted(oid, userOid), {
            action: 'DELETE',
            tableName: 'tags',
            recordOid: oid,
            userOid,
            req,
            successMessage: 'Delete Tag success',
        });
    }
    async findAll(req) {
        const userOid = req.user?.oid;
        return this.requestHandler.handleRequest(() => this.tagService.findAll(), {
            action: 'READ',
            tableName: 'tags',
            userOid,
            req,
        });
    }
    async findOne(oid, req) {
        const userOid = req.user?.oid;
        return this.requestHandler.handleRequest(() => this.tagService.findById(oid), {
            action: 'READ',
            tableName: 'tags',
            recordOid: oid,
            userOid,
            req,
            successMessage: 'Get Tag success',
        });
    }
    async find(pageIndex = 1, pageSize = 10, filterTagDto, req) {
        const userOid = req.user?.oid;
        const page = Number(pageIndex) || 1;
        const size = Number(pageSize) || 10;
        return this.requestHandler.handleRequest(async () => {
            const { tags, count } = await this.tagService.findPage(page, size, filterTagDto);
            return {
                page,
                size,
                total: count,
                totalPages: Math.ceil(count / size),
                data: tags,
            };
        }, {
            action: 'READ',
            tableName: 'tags',
            userOid,
            req,
            paginate: true,
            successMessage: 'Get paginated tags success',
        });
    }
};
exports.TagController = TagController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Tag' }),
    (0, swagger_1.ApiBody)({ type: payload_tag_dto_1.CreateTagDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Create tags', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
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
    (0, swagger_1.ApiOkResponse)({ description: 'Update tags', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_tag_dto_1.UpdateTagDto, Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Delete)('/delete/:oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Tag' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the tag to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Delete tags', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
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
    (0, swagger_1.ApiOkResponse)({ description: 'Get all tags', type: payload_tag_dto_1.SuccessTagResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
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
    (0, swagger_1.ApiOkResponse)({ description: 'Get tag', type: payload_tag_dto_1.SuccessTagObjectResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDto }),
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
    (0, swagger_1.ApiOkResponse)({ description: 'Get paginated tags', type: payload_tag_dto_1.SuccessTagPaginatedResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Query)('pageIndex')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, payload_tag_dto_1.FilterTagDto, Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "find", null);
exports.TagController = TagController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Tag'),
    (0, common_1.Controller)('tag'),
    __metadata("design:paramtypes", [tag_service_1.TagService,
        request_handler_service_1.RequestHandlerService])
], TagController);
//# sourceMappingURL=tag.controller.js.map