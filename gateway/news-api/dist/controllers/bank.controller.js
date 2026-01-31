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
const jwt_guard_1 = require("../middleware/jwt-guard");
const admin_role_guard_1 = require("../middleware/guards/admin-role.guard");
const error_response_dto_1 = require("../dtos/base/error-response.dto");
const success_response_message_dto_1 = require("../dtos/base/success-response-message-dto");
const request_handler_service_1 = require("../services/request-handler.service");
let BankController = class BankController {
    bankService;
    requestHandler;
    constructor(bankService, requestHandler) {
        this.bankService = bankService;
        this.requestHandler = requestHandler;
    }
    async create(createBankDto, req) {
        const userOid = req.user?.oid;
        return this.requestHandler.handleRequest(() => this.bankService.create(createBankDto, userOid), {
            action: 'CREATE',
            tableName: 'banks',
            userOid,
            req,
            successMessage: 'Create Bank success',
        });
    }
    async update(oid, updateBankDto, req) {
        const userOid = req.user?.oid;
        return this.requestHandler.handleRequest(() => this.bankService.update(oid, updateBankDto, userOid), {
            action: 'UPDATE',
            tableName: 'banks',
            recordOid: oid,
            userOid,
            req,
            successMessage: 'Update Bank success',
        });
    }
    async deleted(oid, req) {
        const userOid = req.user?.oid;
        return this.requestHandler.handleRequest(() => this.bankService.deleted(oid, userOid), {
            action: 'DELETE',
            tableName: 'banks',
            recordOid: oid,
            userOid,
            req,
            successMessage: 'Delete Bank success',
        });
    }
    async findAll(req) {
        const userOid = req.user?.oid;
        return this.requestHandler.handleRequest(() => this.bankService.findAll(), {
            action: 'READ',
            tableName: 'banks',
            userOid,
            req,
        });
    }
    async findOne(oid, req) {
        const userOid = req.user?.oid;
        return this.requestHandler.handleRequest(() => this.bankService.findById(oid), {
            action: 'READ',
            tableName: 'banks',
            recordOid: oid,
            userOid,
            req,
            successMessage: 'Get Bank success',
        });
    }
    async find(pageIndex = 1, pageSize = 10, filterBankDto, req) {
        const userOid = req.user?.oid;
        const page = Number(pageIndex) || 1;
        const size = Number(pageSize) || 10;
        return this.requestHandler.handleRequest(async () => {
            const { banks, count } = await this.bankService.findPage(page, size, filterBankDto);
            return {
                page,
                size,
                totalItem: count,
                totalPage: Math.ceil(count / size),
                data: banks,
            };
        }, {
            action: 'READ',
            tableName: 'banks',
            userOid,
            req,
            paginate: true,
            successMessage: 'Get paginated banks success',
        });
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
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payload_bank_dto_1.UpdateBankDto, Object]),
    __metadata("design:returntype", Promise)
], BankController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, common_1.Delete)(':oid'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Bank' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the bank to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Delete banks', type: success_response_message_dto_1.SuccessResponseMessageDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
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
    (0, swagger_1.ApiOkResponse)({ description: 'Get bank', type: payload_bank_dto_1.SuccessBankObjectResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ type: error_response_dto_1.ErrorResponseDto }),
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
    (0, swagger_1.ApiOkResponse)({ description: 'Get paginated banks', type: payload_bank_dto_1.SuccessBankPaginatedResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request', type: error_response_dto_1.ErrorResponseDto }),
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
        request_handler_service_1.RequestHandlerService])
], BankController);
//# sourceMappingURL=bank.controller.js.map