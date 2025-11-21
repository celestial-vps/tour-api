import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImageFile } from '../models/image-file.entity';
import { ImageFileController } from '../controllers/image-file.controller';
import { ImageFileService } from '../services/image-file.service';
import { ImageFileRepository } from '../repositories/image-file.repository';
import { ImageFileMapping } from '../mappings/image-file-vm';
import { AuditTrailModule } from './audit-trail.module';
import { UserModule } from './user.module';
import { ResponseService } from '../common/build.response';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageFile]),   // register entity
    UserModule,
    AuditTrailModule,
  ],
  controllers: [ImageFileController],
  providers: [
    ImageFileService,
    ImageFileRepository,
    ImageFileMapping,
    ResponseService,
  ],
  exports: [
    ImageFileService,
  ],
})
export class ImageFileModule {}
