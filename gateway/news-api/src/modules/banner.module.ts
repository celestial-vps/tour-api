import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from '../models/banner.entity';
import { BannerController } from '../controllers/banner.controller';
import { BannerService } from '../services/banner.service';
import { BannerRepository } from '../repositories/banner.repository';
import { ResponseService } from '../common/build.response';
import { BannerMapping } from '../mappings/banner-vm';
import { UserModule } from './user.module';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { AuditTrailModule } from './audit-trail.module'; 

@Module({
    imports: [TypeOrmModule.forFeature([Banner]), UserModule, AuditTrailModule],
    controllers: [BannerController],
    providers: [AuditTrailService, BannerService, ResponseService, BannerRepository, BannerMapping],
    exports: [AuditTrailService],

})
export class BannerModule { }
