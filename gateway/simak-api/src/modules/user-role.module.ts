import { Module } from '@nestjs/common';
import { ResponseService } from '../common/build.response';
import { UserRoleRepository } from '../repositories/user-role.repository';
import { UserRoleService } from '../services/user-role.service';
import { UserRole, UserRoleSchema } from '../models/user-role';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRoleController } from '../controllers/user-role.controller';
import { AuditTrailModule } from './audit-trail.module';
import { AdminRoleGuard } from '../middleware/guards/admin-role.guard';
import { UserModule } from './user.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: UserRole.name, schema: UserRoleSchema }]),
    UserModule, AuditTrailModule],
    controllers: [UserRoleController],
    providers: [UserRoleService, ResponseService, UserRoleRepository,AdminRoleGuard],
    exports: [UserRoleRepository,AdminRoleGuard],

})
export class UserRoleModule { }
