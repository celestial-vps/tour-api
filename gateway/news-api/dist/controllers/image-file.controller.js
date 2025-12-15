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
exports.ImageFileController = void 0;
const common_1 = require("@nestjs/common");
const image_file_service_1 = require("../services/image-file.service");
const swagger_1 = require("@nestjs/swagger");
const build_response_1 = require("../common/build.response");
const jwt_guard_1 = require("../middleware/jwt-guard");
const admin_role_guard_1 = require("../middleware/guards/admin-role.guard");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const payload_image_file_dto_1 = require("../dtos/payload-image-file-dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const uuid_1 = require("uuid");
let ImageFileController = class ImageFileController {
    imageFileService;
    responseService;
    auditTrailService;
    constructor(imageFileService, responseService, auditTrailService) {
        this.imageFileService = imageFileService;
        this.responseService = responseService;
        this.auditTrailService = auditTrailService;
    }
    async create(file, createImageFileDto, req) {
        try {
            const userOid = req.user?.oid;
            const imageFileResponse = await this.imageFileService.create(file, createImageFileDto, userOid);
            const response = this.responseService.responseOk(imageFileResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
                recordOid: imageFileResponse?.value ?? 'unknown',
                action: 'CREATE',
                status: 'SUCCESS',
                message: 'Create ImageFile success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: imageFileResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
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
    async update(oid, updateImageFileDto, req) {
        try {
            const userOid = req.userOid || req.user?.oid;
            const imageFileResponse = await this.imageFileService.update(oid, updateImageFileDto, userOid);
            const response = this.responseService.responseOk(imageFileResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
                recordOid: imageFileResponse?.value ?? 'unknown',
                action: 'UPDATE',
                status: 'SUCCESS',
                message: 'Update ImageFile success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: imageFileResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
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
            const imageFileResponse = await this.imageFileService.deleted(oid, userOid);
            ;
            const response = this.responseService.responseOk(imageFileResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
                recordOid: imageFileResponse?.value ?? 'unknown',
                action: 'DELETE',
                status: 'SUCCESS',
                message: 'Update ImageFile success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: imageFileResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
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
            const imageFiles = await this.imageFileService.findAll();
            const response = this.responseService.responseOk(imageFiles, imageFiles.length);
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update ImageFile success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
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
            const imageFile = await this.imageFileService.findById(oid);
            ;
            const response = this.responseService.responseOk(imageFile, 1);
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update ImageFile success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
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
    async find(pageIndex = 1, pageSize = 10, filterImageFileDto, req) {
        try {
            const userOid = req.user?.oid;
            const { imageFiles, count } = await this.imageFileService.findPage(pageIndex, pageSize, filterImageFileDto);
            const totalPage = Math.ceil(count / pageSize);
            const pagging = {
                page: pageIndex,
                size: pageSize,
                totalItem: count,
                totalPage: totalPage,
            };
            const response = this.responseService.responseOkWithPagination(imageFiles, pagging);
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update ImageFile success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'imageFiles',
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
exports.ImageFileController = ImageFileController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new ImageFile' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './publics',
            filename: (req, file, cb) => {
                const filename = `${(0, uuid_1.v4)()}-${file.originalname}`;
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    })),
    (0, swagger_1.ApiBody)({ type: payload_image_file_dto_1.CreateImageFileDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'The imageFile has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payload_image_file_dto_1.CreateImageFileDto, Object]),
    __metadata("design:returntype", Promise)
], ImageFileController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Put)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a ImageFile' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the imageFile to be updated' }),
    (0, swagger_1.ApiBody)({ type: payload_image_file_dto_1.UpdateImageFileDto }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary', description: 'File yang akan diupload' },
                fileName: { type: 'string', description: 'Nama file' },
                fileUrl: { type: 'string', description: 'URL file' },
                filePath: { type: 'string', description: 'Path file di server' },
                fileMime: { type: 'string', description: 'MIME type' },
                ownerType: {
                    type: 'string',
                    description: 'Tipe pemilik file',
                    enum: ['news', 'user', 'category', 'other'],
                },
                userInserted: { type: 'string', description: 'UUID user yang upload' },
            },
            required: ['file', 'fileName', 'ownerType', 'userInserted'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_image_file_dto_1.UpdateImageFileDto, Object]),
    __metadata("design:returntype", Promise)
], ImageFileController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a ImageFile' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the imageFile to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The imageFile has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, common_1.Delete)('/delete/:oid'),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ImageFileController.prototype, "deleted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all imageFiles' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of all imageFiles', type: [payload_image_file_dto_1.CreateImageFileDto] }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ImageFileController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific imageFile by OID' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the imageFile to retrieve' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The imageFile details', type: payload_image_file_dto_1.CreateImageFileDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ImageFileController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('/q'),
    (0, swagger_1.ApiOperation)({ summary: 'Find imageFiles with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' }),
    (0, swagger_1.ApiBody)({ type: payload_image_file_dto_1.FilterImageFileDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of filtered imageFiles with pagination', type: payload_image_file_dto_1.CreateImageFileDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Query)('pageIndex')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, payload_image_file_dto_1.FilterImageFileDto, Object]),
    __metadata("design:returntype", Promise)
], ImageFileController.prototype, "find", null);
exports.ImageFileController = ImageFileController = __decorate([
    (0, common_1.Controller)('imageFile'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('ImageFile'),
    __metadata("design:paramtypes", [image_file_service_1.ImageFileService, build_response_1.ResponseService, audit_trail_midleware_service_1.AuditTrailService])
], ImageFileController);
//# sourceMappingURL=image-file.controller.js.map