"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../repositories/user.repository");
const payload_user_dto_1 = require("../dtos/payload-user-dto");
const bcrypt = __importStar(require("bcryptjs"));
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const message_vm_1 = require("../mappings/message.vm");
const user_vm_1 = require("../mappings/user.vm");
const user_1 = require("../models/user");
const user_role_repository_1 = require("../repositories/user-role.repository");
let AuthService = class AuthService {
    userRepository;
    userRoleRepository;
    jwtService;
    configService;
    constructor(userRepository, userRoleRepository, jwtService, configService) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(userDTO) {
        const systemUser = '00000000-0000-0000-0000-000000000000';
        try {
            const user = new user_1.User();
            user.email = userDTO.email;
            user.password = userDTO.password;
            const roleId = this.configService.get('ROLEID');
            const { result, err } = await this.userRoleRepository.findById(roleId ?? '');
            if (!result) {
                throw new common_1.InternalServerErrorException('Role not found');
            }
            user.roleOid = roleId ?? '';
            user.userRole = result;
            user.isActive = true;
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(userDTO.password, salt);
            const savedUser = await this.userRepository.save(user);
            if (savedUser.err !== null) {
                throw new common_1.InternalServerErrorException('Error saving user: ' + savedUser.err.message);
            }
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedUser.result ? savedUser.result.id : '';
            messageVm.name = savedUser.result ? savedUser.result.email : '';
            return messageVm;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving user: ' + error.message);
        }
    }
    async login(userDTO) {
        try {
            const condition = new payload_user_dto_1.FilterUserDto();
            condition.email = userDTO.email;
            const users = await this.userRepository.advanceFilter(condition);
            if (users.result === null) {
                throw new common_1.UnauthorizedException('Email not found');
            }
            const passwordMatched = await bcrypt.compare(userDTO.password, users.result[0].password);
            if (passwordMatched) {
                const payload = {
                    userOid: users.result[0].id,
                    username: users.result[0].email,
                    level: 'application',
                    expiresIn: '1h',
                };
                const token = this.jwtService.sign(payload);
                const user = (0, user_vm_1.toUserTokenResponse)(users.result[0], token, "");
                return user;
            }
            throw new common_1.UnauthorizedException('Email not found');
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving user: ' + error.message);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        user_role_repository_1.UserRoleRepository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map