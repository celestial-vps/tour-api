// import { Module } from '@nestjs/common';
// import { UserModule } from './user.module';
// import { AuthService } from '../services/auth.service';
// import { AuthController } from '../controllers/auth.controller';
// import { ResponseService } from '../common/build.response';
// import { JwtModule } from '@nestjs/jwt';
// import { UserMapping } from '../mappings/user-vm';
// import { JwtStrategy } from '../middleware/jwt-strategy';

// @Module({
//     imports: [
//       UserModule, 
//       JwtModule.register({
//         secret: "celestial",
//         signOptions: {
//           expiresIn: '1d',
//         },
//       }), // Import UserModule to get access to UserRepository
//     ],
//     controllers: [AuthController],
//     providers: [
//       AuthService,
//       ResponseService,UserMapping,
//       JwtStrategy,
//       // UserModule
//       // BankModule
//       // UserRepository
//     ],
//     // exports: [AuthService],
//   })
//   export class AuthModule {}

//   // providers: [BankService,ResponseService, BankRepository,BankMapping],