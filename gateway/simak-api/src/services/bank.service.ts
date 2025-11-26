// src/bank/bank.service.ts
import { Injectable } from '@nestjs/common';


import { CreateBankDto, FilterBankDto, UpdateBankDto } from '../dtos/payload-bank-dto';
import { Bank } from '../models/bank'; // Assuming you have this entity
import { IBankService } from '../services/ibank.service';
import { BankVm, toBankResponse, toBankResponses } from '../mappings/bank.vm';
import { MessageVm } from '../mappings/message.vm';
import { BankRepository } from '../repositories/bank.repository';
// src/bank/bank.service.ts 

@Injectable()
export class BankService implements IBankService {

    constructor(private readonly bankRepository: BankRepository,
    ) { }

    async create(createBankDto: CreateBankDto, userOid: string): Promise<{ bank: MessageVm | null; err: any; }> {
        const now = new Date();
        try {
            const bank = new Bank();
            bank.bankCode = createBankDto.bankCode;
            bank.bankName = createBankDto.bankName;
            bank.shortName = createBankDto.shortName;

            const { result, err } = await this.bankRepository.save(bank);
            if (err) {
                return { bank: null, err };
            }
            const messageVm: MessageVm = {
                value: result ? result.id.toString() : '',
                name: result ? result.bankName : '',
            };
            return { bank: messageVm, err: null };
        } catch (err) {
            return { bank: null, err };
        }
    }

    async update(oid: string,updateBankDto: UpdateBankDto,  userOid: string): Promise<{ bank: BankVm | null; err: any }> {
        try {
            const lastModifiedBy = userOid; // assuming userOid is in UUID format                
            let { result: resultFind, err: errFind } = await this.bankRepository.findById(oid);

            if (errFind != null) {
                return {
                    bank: null, err: errFind
                }
            }

            if (errFind != null) {
                return {
                    bank: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const now = new Date();
            if (resultFind == null) {
                return {
                    bank: null, err: {}
                }
            }
            resultFind.bankCode = updateBankDto.bankCode ?? resultFind.bankCode;
            resultFind.bankName = updateBankDto.bankName ?? resultFind.bankName;
            resultFind.shortName = updateBankDto.shortName ?? resultFind.shortName;
            // Save updated bank details
            const { result, err } = await this.bankRepository.update(oid, resultFind);
            if (err != null) {
                return {
                    bank: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const bankVm = result ? toBankResponse(result) : null;
            return { bank: bankVm, err: null };
        }
        catch (err) {
            return { bank: null, err };
        }
    }

    async deleted(oid: string, userOid: string): Promise<{ bank: BankVm | null; err: any }> {
        try {
            const { result: resultFind, err: errFind } = await this.bankRepository.findById(oid);
            if (errFind != null) {
                return {
                    bank: null, err: errFind
                }
            }

            if (resultFind == null) {
                return {
                    bank: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const { result, err } = await this.bankRepository.deleted(resultFind, oid);
            if (err != null) {
                return {
                    bank: null, err: err
                }
            }

            const bankVm = result ? toBankResponse(result) : null;
            return { bank: bankVm, err: null };
        } catch (err) {
            return { bank: null, err };
        }

    }

    async findAll(): Promise<{ banks: BankVm[] | null; err: any }> {
        try {
            const { result, err } = await this.bankRepository.findAll();

            if (err != null) {
                return {
                    banks: null, err: err
                }
            }
            const banks = result ?  toBankResponses(result) : null;
            return { banks, err: null }
        } catch (err) {
            return { banks: null, err }
        }
    }

    async findById(oid: string): Promise<{ bank: BankVm | null; err: any }> {
        try {
            const { result, err } = await this.bankRepository.findById(oid);
            const bankVm = result ? toBankResponse(result) : null;
            return { bank: bankVm, err: null }
        } catch (err) {
            return { bank: null, err }
        }


    }

    async findPage( page: number, pageSize: number,condition:FilterBankDto): Promise<{ banks: BankVm[], total: number, err: any }> {
        try {
            const { result: resultCount, err: errCount } = await this.bankRepository.findCountByCriteria(condition);
            if (errCount) {
                return { banks: [], total: 0, err: errCount }
            }

            const { result, err } = await this.bankRepository.findByCriteriaPage(condition, page, pageSize);
            if (err) {
                return { banks: [], total: 0, err }
            }
            const bankVm = toBankResponses(result ?? []);
            return { banks: bankVm, total: resultCount, err: err };
        } catch (err) {
            return { banks: [], total: 0, err }
        }
    }

}
