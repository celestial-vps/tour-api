import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule'; 
 
@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);

  constructor() {}

  /**
   * Cron job dijalankan setiap 5 menit
   * Bisa diganti dengan CronExpression lainnya
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    this.logger.log('🔄 Running cron job for Redis countries');

    try {
      // Contoh: refresh countries dari DB / API
      // const countries = await this.geoCacheService.getCountries();
      // this.logger.debug(`Countries count: ${countries.length}`);

      // Bisa lakukan operasi lainnya, misal sync ke Redis
    } catch (err) {
      this.logger.error('Cron job error', err);
    }
  }
}
