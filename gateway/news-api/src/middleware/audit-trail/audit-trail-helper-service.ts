import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AuditTrailService } from "./audit-trail-midleware-service";
import { ResponseService } from "../../common/build.response";

@Injectable()
export class ControllerHelperService {
  constructor(private readonly auditTrailService: AuditTrailService, private readonly responseService: ResponseService) {}

  async handleRequest(fn: () => Promise<any>, action: string, userOid: string, recordOid?: string, req?: any, paginate?: boolean) {
    try {
      const result = await fn();

      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: recordOid ?? 'unknown',
        action,
        status: 'SUCCESS',
        message: `${action} success`,
        userOid,
        ipAddress: req?.ip,
        userAgent: req?.headers['user-agent'],
        newData: result,
      });

      if (paginate) {
        return this.responseService.responseOkWithPagination(result, result.totalPage);
      }

      return this.responseService.responseOk(result, Array.isArray(result) ? result.length : 1);
    } catch (error) {
      await this.auditTrailService.recordPost({
        tableName: 'banks',
        recordOid: recordOid ?? 'unknown',
        action,
        status: 'ERROR',
        message: error.message,
        userOid,
        ipAddress: req?.ip,
        userAgent: req?.headers['user-agent'],
      });

      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException({ code: 400, status: 400, message: error.message });
    }
  }
}
