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
const user_entity_1 = require("../models/user.entity");
const bcrypt = __importStar(require("bcryptjs"));
const typeorm_1 = require("typeorm");
const message_vm_1 = require("../mappings/message-vm");
const user_role_entity_1 = require("../models/user-role.entity");
const jwt_1 = require("@nestjs/jwt");
const user_vm_1 = require("../mappings/user-vm");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    userRepository;
    dataSource;
    jwtService;
    userMapping;
    configService;
    constructor(userRepository, dataSource, jwtService, userMapping, configService) {
        this.userRepository = userRepository;
        this.dataSource = dataSource;
        this.jwtService = jwtService;
        this.userMapping = userMapping;
        this.configService = configService;
    }
    async register(userDTO) {
        const systemUser = '00000000-0000-0000-0000-000000000000';
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const user = new user_entity_1.User();
            user.email = userDTO.email;
            user.name = userDTO.email;
            user.createdBy = systemUser;
            user.createdAt = new Date();
            const roleId = this.configService.get('ROLEID');
            const role = await queryRunner.manager.findOne(user_role_entity_1.UserRole, { where: { oid: roleId } });
            if (!role) {
                throw new common_1.InternalServerErrorException('Role not found');
            }
            user.role = role;
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(userDTO.password, salt);
            const savedUser = await this.userRepository.save(user, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedUser.oid;
            messageVm.name = savedUser.email;
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error saving user: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async login(userDTO) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const condition = new payload_user_dto_1.FilterUserDto();
            condition.email = userDTO.email;
            const users = await this.userRepository.advanceFilter(condition);
            if (users.length == 0) {
                throw new common_1.UnauthorizedException('Email not found');
            }
            const passwordMatched = await bcrypt.compare(userDTO.password, users[0].password);
            if (passwordMatched) {
                const payload = {
                    userOid: users[0].oid,
                    username: users[0].email,
                    level: 'application',
                    expiresIn: '1h',
                };
                const token = this.jwtService.sign(payload);
                const user = await this.userMapping.toUserTokenResponse(users[0], token, "");
                return user;
            }
            await queryRunner.commitTransaction();
            throw new common_1.UnauthorizedException('Email not found');
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error saving user: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        typeorm_1.DataSource,
        jwt_1.JwtService,
        user_vm_1.UserMapping,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map