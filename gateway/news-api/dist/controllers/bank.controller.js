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
exports.BankController = void 0;
const common_1 = require("@nestjs/common");
const bank_service_1 = require("../services/bank.service");
const payload_bank_dto_1 = require("../dtos/payload-bank-dto");
const swagger_1 = require("@nestjs/swagger");
const build_response_1 = require("../common/build.response");
const jwt_guard_1 = require("../middleware/jwt-guard");
const admin_role_guard_1 = require("../middleware/guards/admin-role.guard");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const error_response_dto_1 = require("../dtos/base/error-response.dto");
const success_response_message_dto_1 = require("../dtos/base/success-response-message-dto");
let BankController = class BankController {
    bankService;
    responseService;
    auditTrailService;
    constructor(bankService, responseService, auditTrailService) {
        this.bankService = bankService;
        this.responseService = responseService;
        this.auditTrailService = auditTrailService;
    }
    async create(createBankDto, req) {
        try {
            const userOid = req.user?.oid;
            const bankResponse = await this.bankService.create(createBankDto, userOid);
            const response = this.responseService.responseOk(bankResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'banks',
                recordOid: bankResponse?.value ?? 'unknown',
                action: 'CREATE',
                status: 'SUCCESS',
                message: 'Create Bank success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: bankResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'banks',
                recordOid: 'unknown',
                action: 'CREATE',
                status: 'ERROR',
                message: error.message,
                userOid: req.user?.oid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            });
            throw new common_1.BadRequestException({
                code: 400,
                status: 400,
                message: error.message,
            });
        }
    }
    async update(oid, updateBankDto, req) {
        try {
            const userOid = req.userOid || req.user?.oid;
            const bankResponse = await this.bankService.update(oid, updateBankDto, userOid);
            const response = this.responseService.responseOk(bankResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'banks',
                recordOid: bankResponse?.value ?? 'unknown',
                action: 'UPDATE',
                status: 'SUCCESS',
                message: 'Update Bank success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: bankResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'banks',
                recordOid: 'unknown',
                action: 'UPDATE',
                status: 'ERROR',
                message: error.message,
                userOid: req.user?.oid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            });
            throw new common_1.BadRequestException({
                code: 400,
                status: 400,
                message: error.message,
            });
        }
    }
    async deleted(oid, req) {
        try {
            const userOid = req.user?.oid;
            const bankResponse = await this.bankService.deleted(oid, userOid);
            const response = this.responseService.responseOk(bankResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'banks',
                recordOid: bankResponse?.value ?? 'unknown',
                action: 'DELETE',
                status: 'SUCCESS',
                message: 'Delete Bank success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: bankResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'banks',
                recordOid: 'unknown',
                action: 'DELETE',
                status: 'ERROR',
                message: error.message,
                userOid: req.user?.oid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            });
            throw new common_1.BadRequestException({
                code: 400,
                status: 400,
                message: error.message,
            });
        }
    }
    async findAll(req) {
        try {
            const userOid = req.user?.oid;
            const banks = await this.bankService.findAll();
            const response = this.responseService.responseOk(banks, banks.length);
            await this.auditTrailService.recordPost({
                tableName: 'banks',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Read all banks success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'banks',
                recordOid: 'unknown',
                action: 'READ',
                status: 'ERROR',
                message: error.message,
                userOid: req.user?.oid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            });
            throw new common_1.BadRequestException({
                code: 400,
                status: 400,
                message: error.message,
            });
        }
    }
    async findOne(oid, req) {
        try {
            const userOid = req.user?.oid;
            const bank = await this.bankService.findById(oid);
            const response = this.responseService.responseOk(bank, 1);
            await this.auditTrailService.recordPost({
                tableName: 'banks',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Read bank by OID success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'banks',
                recordOid: 'unknown',
                action: 'READ',
                status: 'ERROR',
                message: error.message,
                userOid: req.user?.oid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            });
            throw new common_1.BadRequestException({
                code: 400,
                status: 400,
                message: error.message,
            });
        }
    }
    async find(pageIndex = 1, pageSize = 10, filterBankDto, req) {
        try {
            const userOid = req.user?.oid;
            const { banks, count } = await this.bankService.findPage(pageIndex, pageSize, filterBankDto);
            const totalPage = Math.ceil(count / pageSize);
            const pagging = {
                page: pageIndex,
                size: pageSize,
                totalItem: count,
                totalPage: totalPage,
                data: banks,
            };
            const response = this.responseService.responseOkWithPagination(pagging, totalPage);
            await this.auditTrailService.recordPost({
                tableName: 'banks',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Paginated bank search success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'banks',
                recordOid: 'unknown',
                action: 'READ',
                status: 'ERROR',
                message: error.message,
                userOid: req.user?.oid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            });
            throw new common_1.BadRequestException({
                code: 400,
                status: 400,
                message: error.message,
            });
        }
    }
};
exports.BankController = BankController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Bank' }),
    (0, swagger_1.ApiBody)({ type: payload_bank_dto_1.CreateBankDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Create banks', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal Server Error', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payload_bank_dto_1.CreateBankDto, Object]),
    __metadata("design:returntype", Promise)
], BankController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Put)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a Bank' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the bank to be updated' }),
    (0, swagger_1.ApiBody)({ type: payload_bank_dto_1.UpdateBankDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Update banks', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal Server Error', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_bank_dto_1.UpdateBankDto, Object]),
    __metadata("design:returntype", Promise)
], BankController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Delete)('/delete/:oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Bank' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the bank to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Delete banks', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal Server Error', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BankController.prototype, "deleted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all banks' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get all banks', type: payload_bank_dto_1.SuccessBankResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal Server Error', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BankController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Get)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific bank by OID' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the bank to retrieve' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Create banks', type: payload_bank_dto_1.SuccessBankObjectResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BankController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Post)('/q'),
    (0, swagger_1.ApiOperation)({ summary: 'Find banks with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'pageIndex', required: false, type: Number, description: 'Page index for pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, description: 'Page size for pagination' }),
    (0, swagger_1.ApiBody)({ type: payload_bank_dto_1.FilterBankDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Get all banks', type: payload_bank_dto_1.SuccessBankPaginatedResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal Server Error', type: error_response_dto_1.ErrorResponseDto }),
    __param(0, (0, common_1.Query)('pageIndex')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, payload_bank_dto_1.FilterBankDto, Object]),
    __metadata("design:returntype", Promise)
], BankController.prototype, "find", null);
exports.BankController = BankController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Bank'),
    (0, common_1.Controller)('bank'),
    __metadata("design:paramtypes", [bank_service_1.BankService,
        build_response_1.ResponseService,
        audit_trail_midleware_service_1.AuditTrailService])
], BankController);
//# sourceMappingURL=bank.controller.js.map