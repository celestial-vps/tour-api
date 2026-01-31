import { Module } from '@nestjs/common'; 
import { StudentController } from '../controllers/student.controller';
import { StudentService } from '../services/student.service';
import { StudentRepository } from '../repositories/student.repository';
import { ResponseService } from '../common/build.response'; 
import { UserModule } from './user.module';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { AuditTrailModule } from './audit-trail.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from '../models/student';

@Module({
    imports: [MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),AuditTrailModule,UserModule],
    controllers: [StudentController],
    providers: [AuditTrailService, StudentService, ResponseService, StudentRepository],
    exports: [AuditTrailService],

})
export class StudentModule { }
