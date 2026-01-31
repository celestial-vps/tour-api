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
exports.UserRoleSeeder = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_role_1 = require("../../models/user-role");
let UserRoleSeeder = class UserRoleSeeder {
    userRoleModel;
    constructor(userRoleModel) {
        this.userRoleModel = userRoleModel;
    }
    async seed() {
        const count = await this.userRoleModel.countDocuments({});
        if (count > 0) {
            console.log('UserRole seed already exists. Skipping...');
            return;
        }
        const now = new Date();
        const roles = [
            {
                roleName: 'Admin',
                targetType: 'system',
                isAdministrative: true,
                readState: true,
                writeState: true,
                createState: true,
                deleteState: true,
                navigateState: true,
                createdBy: 'system',
                createdAt: now,
            },
            {
                roleName: 'Viewer',
                targetType: 'general',
                isAdministrative: false,
                readState: true,
                writeState: false,
                createState: false,
                deleteState: false,
                navigateState: true,
                createdBy: 'system',
                createdAt: now,
            },
            {
                roleName: 'Editor',
                targetType: 'general',
                isAdministrative: false,
                readState: true,
                writeState: false,
                createState: false,
                deleteState: false,
                navigateState: true,
                createdBy: 'system',
                createdAt: now,
            },
        ];
        await this.userRoleModel.insertMany(roles);
        console.log('UserRole seed created.');
    }
};
exports.UserRoleSeeder = UserRoleSeeder;
exports.UserRoleSeeder = UserRoleSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_role_1.UserRole.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserRoleSeeder);
//# sourceMappingURL=user-role.seeder.js.map