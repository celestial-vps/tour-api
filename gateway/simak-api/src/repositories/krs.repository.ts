import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { Krs, KrsDocument } from '../models/krs';
import { IKrsRepository } from '../repositories/ikrs.repository';
import { FilterKrsDto } from '../dtos/payload-krs-dto';
import { Mapper } from '../misc/mapper';
import { KrsDomain } from '../domain/krs.domain';

@Injectable()
export class KrsRepository implements IKrsRepository {
    constructor(
        @InjectModel(Krs.name) private krsModel: Model<KrsDocument>,
    ) { }

    async save(krs: Krs): Promise<{ result: KrsDomain | null; err: any }> {
        try {
            const collectionKrs = new this.krsModel(krs);
            collectionKrs.createdAt = now();
            const colKrs = await collectionKrs.save();
            const data = Mapper.mapToDomain(KrsDomain, colKrs) as KrsDomain;
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err };
        }
    }

    async update(oid: string, krs: KrsDomain): Promise<{ result: KrsDomain | null; err: any }> {
        try {
            const collectionKrs = await this.krsModel.findByIdAndUpdate(
                { _id: oid },
                krs,
                {
                    new: true,
                },
            );
            const data = Mapper.mapToDomain(KrsDomain, collectionKrs) as KrsDomain;
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for krs and the error
        }
    }

    async deleted(krs: KrsDomain, oid: string): Promise<{ result: KrsDomain | null; err: any }> {
        try {
            const data = await this.krsModel.findByIdAndDelete({ _id: oid });
            return { result: krs, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for krs and the error
        }
    }

    async findAll(): Promise<{ result: KrsDomain[] | null; err: any }> {
        try {
            const krss = await this.krsModel.find(); // Await the find operation
            const data = Mapper.mapToDomain(KrsDomain, krss) as KrsDomain[];
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for krss and the error
        }
    }

    async advanceFlter(condition: FilterKrsDto): Promise<{ result: KrsDomain[] | null; err: any }> {
        try {
            const query: any = {}; // Initialize an empty query object

            // Build the query based on provided conditions
            if (condition.student) {
                query.student = { $regex: condition.student, $options: 'i' }; // Case-insensitive regex search
            }
            if (condition.semester) {
                query.semester = { $regex: condition.semester, $options: 'i' }; // Case-insensitive regex search
            }

            // Fetch results with pagination
            const krss = await this.krsModel.find(query)
            const data = Mapper.mapToDomain(KrsDomain, krss) as KrsDomain[];
            return { result: data, err: null };
        } catch (error) {
            return { result: null, err: error };
        }
    }

    async findById(oid: string): Promise<{ result: KrsDomain | null; err: any }> {
        try {
            const krs = await this.krsModel.findOne({ _id: oid }); // Await the find operation
            const data = Mapper.mapToDomain(KrsDomain, krs) as KrsDomain;
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for krs and the error
        }
    }

    async findCountByCriteria(condition: FilterKrsDto): Promise<{ result: number | 0; err: any }> {
        try {
            const query: any = {}; // Initialize an empty query object

            // Build the query based on provided conditions
            if (condition.student) {
                query.student = { $regex: condition.student, $options: 'i' }; // Case-insensitive regex search
            }
            if (condition.semester) {
                query.semester = { $regex: condition.semester, $options: 'i' }; // Case-insensitive regex search
            }

            // Count the total number of records matching the condition
            const count = await this.krsModel.countDocuments(query);


            return { result: count, err: null };

        } catch (err) {
            return { result: 0, err };
        }

    }

    async findByCriteriaPage(condition: FilterKrsDto, page: number, pageSize: number): Promise<{ result: KrsDomain[] | null; err: any }> {
        try {
            const query: any = {}; // Initialize an empty query object

            // Build the query based on provided conditions
            if (condition.student) {
                query.student = { $regex: condition.student, $options: 'i' }; // Case-insensitive regex search
            }
            if (condition.semester) {
                query.semester = { $regex: condition.semester, $options: 'i' }; // Case-insensitive regex search
            }

            // Fetch results with pagination
            const krss = await this.krsModel.find(query)
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            const data = Mapper.mapToDomain(KrsDomain, krss) as KrsDomain[];
            return { result: data, err: null };
        } catch (error) {
            return { result: [], err: error };
        }
    }
}
