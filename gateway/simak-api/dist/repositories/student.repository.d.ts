import { Model } from 'mongoose';
import { Student, StudentDocument } from '../models/student';
import { IStudentRepository } from '../repositories/istudent.repository';
import { FilterStudentDto } from '../dtos/payload-student-dto';
import { StudentDomain } from '../domain/student.domain';
export declare class StudentRepository implements IStudentRepository {
    private studentModel;
    constructor(studentModel: Model<StudentDocument>);
    save(student: Student): Promise<{
        result: StudentDomain | null;
        err: any;
    }>;
    update(oid: string, student: StudentDomain): Promise<{
        result: StudentDomain | null;
        err: any;
    }>;
    deleted(student: StudentDomain, oid: string): Promise<{
        result: StudentDomain | null;
        err: any;
    }>;
    findAll(): Promise<{
        result: StudentDomain[] | null;
        err: any;
    }>;
    advanceFlter(condition: FilterStudentDto): Promise<{
        result: StudentDomain[] | null;
        err: any;
    }>;
    findById(oid: string): Promise<{
        result: StudentDomain | null;
        err: any;
    }>;
    findCountByCriteria(condition: FilterStudentDto): Promise<{
        result: number | 0;
        err: any;
    }>;
    findByCriteriaPage(condition: FilterStudentDto, page: number, pageSize: number): Promise<{
        result: StudentDomain[] | null;
        err: any;
    }>;
}
