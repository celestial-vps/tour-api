import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from '../models/teacher';
import { ITeacherRepository } from '../repositories/iteacher.repository';
import { FilterTeacherDto } from '../dtos/payload-teacher-dto';
import { TeacherDomain } from '../domain/teacher.domain';
export declare class TeacherRepository implements ITeacherRepository {
    private teacherModel;
    constructor(teacherModel: Model<TeacherDocument>);
    save(teacher: Teacher): Promise<{
        result: TeacherDomain | null;
        err: any;
    }>;
    update(oid: string, teacher: TeacherDomain): Promise<{
        result: TeacherDomain | null;
        err: any;
    }>;
    deleted(teacher: TeacherDomain, oid: string): Promise<{
        result: TeacherDomain | null;
        err: any;
    }>;
    findAll(): Promise<{
        result: TeacherDomain[] | null;
        err: any;
    }>;
    advanceFlter(condition: FilterTeacherDto): Promise<{
        result: TeacherDomain[] | null;
        err: any;
    }>;
    findById(oid: string): Promise<{
        result: TeacherDomain | null;
        err: any;
    }>;
    findCountByCriteria(condition: FilterTeacherDto): Promise<{
        result: number | 0;
        err: any;
    }>;
    findByCriteriaPage(condition: FilterTeacherDto, page: number, pageSize: number): Promise<{
        result: TeacherDomain[] | null;
        err: any;
    }>;
}
