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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../repositories/user.repository");
const user_entity_1 = require("../models/user.entity");
const typeorm_1 = require("typeorm");
const message_vm_1 = require("../mappings/message-vm");
const config_1 = require("@nestjs/config");
const user_vm_1 = require("../mappings/user-vm");
let UserService = class UserService {
    userRepository;
    userMapping;
    configService;
    dataSource;
    constructor(userRepository, userMapping, configService, dataSource) {
        this.userRepository = userRepository;
        this.userMapping = userMapping;
        this.configService = configService;
        this.dataSource = dataSource;
    }
    async register(dto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const user = new user_entity_1.User();
            user.email = dto.email;
            user.name = dto.email;
            user.password = dto.password;
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
    async login(userdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const user = new user_entity_1.User();
            user.email = userdto.email;
            user.name = userdto.email;
            user.password = userdto.password;
            user.createdBy = userOid;
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
    async create(userdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const user = new user_entity_1.User();
            user.email = userdto.email;
            user.name = userdto.email;
            user.password = userdto.password;
            user.createdBy = userOid;
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
    async update(oid, userdto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const user = await this.userRepository.findById(oid);
            if (!user) {
                throw new common_1.NotFoundException('User data not found');
            }
            user.email = userdto.email;
            user.name = userdto.email;
            user.password = userdto.password;
            const savedUser = await this.userRepository.update(oid, user, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedUser.oid;
            messageVm.name = savedUser.email;
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error update user: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleted(oid, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const user = await this.userRepository.findById(oid);
            if (!user) {
                throw new common_1.NotFoundException('User data not found');
            }
            this.userRepository.delete(oid, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = user.oid;
            messageVm.name = user.email;
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error Delete user: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        try {
            const users = await this.userRepository.findAll();
            return this.userMapping.toUserResponses(users);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find user: ' + error.message);
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const users = await this.userRepository.findByCriteriaPage(page, pageSize, condition);
            const userResponses = this.userMapping.toUserResponses(users);
            return { users: userResponses, count: 0 };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find user: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const user = await this.userRepository.findById(oid);
            return this.userMapping.toUserResponse(user);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find user: ' + error.message);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        user_vm_1.UserMapping,
        config_1.ConfigService,
        typeorm_1.DataSource])
], UserService);
//# sourceMappingURL=user.service.js.map