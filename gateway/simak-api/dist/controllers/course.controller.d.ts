import { CourseService } from '../services/course.service';
import { CreateCourseDto, FilterCourseDto, UpdateCourseDto } from '../dtos/payload-course-dto';
import { ResponseService } from '../common/build.response';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
export declare class CourseController {
    private readonly courseService;
    private readonly responseService;
    private readonly auditTrailService;
    constructor(courseService: CourseService, responseService: ResponseService, auditTrailService: AuditTrailService);
    create(createCourseDto: CreateCourseDto, req: any): Promise<any>;
    update(oid: string, updateCourseDto: UpdateCourseDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterCourseDto: FilterCourseDto, req: any): Promise<any>;
}
