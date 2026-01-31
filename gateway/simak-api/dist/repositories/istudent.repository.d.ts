import { StudentDomain } from '../domain/student.domain';
import { Student } from '../models/student';
export interface IStudentRepository {
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
    findById(oid: string): Promise<{
        result: StudentDomain | null;
        err: any;
    }>;
    advanceFlter(condition: any): Promise<{
        result: StudentDomain[] | null;
        err: any;
    }>;
    findCountByCriteria(condition: any): Promise<{
        result: number | 0;
        err: any;
    }>;
    findByCriteriaPage(condition: any, page: number, pageSize: number): Promise<{
        result: StudentDomain[] | null;
        err: any;
    }>;
}
