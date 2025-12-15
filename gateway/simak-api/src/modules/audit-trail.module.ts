// src/audit-trail/audit-trail.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';

@Module({
  imports: [ConfigModule], // supaya ConfigService tersedia
  providers: [AuditTrailService],
  exports: [AuditTrailService], // bisa digunakan di module lain
})
export class AuditTrailModule {}
