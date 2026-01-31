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
const bank_1 = require("../models/bank");
const bank_vm_1 = require("../mappings/bank.vm");
const bank_repository_1 = require("../repositories/bank.repository");
let BankService = class BankService {
    bankRepository;
    constructor(bankRepository) {
        this.bankRepository = bankRepository;
    }
    async create(createBankDto, userOid) {
        const now = new Date();
        try {
            const bank = new bank_1.Bank();
            bank.bankCode = createBankDto.bankCode;
            bank.bankName = createBankDto.bankName;
            bank.shortName = createBankDto.shortName;
            const { result, err } = await this.bankRepository.save(bank);
            if (err) {
                return { bank: null, err };
            }
            const messageVm = {
                value: result ? result.id.toString() : '',
                name: result ? result.bankName : '',
            };
            return { bank: messageVm, err: null };
        }
        catch (err) {
            return { bank: null, err };
        }
    }
    async update(oid, updateBankDto, userOid) {
        try {
            const lastModifiedBy = userOid;
            let { result: resultFind, err: errFind } = await this.bankRepository.findById(oid);
            if (errFind != null) {
                return {
                    bank: null, err: errFind
                };
            }
            if (errFind != null) {
                return {
                    bank: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const now = new Date();
            if (resultFind == null) {
                return {
                    bank: null, err: {}
                };
            }
            resultFind.bankCode = updateBankDto.bankCode ?? resultFind.bankCode;
            resultFind.bankName = updateBankDto.bankName ?? resultFind.bankName;
            resultFind.shortName = updateBankDto.shortName ?? resultFind.shortName;
            const { result, err } = await this.bankRepository.update(oid, resultFind);
            if (err != null) {
                return {
                    bank: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const bankVm = result ? (0, bank_vm_1.toBankResponse)(result) : null;
            return { bank: bankVm, err: null };
        }
        catch (err) {
            return { bank: null, err };
        }
    }
    async deleted(oid, userOid) {
        try {
            const { result: resultFind, err: errFind } = await this.bankRepository.findById(oid);
            if (errFind != null) {
                return {
                    bank: null, err: errFind
                };
            }
            if (resultFind == null) {
                return {
                    bank: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const { result, err } = await this.bankRepository.deleted(resultFind, oid);
            if (err != null) {
                return {
                    bank: null, err: err
                };
            }
            const bankVm = result ? (0, bank_vm_1.toBankResponse)(result) : null;
            return { bank: bankVm, err: null };
        }
        catch (err) {
            return { bank: null, err };
        }
    }
    async findAll() {
        try {
            const { result, err } = await this.bankRepository.findAll();
            if (err != null) {
                return {
                    banks: null, err: err
                };
            }
            const banks = result ? (0, bank_vm_1.toBankResponses)(result) : null;
            return { banks, err: null };
        }
        catch (err) {
            return { banks: null, err };
        }
    }
    async findById(oid) {
        try {
            const { result, err } = await this.bankRepository.findById(oid);
            const bankVm = result ? (0, bank_vm_1.toBankResponse)(result) : null;
            return { bank: bankVm, err: null };
        }
        catch (err) {
            return { bank: null, err };
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { result: resultCount, err: errCount } = await this.bankRepository.findCountByCriteria(condition);
            if (errCount) {
                return { banks: [], total: 0, err: errCount };
            }
            const { result, err } = await this.bankRepository.findByCriteriaPage(condition, page, pageSize);
            if (err) {
                return { banks: [], total: 0, err };
            }
            const bankVm = (0, bank_vm_1.toBankResponses)(result ?? []);
            return { banks: bankVm, total: resultCount, err: err };
        }
        catch (err) {
            return { banks: [], total: 0, err };
        }
    }
};
exports.BankService = BankService;
exports.BankService = BankService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bank_repository_1.BankRepository])
], BankService);
//# sourceMappingURL=bank.service.js.map