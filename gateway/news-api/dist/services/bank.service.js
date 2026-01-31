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
exports.BankService = void 0;
const common_1 = require("@nestjs/common");
const bank_repository_1 = require("../repositories/bank.repository");
const bank_entity_1 = require("../models/bank.entity");
const typeorm_1 = require("typeorm");
const bank_vm_1 = require("../mappings/bank-vm");
let BankService = class BankService {
    bankRepository;
    bankMapping;
    dataSource;
    constructor(bankRepository, bankMapping, dataSource) {
        this.bankRepository = bankRepository;
        this.bankMapping = bankMapping;
        this.dataSource = dataSource;
    }
    async create(bankdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const bank = new bank_entity_1.Bank();
            bank.bankCode = bankdto.bankCode;
            bank.bankName = bankdto.bankName;
            bank.shortName = bankdto.shortName;
            bank.createdBy = userOid;
            bank.createdAt = new Date();
            const savedBank = await this.bankRepository.save(bank, queryRunner);
            await queryRunner.commitTransaction();
            return { value: savedBank.oid, name: savedBank.bankName ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error saving bank: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(oid, bankdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const bank = await this.bankRepository.findById(oid);
            if (!bank)
                throw new common_1.NotFoundException('Bank data not found');
            bank.bankCode = bankdto.bankCode;
            bank.bankName = bankdto.bankName;
            bank.shortName = bankdto.shortName;
            bank.lastModifiedBy = userOid;
            bank.updatedAt = new Date();
            const savedBank = await this.bankRepository.update(oid, bank, queryRunner);
            await queryRunner.commitTransaction();
            return { value: savedBank.oid, name: savedBank.bankName ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error updating bank: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleted(oid, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const bank = await this.bankRepository.findById(oid);
            if (!bank)
                throw new common_1.NotFoundException('Bank data not found');
            await this.bankRepository.delete(oid, queryRunner);
            await queryRunner.commitTransaction();
            return { value: bank.oid, name: bank.bankName ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error deleting bank: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        try {
            const banks = await this.bankRepository.findAll();
            return this.bankMapping.toBankResponses(banks);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching banks: ' + error.message);
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { banks, count } = await this.bankRepository.findByCriteriaPage(page, pageSize, condition);
            return { banks: this.bankMapping.toBankResponses(banks), count };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching paginated banks: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const bank = await this.bankRepository.findById(oid);
            if (!bank)
                throw new common_1.NotFoundException('Bank not found');
            return this.bankMapping.toBankResponse(bank);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching bank: ' + error.message);
        }
    }
};
exports.BankService = BankService;
exports.BankService = BankService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bank_repository_1.BankRepository,
        bank_vm_1.BankMapping,
        typeorm_1.DataSource])
], BankService);
//# sourceMappingURL=bank.service.js.map