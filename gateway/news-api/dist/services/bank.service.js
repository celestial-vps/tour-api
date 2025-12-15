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
const message_vm_1 = require("../mappings/message-vm");
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
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedBank.oid;
            messageVm.name = savedBank.bankName ?? '';
            return messageVm;
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
            if (!bank) {
                throw new common_1.NotFoundException('Bank data not found');
            }
            bank.bankCode = bankdto.bankCode;
            bank.bankName = bankdto.bankName;
            bank.shortName = bankdto.shortName;
            const savedBank = await this.bankRepository.update(oid, bank, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedBank.oid;
            messageVm.name = savedBank.bankName ?? '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error update bank: ' + error.message);
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
            if (!bank) {
                throw new common_1.NotFoundException('Bank data not found');
            }
            this.bankRepository.delete(oid, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = bank.oid;
            messageVm.name = bank.bankName ?? '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error Delete bank: ' + error.message);
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
            throw new common_1.InternalServerErrorException('Error Find bank: ' + error.message);
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { banks, count } = await this.bankRepository.findByCriteriaPage(page, pageSize, condition);
            const bankResponses = this.bankMapping.toBankResponses(banks);
            return { banks: bankResponses, count };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find bank: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const bank = await this.bankRepository.findById(oid);
            return this.bankMapping.toBankResponse(bank);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find bank: ' + error.message);
        }
    }
};
exports.BankService = BankService;
exports.BankService = BankService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bank_repository_1.BankRepository, bank_vm_1.BankMapping,
        typeorm_1.DataSource])
], BankService);
//# sourceMappingURL=bank.service.js.map