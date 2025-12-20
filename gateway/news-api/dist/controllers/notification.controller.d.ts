import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto, FilterNotificationDto, UpdateNotificationDto } from '../dtos/payload-notification-dto';
import { ResponseService } from '../common/build.response';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
export declare class NotificationController {
    private readonly notificationService;
    private readonly responseService;
    private readonly auditTrailService;
    constructor(notificationService: NotificationService, responseService: ResponseService, auditTrailService: AuditTrailService);
    private handleRequest;
    create(createNotificationDto: CreateNotificationDto, req: any): Promise<any>;
    update(oid: string, updateNotificationDto: UpdateNotificationDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterNotificationDto: FilterNotificationDto, req: any): Promise<any>;
}
