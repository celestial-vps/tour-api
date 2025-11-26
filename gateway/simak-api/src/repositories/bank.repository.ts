import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { Bank, BankDocument } from '../models/bank';
import { IBankRepository } from '../repositories/ibank.repository';
import { FilterBankDto } from '../dtos/payload-bank-dto';
import { Mapper } from '../misc/mapper';
import { BankDomain } from '../domain/bank.domain';

@Injectable()
export class BankRepository implements IBankRepository {
    constructor(
        @InjectModel(Bank.name) private bankModel: Model<BankDocument>,
    ) { }

    async save(bank: Bank): Promise<{ result: BankDomain | null; err: any }> {
        try {
            const collectionBank = new this.bankModel(bank);
            collectionBank.createdAt = now();
            const colBank = await collectionBank.save();
            const data = Mapper.mapToDomain(BankDomain, colBank) as BankDomain;
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err };
        }
    }

    async update(oid: string, bank: BankDomain): Promise<{ result: BankDomain | null; err: any }> {
        try {
            const collectionBank = await this.bankModel.findByIdAndUpdate(
                { _id: oid },
                bank,
                {
                    new: true,
                },
            );
            const data = Mapper.mapToDomain(BankDomain, collectionBank) as BankDomain;
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for bank and the error
        }
    }

    async deleted(bank: BankDomain, oid: string): Promise<{ result: BankDomain | null; err: any }> {
        try {
            const data = await this.bankModel.findByIdAndDelete({ _id: oid });
            return { result: bank, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for bank and the error
        }
    }

    async findAll(): Promise<{ result: BankDomain[] | null; err: any }> {
        try {
            const banks = await this.bankModel.find(); // Await the find operation
            const data = Mapper.mapToDomain(BankDomain, banks) as BankDomain[];
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for banks and the error
        }
    }

    async advanceFlter(condition: FilterBankDto): Promise<{ result: BankDomain[] | null; err: any }> {
        try {
            const query: any = {}; // Initialize an empty query object

            // Build the query based on provided conditions
            if (condition.bankCode) {
                query.bankCode = { $regex: condition.bankCode, $options: 'i' }; // Case-insensitive regex search
            }
            if (condition.bankName) {
                query.bankName = { $regex: condition.bankName, $options: 'i' }; // Case-insensitive regex search
            }

            // Fetch results with pagination
            const banks = await this.bankModel.find(query)
            const data = Mapper.mapToDomain(BankDomain, banks) as BankDomain[];
            return { result: data, err: null };
        } catch (error) {
            return { result: null, err: error };
        }
    }

    async findById(oid: string): Promise<{ result: BankDomain | null; err: any }> {
        try {
            const bank = await this.bankModel.findOne({ _id: oid }); // Await the find operation
            const data = Mapper.mapToDomain(BankDomain, bank) as BankDomain;
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for bank and the error
        }
    }

    async findCountByCriteria(condition: FilterBankDto): Promise<{ result: number | 0; err: any }> {
        try {
            const query: any = {}; // Initialize an empty query object

            // Build the query based on provided conditions
            if (condition.bankCode) {
                query.bankCode = { $regex: condition.bankCode, $options: 'i' }; // Case-insensitive regex search
            }
            if (condition.bankName) {
                query.bankName = { $regex: condition.bankName, $options: 'i' }; // Case-insensitive regex search
            }

            // Count the total number of records matching the condition
            const count = await this.bankModel.countDocuments(query);


            return { result: count, err: null };

        } catch (err) {
            return { result: 0, err };
        }

    }

    async findByCriteriaPage(condition: FilterBankDto, page: number, pageSize: number): Promise<{ result: BankDomain[] | null; err: any }> {
        try {
            const query: any = {}; // Initialize an empty query object

            // Build the query based on provided conditions
            if (condition.bankCode) {
                query.bankCode = { $regex: condition.bankCode, $options: 'i' }; // Case-insensitive regex search
            }
            if (condition.bankName) {
                query.bankName = { $regex: condition.bankName, $options: 'i' }; // Case-insensitive regex search
            }

            // Fetch results with pagination
            const banks = await this.bankModel.find(query)
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            const data = Mapper.mapToDomain(BankDomain, banks) as BankDomain[];
            return { result: data, err: null };
        } catch (error) {
            return { result: [], err: error };
        }
    }
}
