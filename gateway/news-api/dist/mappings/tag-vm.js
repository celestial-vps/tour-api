"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagMapping = exports.TagVm = void 0;
const common_1 = require("@nestjs/common");
class TagVm {
    oid;
    name;
    slug;
    createdAt;
    updatedAt;
}
exports.TagVm = TagVm;
let TagMapping = class TagMapping {
    toTagResponse(tag) {
        return {
            oid: tag.oid,
            name: tag.name,
            slug: tag.slug,
            createdAt: tag.createdAt,
            updatedAt: tag.updatedAt,
        };
    }
    toTagResponses(tags) {
        return tags.map(tag => this.toTagResponse(tag));
    }
};
exports.TagMapping = TagMapping;
exports.TagMapping = TagMapping = __decorate([
    (0, common_1.Injectable)()
], TagMapping);
//# sourceMappingURL=tag-vm.js.map