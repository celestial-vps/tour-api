import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import path, { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { BankModule } from './modules/bank.module';
import { AuthModule } from './modules/auth.module';
import configuration from './config/configuration';
import { CourseModule } from './modules/course.module';
import { TeacherModule } from './modules/teacher.module';
import { StudentModule } from './modules/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // sehingga ConfigService tersedia di semua module
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [configuration],
    }),
    MongooseModule.forRoot(
      'mongodb://localhost:27017/simakdb',
    ), AuthModule,
    BankModule, CourseModule, TeacherModule, StudentModule,
    // KrsModule, KrsDetailModule, KhsModule, KhsDetailModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '/', 'uploads'),
    // }),
    // MulterModule.register({
    //   dest: path.resolve(__dirname + '/uploads'),
    // }),
    // ,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
