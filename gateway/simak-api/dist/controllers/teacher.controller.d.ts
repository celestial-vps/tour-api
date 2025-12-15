import { TeacherService } from '../services/teacher.service';
import { CreateTeacherDto, FilterTeacherDto, UpdateTeacherDto } from '../dtos/payload-teacher-dto';
import { ResponseService } from '../common/build.response';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
export declare class TeacherController {
    private readonly teacherService;
    private readonly responseService;
    private readonly auditTrailService;
    constructor(teacherService: TeacherService, responseService: ResponseService, auditTrailService: AuditTrailService);
    create(createTeacherDto: CreateTeacherDto, req: any): Promise<any>;
    update(oid: string, updateTeacherDto: UpdateTeacherDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterTeacherDto: FilterTeacherDto, req: any): Promise<any>;
}
