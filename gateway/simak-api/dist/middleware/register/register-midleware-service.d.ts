import { ConfigService } from '@nestjs/config';
export declare class RegisterService {
    private readonly configService;
    private readonly logger;
    private readonly failedAuditLogPath;
    private readonly registerServiceUrl;
    constructor(configService: ConfigService);
    recordPost(auditData: any): Promise<void>;
    private generateCurlCommand;
}
