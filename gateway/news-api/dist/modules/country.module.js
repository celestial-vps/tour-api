"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryModule = void 0;
const common_1 = require("@nestjs/common");
const country_controller_1 = require("../controllers/country.controller");
const build_response_1 = require("../common/build.response");
const user_module_1 = require("./user.module");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const audit_trail_module_1 = require("./audit-trail.module");
const geo_cache_country_service_1 = require("../services/geo-cache-country.service");
let CountryModule = class CountryModule {
};
exports.CountryModule = CountryModule;
exports.CountryModule = CountryModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, audit_trail_module_1.AuditTrailModule],
        controllers: [country_controller_1.CountryController],
        providers: [audit_trail_midleware_service_1.AuditTrailService, geo_cache_country_service_1.GeoCacheCountryService, build_response_1.ResponseService],
        exports: [audit_trail_midleware_service_1.AuditTrailService],
    })
], CountryModule);
//# sourceMappingURL=country.module.js.map