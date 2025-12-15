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
exports.CountryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const build_response_1 = require("../common/build.response");
const jwt_guard_1 = require("../middleware/jwt-guard");
const viewer_role_guard_1 = require("../middleware/guards/viewer-role.guard");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const geo_cache_country_service_1 = require("../services/geo-cache-country.service");
const payload_country_dto_1 = require("../dtos/payload-country-dto");
let CountryController = class CountryController {
    geoCacheCountryService;
    responseService;
    auditTrailService;
    constructor(geoCacheCountryService, responseService, auditTrailService) {
        this.geoCacheCountryService = geoCacheCountryService;
        this.responseService = responseService;
        this.auditTrailService = auditTrailService;
    }
    async deleted(oid, req) {
        try {
            const userOid = req.user?.oid;
            const countryResponse = await this.geoCacheCountryService.deleteCountry(oid);
            ;
            const response = this.responseService.responseOk(countryResponse, 1);
            await this.auditTrailService.recordPost({
                tableName: 'countries',
                recordOid: 'unknown',
                action: 'DELETE',
                status: 'SUCCESS',
                message: 'Update Country success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: countryResponse,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'countries',
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
            const countries = await this.geoCacheCountryService.getCountries();
            const response = this.responseService.responseOk(countries, countries.length);
            await this.auditTrailService.recordPost({
                tableName: 'countries',
                recordOid: 'unknown',
                action: 'READ',
                status: 'SUCCESS',
                message: 'Update Country success',
                userOid: userOid,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                newData: response,
            });
            return response;
        }
        catch (error) {
            await this.auditTrailService.recordPost({
                tableName: 'countries',
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
exports.CountryController = CountryController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, viewer_role_guard_1.SystemRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Country' }),
    (0, swagger_1.ApiParam)({ name: 'oid', description: 'Unique identifier of the country to be deleted' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The country has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, common_1.Delete)('/delete/:oid'),
    __param(0, (0, common_1.Param)('oid')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "deleted", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, viewer_role_guard_1.SystemRoleGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all countries' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of all countries', type: [payload_country_dto_1.CreateCountryDto] }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "findAll", null);
exports.CountryController = CountryController = __decorate([
    (0, common_1.Controller)('country'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Country'),
    __metadata("design:paramtypes", [geo_cache_country_service_1.GeoCacheCountryService, build_response_1.ResponseService, audit_trail_midleware_service_1.AuditTrailService])
], CountryController);
//# sourceMappingURL=country.controller.js.map