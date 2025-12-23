import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsImageDetail } from '../models/news-image-detail.entity';
 

@Module({
    imports: [TypeOrmModule.forFeature([NewsImageDetail])],
    providers: [],
    exports: [],

})
export class NewsImageDetailModule { }
