// src/audit-trail/audit-trail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuditTrailService {
  private readonly logger = new Logger(AuditTrailService.name);
  private readonly failedAuditLogPath = path.join(__dirname, 'failed-audit-log.jsonl');
  private readonly auditServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    // Ambil env dari ConfigService
    const url = this.configService.get<string>('AUDIT_TRAIL_SERVICE_URL');
    if (!url) {
      throw new Error('AUDIT_TRAIL_SERVICE_URL is not defined in environment variables');
    }
    this.auditServiceUrl = url;
  }

  /**
   * Kirim audit log ke external service
   * @param auditData Object payload audit
   */
  async recordPost(auditData: any) {
    try {
      const url = `${this.auditServiceUrl}/create`;

      // Debug cURL command (opsional)
      const curlCommand = this.generateCurlCommand(url, auditData);
      this.logger.debug(`cURL command: ${curlCommand}`);

      await axios.post(url, auditData);
      this.logger.log(`✅ Audit trail sent successfully for action: ${auditData.action}`);
    } catch (error: any) {
      this.logger.error(`❌ Failed to send audit trail: ${error.message}`);

      // fallback simpan ke local file .jsonl
      try {
        const jsonLine = JSON.stringify(auditData) + '\n';
        fs.appendFileSync(this.failedAuditLogPath, jsonLine, 'utf8');
        this.logger.warn(`📁 Audit trail saved locally at ${this.failedAuditLogPath}`);
      } catch (fileError: any) {
        this.logger.error(`❌ Failed to save audit trail locally: ${fileError.message}`);
      }
    }
  }

  /**
   * Generate cURL command untuk debugging
   */
  private generateCurlCommand(url: string, data: any) {
    const dataString = JSON.stringify(data).replace(/"/g, '\\"');
    return `curl -X POST "${url}" -H "Content-Type: application/json" -d "${dataString}"`;
  }
}
