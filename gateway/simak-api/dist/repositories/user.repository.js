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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_1 = require("../models/user");
const mapper_1 = require("../misc/mapper");
const user_domain_1 = require("../domain/user.domain");
let UserRepository = class UserRepository {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async save(user) {
        try {
            const collectionUser = new this.userModel(user);
            collectionUser.createdAt = (0, mongoose_2.now)();
            const colUser = await collectionUser.save();
            const data = mapper_1.Mapper.mapToDomain(user_domain_1.UserDomain, colUser);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async update(oid, user) {
        try {
            const collectionUser = await this.userModel.findByIdAndUpdate({ _id: oid }, user, {
                new: true,
            });
            const data = mapper_1.Mapper.mapToDomain(user_domain_1.UserDomain, collectionUser);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async deleted(user, oid) {
        try {
            const data = await this.userModel.findByIdAndDelete({ _id: oid });
            return { result: user, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async findAll() {
        try {
            const users = await this.userModel.find();
            const data = mapper_1.Mapper.mapToDomain(user_domain_1.UserDomain, users);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async advanceFilter(condition) {
        try {
            const query = {};
            if (condition.email) {
                query.email = { $regex: condition.email, $options: 'i' };
            }
            const users = await this.userModel.find(query);
            const data = mapper_1.Mapper.mapToDomain(user_domain_1.UserDomain, users);
            return { result: data, err: null };
        }
        catch (error) {
            return { result: null, err: error };
        }
    }
    async findById(oid) {
        try {
            const user = await this.userModel.findOne({ _id: oid }).populate('userRole').lean();
            ;
            const data = mapper_1.Mapper.mapToDomain(user_domain_1.UserDomain, user);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async findCountByCriteria(condition) {
        try {
            const query = {};
            if (condition.email) {
                query.email = { $regex: condition.email, $options: 'i' };
            }
            const count = await this.userModel.countDocuments(query);
            return { result: count, err: null };
        }
        catch (err) {
            return { result: 0, err };
        }
    }
    async findByCriteriaPage(condition, page, pageSize) {
        try {
            const query = {};
            if (condition.email) {
                query.email = { $regex: condition.email, $options: 'i' };
            }
            const users = await this.userModel.find(query)
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            const data = mapper_1.Mapper.mapToDomain(user_domain_1.UserDomain, users);
            return { result: data ?? null, err: null };
        }
        catch (error) {
            return { result: [], err: error };
        }
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserRepository);
//# sourceMappingURL=user.repository.js.map