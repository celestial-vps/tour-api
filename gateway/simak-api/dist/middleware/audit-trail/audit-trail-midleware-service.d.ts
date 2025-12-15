import { ConfigService } from '@nestjs/config';
export declare class AuditTrailService {
    private readonly configService;
    private readonly logger;
    private readonly failedAuditLogPath;
    private readonly auditServiceUrl;
    constructor(configService: ConfigService);
    recordPost(auditData: any): Promise<void>;
    private generateCurlCommand;
}
