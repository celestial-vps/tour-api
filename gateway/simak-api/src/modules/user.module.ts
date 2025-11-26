import { Module } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { ResponseService } from '../common/build.response';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user';
import { AuditTrailModule } from './audit-trail.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),AuditTrailModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository, UserService]
})
export class UserModule { }