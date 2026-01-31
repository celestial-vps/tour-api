import { Module } from '@nestjs/common'; 
import { TeacherController } from '../controllers/teacher.controller';
import { TeacherService } from '../services/teacher.service';
import { TeacherRepository } from '../repositories/teacher.repository';
import { ResponseService } from '../common/build.response'; 
import { UserModule } from './user.module';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { AuditTrailModule } from './audit-trail.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from '../models/teacher';

@Module({
    imports: [MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),AuditTrailModule,UserModule],
    controllers: [TeacherController],
    providers: [AuditTrailService, TeacherService, ResponseService, TeacherRepository],
    exports: [AuditTrailService],

})
export class TeacherModule { }
