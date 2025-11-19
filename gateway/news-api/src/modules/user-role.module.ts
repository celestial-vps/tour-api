import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ResponseService } from '../common/build.response'; 
import { UserModule } from './user.module';
import { UserRoleController } from '../controllers/user-role.controller';
import { UserRoleMapping } from '../mappings/user-role-vm';
import { UserRole } from '../models/user-role.entity';
import { UserRoleRepository } from '../repositories/user-role.repository';
import { UserRoleService } from '../services/user-role.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserRole]) ,UserModule],
    controllers: [UserRoleController],
    providers: [UserRoleService,ResponseService, UserRoleRepository,UserRoleMapping],

})
export class UserRoleModule {}
