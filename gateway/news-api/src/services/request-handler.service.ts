import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'; 
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { ResponseService } from '../common/build.response';

@Injectable()
export class RequestHandlerService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly auditTrailService: AuditTrailService,
  ) {}

  async handleRequest<T>(
    fn: () => Promise<T>,
    options: {
      action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
      tableName: string;
      userOid: string;
      recordOid?: string;
      req?: any;
      paginate?: boolean;
      successMessage?: string;
    },
  ) {
    const {
      action,
      tableName,
      userOid,
      recordOid,
      req,
      paginate,
      successMessage,
    } = options;

    try {
      const result: any = await fn();

      await this.auditTrailService.recordPost({
        tableName,
        recordOid: recordOid ?? 'unknown',
        action,
        status: 'SUCCESS',
        message: successMessage ?? `${action} ${tableName} success`,
        userOid,
        ipAddress: req?.ip,
        userAgent: req?.headers['user-agent'],
        newData: result,
      });

      if (paginate) {
        return this.responseService.responseOkWithPagination(result.data, {
          page: result.page,
          size: result.size,
          total: result.total,
          totalPages: result.totalPages,
        });
      }

      return this.responseService.responseOk(
        result,
        Array.isArray(result) ? result.length : 1,
      );
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName,
        recordOid: recordOid ?? 'unknown',
        action,
        status: 'ERROR',
        message: error.message,
        userOid,
        ipAddress: req?.ip,
        userAgent: req?.headers['user-agent'],
      });

      if (error instanceof NotFoundException) throw error;

      throw new BadRequestException({
        code: 400,
        status: 400,
        message: error.message,
      });
    }
  }
}
