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
exports.BankRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bank_1 = require("../models/bank");
const mapper_1 = require("../misc/mapper");
const bank_domain_1 = require("../domain/bank.domain");
let BankRepository = class BankRepository {
    bankModel;
    constructor(bankModel) {
        this.bankModel = bankModel;
    }
    async save(bank) {
        try {
            const collectionBank = new this.bankModel(bank);
            collectionBank.createdAt = (0, mongoose_2.now)();
            const colBank = await collectionBank.save();
            const data = mapper_1.Mapper.mapToDomain(bank_domain_1.BankDomain, colBank);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async update(oid, bank) {
        try {
            const collectionBank = await this.bankModel.findByIdAndUpdate({ _id: oid }, bank, {
                new: true,
            });
            const data = mapper_1.Mapper.mapToDomain(bank_domain_1.BankDomain, collectionBank);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async deleted(bank, oid) {
        try {
            const data = await this.bankModel.findByIdAndDelete({ _id: oid });
            return { result: bank, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async findAll() {
        try {
            const banks = await this.bankModel.find();
            const data = mapper_1.Mapper.mapToDomain(bank_domain_1.BankDomain, banks);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async advanceFlter(condition) {
        try {
            const query = {};
            if (condition.bankCode) {
                query.bankCode = { $regex: condition.bankCode, $options: 'i' };
            }
            if (condition.bankName) {
                query.bankName = { $regex: condition.bankName, $options: 'i' };
            }
            const banks = await this.bankModel.find(query);
            const data = mapper_1.Mapper.mapToDomain(bank_domain_1.BankDomain, banks);
            return { result: data, err: null };
        }
        catch (error) {
            return { result: null, err: error };
        }
    }
    async findById(oid) {
        try {
            const bank = await this.bankModel.findOne({ _id: oid });
            const data = mapper_1.Mapper.mapToDomain(bank_domain_1.BankDomain, bank);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async findCountByCriteria(condition) {
        try {
            const query = {};
            if (condition.bankCode) {
                query.bankCode = { $regex: condition.bankCode, $options: 'i' };
            }
            if (condition.bankName) {
                query.bankName = { $regex: condition.bankName, $options: 'i' };
            }
            const count = await this.bankModel.countDocuments(query);
            return { result: count, err: null };
        }
        catch (err) {
            return { result: 0, err };
        }
    }
    async findByCriteriaPage(condition, page, pageSize) {
        try {
            const query = {};
            if (condition.bankCode) {
                query.bankCode = { $regex: condition.bankCode, $options: 'i' };
            }
            if (condition.bankName) {
                query.bankName = { $regex: condition.bankName, $options: 'i' };
            }
            const banks = await this.bankModel.find(query)
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            const data = mapper_1.Mapper.mapToDomain(bank_domain_1.BankDomain, banks);
            return { result: data, err: null };
        }
        catch (error) {
            return { result: [], err: error };
        }
    }
};
exports.BankRepository = BankRepository;
exports.BankRepository = BankRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bank_1.Bank.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BankRepository);
//# sourceMappingURL=bank.repository.js.map