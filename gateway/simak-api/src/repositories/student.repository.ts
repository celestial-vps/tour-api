import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { Student, StudentDocument } from '../models/student';
import { IStudentRepository } from '../repositories/istudent.repository';
import { FilterStudentDto } from '../dtos/payload-student-dto';
import { Mapper } from '../misc/mapper';
import { StudentDomain } from '../domain/student.domain';

@Injectable()
export class StudentRepository implements IStudentRepository {
    constructor(
        @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    ) { }

    async save(student: Student): Promise<{ result: StudentDomain | null; err: any }> {
        try {
            const collectionStudent = new this.studentModel(student);
            collectionStudent.createdAt = now();
            const colStudent = await collectionStudent.save();
            const data = Mapper.mapToDomain(StudentDomain, colStudent) as StudentDomain;
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err };
        }
    }

    async update(oid: string, student: StudentDomain): Promise<{ result: StudentDomain | null; err: any }> {
        try {
            const collectionStudent = await this.studentModel.findByIdAndUpdate(
                { _id: oid },
                student,
                {
                    new: true,
                },
            );
            const data = Mapper.mapToDomain(StudentDomain, collectionStudent) as StudentDomain;
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for student and the error
        }
    }

    async deleted(student: StudentDomain, oid: string): Promise<{ result: StudentDomain | null; err: any }> {
        try {
            const data = await this.studentModel.findByIdAndDelete({ _id: oid });
            return { result: student, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for student and the error
        }
    }

    async findAll(): Promise<{ result: StudentDomain[] | null; err: any }> {
        try {
            const students = await this.studentModel.find(); // Await the find operation
            const data = Mapper.mapToDomain(StudentDomain, students) as StudentDomain[];
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for students and the error
        }
    }

    async advanceFlter(condition: FilterStudentDto): Promise<{ result: StudentDomain[] | null; err: any }> {
        try {
            const query: any = {}; // Initialize an empty query object

            // Build the query based on provided conditions
            if (condition.nim) {
                query.nim = { $regex: condition.nim, $options: 'i' }; // Case-insensitive regex search
            }
            if (condition.name) {
                query.name = { $regex: condition.name, $options: 'i' }; // Case-insensitive regex search
            }

            // Fetch results with pagination
            const students = await this.studentModel.find(query)
            const data = Mapper.mapToDomain(StudentDomain, students) as StudentDomain[];
            return { result: data, err: null };
        } catch (error) {
            return { result: null, err: error };
        }
    }

    async findById(oid: string): Promise<{ result: StudentDomain | null; err: any }> {
        try {
            const student = await this.studentModel.findOne({ _id: oid }); // Await the find operation
            const data = Mapper.mapToDomain(StudentDomain, student) as StudentDomain;
            return { result: data, err: null };
        } catch (err) {
            return { result: null, err }; // Return null for student and the error
        }
    }

    async findCountByCriteria(condition: FilterStudentDto): Promise<{ result: number | 0; err: any }> {
        try {
            const query: any = {}; // Initialize an empty query object

            // Build the query based on provided conditions
            if (condition.nim) {
                query.nim = { $regex: condition.nim, $options: 'i' }; // Case-insensitive regex search
            }
            if (condition.name) {
                query.name = { $regex: condition.name, $options: 'i' }; // Case-insensitive regex search
            }

            // Count the total number of records matching the condition
            const count = await this.studentModel.countDocuments(query);


            return { result: count, err: null };

        } catch (err) {
            return { result: 0, err };
        }

    }

    async findByCriteriaPage(condition: FilterStudentDto, page: number, pageSize: number): Promise<{ result: StudentDomain[] | null; err: any }> {
        try {
            const query: any = {}; // Initialize an empty query object

            // Build the query based on provided conditions
            if (condition.nim) {
                query.nim = { $regex: condition.nim, $options: 'i' }; // Case-insensitive regex search
            }
            if (condition.name) {
                query.name = { $regex: condition.name, $options: 'i' }; // Case-insensitive regex search
            }

            // Fetch results with pagination
            const students = await this.studentModel.find(query)
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            const data = Mapper.mapToDomain(StudentDomain, students) as StudentDomain[];
            return { result: data, err: null };
        } catch (error) {
            return { result: [], err: error };
        }
    }
}
