"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageFileModule = void 0;
const common_1 = require("@nestjs/common");
const image_file_controller_1 = require("../controllers/image-file.controller");
const image_file_service_1 = require("../services/image-file.service");
const image_file_repository_1 = require("../repositories/image-file.repository");
const audit_trail_module_1 = require("./audit-trail.module");
const build_response_1 = require("../common/build.response");
const mongoose_1 = require("@nestjs/mongoose");
const image_file_1 = require("../models/image-file");
let ImageFileModule = class ImageFileModule {
};
exports.ImageFileModule = ImageFileModule;
exports.ImageFileModule = ImageFileModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: image_file_1.ImageFile.name, schema: image_file_1.ImageFileSchema }]), audit_trail_module_1.AuditTrailModule],
        controllers: [image_file_controller_1.ImageFileController],
        providers: [
            image_file_service_1.ImageFileService,
            image_file_repository_1.ImageFileRepository,
            build_response_1.ResponseService,
        ],
        exports: [
            image_file_service_1.ImageFileService,
        ],
    })
], ImageFileModule);
//# sourceMappingURL=image-file.module.js.map