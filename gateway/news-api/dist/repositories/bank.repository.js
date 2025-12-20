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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bank_entity_1 = require("../models/bank.entity");
let BankRepository = class BankRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async save(bank, queryRunner) {
        try {
            return await queryRunner.manager.save(bank_entity_1.Bank, bank);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving bank: ' + error.message);
        }
    }
    async update(oid, bank, queryRunner) {
        try {
            const result = await queryRunner.manager.update(bank_entity_1.Bank, { oid }, bank);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Bank with OID ${oid} not found`);
            }
            return await queryRunner.manager.findOneOrFail(bank_entity_1.Bank, {
                where: { oid },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error updating bank: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            const result = await queryRunner.manager.softDelete(bank_entity_1.Bank, { oid });
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Bank with OID ${oid} not found`);
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error deleting bank: ' + error.message);
        }
    }
    async findAll() {
        return this.repo.find();
    }
    async findById(oid) {
        const bank = await this.repo.findOne({
            where: { oid },
        });
        if (!bank) {
            throw new common_1.NotFoundException(`Bank with OID ${oid} not found`);
        }
        return bank;
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const where = this.buildFilter(condition);
        const [banks, count] = await this.repo.findAndCount({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { bankName: 'ASC' },
        });
        return { banks, count };
    }
    async findCountByCriteria(condition) {
        const where = this.buildFilter(condition);
        return this.repo.count({ where });
    }
    async advanceFilter(condition) {
        const where = this.buildFilter(condition);
        return this.repo.find({
            where,
            order: { bankName: 'ASC' },
        });
    }
    buildFilter(condition) {
        const where = {};
        if (condition.bankCode) {
            where.bankCode = (0, typeorm_2.Like)(`%${condition.bankCode}%`);
        }
        if (condition.bankName) {
            where.bankName = (0, typeorm_2.Like)(`%${condition.bankName}%`);
        }
        return where;
    }
};
exports.BankRepository = BankRepository;
exports.BankRepository = BankRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bank_entity_1.Bank)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BankRepository);
//# sourceMappingURL=bank.repository.js.map