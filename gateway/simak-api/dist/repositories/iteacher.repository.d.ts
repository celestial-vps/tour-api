import { TeacherDomain } from '../domain/teacher.domain';
import { Teacher } from '../models/teacher';
export interface ITeacherRepository {
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
    findById(oid: string): Promise<{
        result: TeacherDomain | null;
        err: any;
    }>;
    advanceFlter(condition: any): Promise<{
        result: TeacherDomain[] | null;
        err: any;
    }>;
    findCountByCriteria(condition: any): Promise<{
        result: number | 0;
        err: any;
    }>;
    findByCriteriaPage(condition: any, page: number, pageSize: number): Promise<{
        result: TeacherDomain[] | null;
        err: any;
    }>;
}
