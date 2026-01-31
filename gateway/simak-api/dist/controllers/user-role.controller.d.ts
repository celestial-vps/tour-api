import { ResponseService } from '../common/build.response';
import { CreateUserRoleDto, FilterUserRoleDto, UpdateUserRoleDto } from '../dtos/payload-user-role-dto';
import { UserRoleService } from '../services/user-role.service';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
export declare class UserRoleController {
    private readonly userRoleService;
    private readonly responseService;
    private readonly auditTrailService;
    constructor(userRoleService: UserRoleService, responseService: ResponseService, auditTrailService: AuditTrailService);
    create(createUserRoleDto: CreateUserRoleDto, req: any): Promise<any>;
    update(oid: string, updateUserRoleDto: UpdateUserRoleDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterUserRoleDto: FilterUserRoleDto, req: any): Promise<any>;
}
