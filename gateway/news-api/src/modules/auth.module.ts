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
//     ], 
//   })
//   export class AuthModule {}
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user.module';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { ResponseService } from '../common/build.response';
import { JwtModule } from '@nestjs/jwt';
import { UserMapping } from '../mappings/user-vm';
import { JwtStrategy } from '../middleware/jwt-strategy';

@Module({
  imports: [
    ConfigModule, // Import ConfigModule supaya bisa pakai ConfigService
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECREATKEY', 'celestial-super-secret-key-should-be-longer-123!'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d') as any, // pakai 'as any' supaya TS tidak error
        },
      }),
    }),


  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ResponseService,
    UserMapping,
    JwtStrategy,
  ],
})
export class AuthModule { }
