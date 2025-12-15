import { Model } from 'mongoose';
import { Course, CourseDocument } from '../models/course';
import { ICourseRepository } from '../repositories/icourse.repository';
import { FilterCourseDto } from '../dtos/payload-course-dto';
import { CourseDomain } from '../domain/course.domain';
export declare class CourseRepository implements ICourseRepository {
    private courseModel;
    constructor(courseModel: Model<CourseDocument>);
    save(course: Course): Promise<{
        result: CourseDomain | null;
        err: any;
    }>;
    update(oid: string, course: CourseDomain): Promise<{
        result: CourseDomain | null;
        err: any;
    }>;
    deleted(course: CourseDomain, oid: string): Promise<{
        result: CourseDomain | null;
        err: any;
    }>;
    findAll(): Promise<{
        result: CourseDomain[] | null;
        err: any;
    }>;
    advanceFlter(condition: FilterCourseDto): Promise<{
        result: CourseDomain[] | null;
        err: any;
    }>;
    findById(oid: string): Promise<{
        result: CourseDomain | null;
        err: any;
    }>;
    findCountByCriteria(condition: FilterCourseDto): Promise<{
        result: number | 0;
        err: any;
    }>;
    findByCriteriaPage(condition: FilterCourseDto, page: number, pageSize: number): Promise<{
        result: CourseDomain[] | null;
        err: any;
    }>;
}
