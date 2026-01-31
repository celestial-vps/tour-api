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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerMapping = exports.BannerVm = void 0;
const common_1 = require("@nestjs/common");
class BannerVm {
    oid;
    title;
    image;
    article;
    createdAt;
    updatedAt;
}
exports.BannerVm = BannerVm;
let BannerMapping = class BannerMapping {
    bannerMapping;
    constructor(bannerMapping) {
        this.bannerMapping = bannerMapping;
    }
    toBannerResponse(banner) {
        return {
            oid: banner.oid,
            title: banner.title,
            image: banner.image,
            createdAt: banner.createdAt,
            updatedAt: banner.updatedAt,
        };
    }
    toBannerResponses(banners) {
        return banners.map(b => this.toBannerResponse(b));
    }
};
exports.BannerMapping = BannerMapping;
exports.BannerMapping = BannerMapping = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [BannerMapping])
], BannerMapping);
//# sourceMappingURL=banner-vm.js.map