import { CreateCourseDto, FilterCourseDto, UpdateCourseDto } from '../dtos/payload-course-dto';
import { ICourseService } from '../services/icourse.service';
import { CourseVm } from '../mappings/course.vm';
import { MessageVm } from '../mappings/message.vm';
import { CourseRepository } from '../repositories/course.repository';
export declare class CourseService implements ICourseService {
    private readonly courseRepository;
    constructor(courseRepository: CourseRepository);
    create(createCourseDto: CreateCourseDto, userOid: string): Promise<{
        course: MessageVm | null;
        err: any;
    }>;
    update(oid: string, updateCourseDto: UpdateCourseDto, userOid: string): Promise<{
        course: CourseVm | null;
        err: any;
    }>;
    deleted(oid: string, userOid: string): Promise<{
        course: CourseVm | null;
        err: any;
    }>;
    findAll(): Promise<{
        courses: CourseVm[] | null;
        err: any;
    }>;
    findById(oid: string): Promise<{
        course: CourseVm | null;
        err: any;
    }>;
    findPage(page: number, pageSize: number, condition: FilterCourseDto): Promise<{
        courses: CourseVm[];
        total: number;
        err: any;
    }>;
}
