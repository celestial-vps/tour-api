import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ResponseService } from '../common/build.response';   
import { UserModule } from './user.module';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { AuditTrailModule } from './audit-trail.module';
import { NewsCategory } from '../models/news-category.entity';
import { NewsCategoryController } from '../controllers/news-category.controller';
import { NewsCategoryService } from '../services/news-category.service';
import { NewsCategoryRepository } from '../repositories/news-category.repository';
import { NewsCategoryMapping } from '../mappings/news-category-vm';
import { RequestHandlerService } from '../services/request-handler.service';

@Module({
    imports: [TypeOrmModule.forFeature([NewsCategory]) ,UserModule,AuditTrailModule],
    controllers: [NewsCategoryController],
    providers: [AuditTrailService ,NewsCategoryService,RequestHandlerService,ResponseService, NewsCategoryRepository,NewsCategoryMapping],
     exports: [AuditTrailService],

})
export class NewsCategoryModule {}
