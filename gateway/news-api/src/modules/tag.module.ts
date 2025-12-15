import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../models/tag.entity';
import { TagController } from '../controllers/tag.controller';
import { TagService } from '../services/tag.service';
import { TagRepository } from '../repositories/tag.repository'; 
import { ResponseService } from '../common/build.response';  
import { TagMapping } from '../mappings/tag-vm';
import { UserModule } from './user.module';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { AuditTrailModule } from './audit-trail.module';

@Module({
    imports: [TypeOrmModule.forFeature([Tag]) ,UserModule,AuditTrailModule],
    controllers: [TagController],
    providers: [AuditTrailService ,TagService,ResponseService, TagRepository,TagMapping],
     exports: [AuditTrailService],

})
export class TagModule {}
