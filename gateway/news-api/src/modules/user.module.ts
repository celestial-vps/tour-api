// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../models/user.entity';
// import { UserRepository } from '../repositories/user.repository';
// import { UserController } from '../controllers/user.controller';
// import { UserService } from '../services/user.service';
// import { ResponseService } from '../common/build.response';
// import { UserMapping } from '../mappings/user-vm';

// @Module({
//     imports: [TypeOrmModule.forFeature([User])],
//     controllers: [UserController],
//     providers: [UserService,ResponseService, UserRepository,UserMapping],
//     exports:[UserRepository,UserService]
//   })
//   export class UserModule {}