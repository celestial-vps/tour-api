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
import { NewsImageDetailModule } from './news-image-detail.module';
import { NewsImageDetail } from '../models/news-image-detail.entity';
import { RequestHandlerService } from '../services/request-handler.service';

@Module({
    imports: [TypeOrmModule.forFeature([News,NewsImageDetail]), UserModule, AuditTrailModule],
    controllers: [NewsController],
    providers: [AuditTrailService, NewsService,RequestHandlerService, ResponseService, NewsRepository, NewsMapping],
    exports: [AuditTrailService],

})
export class NewsModule { }
