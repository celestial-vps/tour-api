import { CourseDomain } from '../domain/course.domain';
import { Course } from '../models/course';

export interface ICourseRepository {
    save(course: Course): Promise<{ result: CourseDomain | null ; err: any }>
    update(oid: string, course: CourseDomain): Promise<{ result: CourseDomain | null; err: any }>;
    deleted(course: CourseDomain, oid: string): Promise<{ result: CourseDomain | null; err: any }>;
    findAll(): Promise<{ result: CourseDomain[] | null; err: any }>;
    findById(oid: string): Promise<{ result: CourseDomain | null; err: any }>;
    advanceFlter(condition: any): Promise<{ result: CourseDomain[] | null; err: any }>;
    findCountByCriteria(condition: any): Promise<{ result: number | 0; err: any }>;
    findByCriteriaPage(condition: any, page: number, pageSize: number): Promise<{ result: CourseDomain[] | null; err: any }>;
}
