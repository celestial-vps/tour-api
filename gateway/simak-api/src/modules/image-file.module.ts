import { Module } from '@nestjs/common';
import { ImageFileController } from '../controllers/image-file.controller';
import { ImageFileService } from '../services/image-file.service';
import { ImageFileRepository } from '../repositories/image-file.repository';
import { AuditTrailModule } from './audit-trail.module'; 
import { ResponseService } from '../common/build.response';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageFile, ImageFileSchema } from '../models/image-file';

@Module({
  imports: [MongooseModule.forFeature([{ name: ImageFile.name, schema: ImageFileSchema }]), AuditTrailModule],
  controllers: [ImageFileController],
  providers: [
    ImageFileService,
    ImageFileRepository,
    ResponseService,
  ],
  exports: [
    ImageFileService,
  ],
})
export class ImageFileModule { }
