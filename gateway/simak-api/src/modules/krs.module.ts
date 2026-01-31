import { Module } from '@nestjs/common'; 
import { KrsController } from '../controllers/krs.controller';
import { KrsService } from '../services/krs.service';
import { KrsRepository } from '../repositories/krs.repository';
import { ResponseService } from '../common/build.response'; 
import { UserModule } from './user.module';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { AuditTrailModule } from './audit-trail.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Krs, KrsSchema } from '../models/krs';

@Module({
    imports: [MongooseModule.forFeature([{ name: Krs.name, schema: KrsSchema }]),AuditTrailModule,UserModule],
    controllers: [KrsController],
    providers: [AuditTrailService, KrsService, ResponseService, KrsRepository],
    exports: [AuditTrailService],

})
export class KrsModule { }
