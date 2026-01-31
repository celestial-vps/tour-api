import { StudentService } from '../services/student.service';
import { CreateStudentDto, FilterStudentDto, UpdateStudentDto } from '../dtos/payload-student-dto';
import { ResponseService } from '../common/build.response';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
export declare class StudentController {
    private readonly studentService;
    private readonly responseService;
    private readonly auditTrailService;
    constructor(studentService: StudentService, responseService: ResponseService, auditTrailService: AuditTrailService);
    create(createStudentDto: CreateStudentDto, req: any): Promise<any>;
    update(oid: string, updateStudentDto: UpdateStudentDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterStudentDto: FilterStudentDto, req: any): Promise<any>;
}
