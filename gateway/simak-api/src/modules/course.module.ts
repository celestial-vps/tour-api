import { Module } from '@nestjs/common'; 
import { CourseController } from '../controllers/course.controller';
import { CourseService } from '../services/course.service';
import { CourseRepository } from '../repositories/course.repository';
import { ResponseService } from '../common/build.response'; 
import { UserModule } from './user.module';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { AuditTrailModule } from './audit-trail.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from '../models/course';

@Module({
    imports: [MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),AuditTrailModule,UserModule],
    controllers: [CourseController],
    providers: [AuditTrailService, CourseService, ResponseService, CourseRepository],
    exports: [AuditTrailService],

})
export class CourseModule { }
