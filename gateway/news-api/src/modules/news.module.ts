import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../models/news.entity';
import { NewsController } from '../controllers/news.controller';
import { NewsService } from '../services/news.service';
import { NewsRepository } from '../repositories/news.repository'; 
import { ResponseService } from '../common/build.response';  
import { NewsMapping } from '../mappings/news-vm';
import { UserModule } from './user.module';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { AuditTrailModule } from './audit-trail.module';

@Module({
    imports: [TypeOrmModule.forFeature([News]) ,UserModule,AuditTrailModule],
    controllers: [NewsController],
    providers: [AuditTrailService ,NewsService,ResponseService, NewsRepository,NewsMapping],
     exports: [AuditTrailService],

})
export class NewsModule {}
