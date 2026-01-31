import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { Teacher, TeacherDocument } from '../models/teacher';
import { ITeacherRepository } from '../repositories/iteacher.repository';
import { FilterTeacherDto } from '../dtos/payload-teacher-dto';
import { Mapper } from '../misc/mapper';
import { TeacherDomain } from '../domain/teacher.domain';

@Injectable()
export class TeacherRepository implements ITeacherRepository {
    constructor(
        @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    ) { }

    async save(teacher: Teacher): Promise<{ result: TeacherDomain | null; err: any }> {
        try {
            const collectionTeacher = new this.teacherModel(teacher);
            collectionTeacher.createdAt = now();
            const colTeacher = await collectionTeacher.save();
            const data = Mapper.mapToDomain(TeacherDomain, colTeacher) as TeacherDomain;
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err };
        }
    }

    async update(oid: string, teacher: TeacherDomain): Promise<{ result: TeacherDomain | null; err: any }> {
        try {
            const collectionTeacher = await this.teacherModel.findByIdAndUpdate(
                { _id: oid },
                teacher,
                {
                    new: true,
                },
            );
            const data = Mapper.mapToDomain(TeacherDomain, collectionTeacher) as TeacherDomain;
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for teacher and the error
        }
    }

    async deleted(teacher: TeacherDomain, oid: string): Promise<{ result: TeacherDomain | null; err: any }> {
        try {
            const data = await this.teacherModel.findByIdAndDelete({ _id: oid });
            return { result: teacher, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for teacher and the error
        }
    }

    async findAll(): Promise<{ result: TeacherDomain[] | null; err: any }> {
        try {
            const teachers = await this.teacherModel.find(); // Await the find operation
            const data = Mapper.mapToDomain(TeacherDomain, teachers) as TeacherDomain[];
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for teachers and the error
        }
    }

    async advanceFlter(condition: FilterTeacherDto): Promise<{ result: TeacherDomain[] | null; err: any }> {
        try {
            const query: any = {}; // Initialize an empty query object

            // Build the query based on provided conditions
            if (condition.nidn) {
                query.nidn = { $regex: condition.nidn, $options: 'i' }; // Case-insensitive regex search
            }
            if (condition.name) {
                query.name = { $regex: condition.name, $options: 'i' }; // Case-insensitive regex search
            }

            // Fetch results with pagination
            const teachers = await this.teacherModel.find(query)
            const data = Mapper.mapToDomain(TeacherDomain, teachers) as TeacherDomain[];
            return { result: data, err: null };
        } catch (error) {
            return { result: null, err: error };
        }
    }

    async findById(oid: string): Promise<{ result: TeacherDomain | null; err: any }> {
        try {
            const teacher = await this.teacherModel.findOne({ _id: oid }); // Await the find operation
            const data = Mapper.mapToDomain(TeacherDomain, teacher) as TeacherDomain;
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for teacher and the error
        }
    }

    async findCountByCriteria(condition: FilterTeacherDto): Promise<{ result: number | 0; err: any }> {
        try {
            const query: any = {}; // Initialize an empty query object

            // Build the query based on provided conditions
            if (condition.nidn) {
                query.nidn = { $regex: condition.nidn, $options: 'i' }; // Case-insensitive regex search
            }
            if (condition.name) {
                query.name = { $regex: condition.name, $options: 'i' }; // Case-insensitive regex search
            }

            // Count the total number of records matching the condition
            const count = await this.teacherModel.countDocuments(query);


            return { result: count, err: null };

        } catch (err) {
            return { result: 0, err };
        }

    }

    async findByCriteriaPage(condition: FilterTeacherDto, page: number, pageSize: number): Promise<{ result: TeacherDomain[] | null; err: any }> {
        try {
            const query: any = {}; // Initialize an empty query object

            // Build the query based on provided conditions
            if (condition.nidn) {
                query.nidn = { $regex: condition.nidn, $options: 'i' }; // Case-insensitive regex search
            }
            if (condition.name) {
                query.name = { $regex: condition.name, $options: 'i' }; // Case-insensitive regex search
            }

            // Fetch results with pagination
            const teachers = await this.teacherModel.find(query)
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            const data = Mapper.mapToDomain(TeacherDomain, teachers) as TeacherDomain[];
            return { result: data, err: null };
        } catch (error) {
            return { result: [], err: error };
        }
    }
}
