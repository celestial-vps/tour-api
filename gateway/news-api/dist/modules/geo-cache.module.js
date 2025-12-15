"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoCacheModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const geo_cache_country_service_1 = require("../services/geo-cache-country.service");
let GeoCacheModule = class GeoCacheModule {
};
exports.GeoCacheModule = GeoCacheModule;
exports.GeoCacheModule = GeoCacheModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [geo_cache_country_service_1.GeoCacheCountryService],
        exports: [geo_cache_country_service_1.GeoCacheCountryService],
    })
], GeoCacheModule);
//# sourceMappingURL=geo-cache.module.js.map