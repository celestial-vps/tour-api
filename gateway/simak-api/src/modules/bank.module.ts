import { Module } from '@nestjs/common'; 
import { BankController } from '../controllers/bank.controller';
import { BankService } from '../services/bank.service';
import { BankRepository } from '../repositories/bank.repository';
import { ResponseService } from '../common/build.response'; 
import { UserModule } from './user.module';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { AuditTrailModule } from './audit-trail.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from '../models/bank';

@Module({
    imports: [MongooseModule.forFeature([{ name: Bank.name, schema: BankSchema }]),AuditTrailModule,UserModule],
    controllers: [BankController],
    providers: [AuditTrailService, BankService, ResponseService, BankRepository],
    exports: [AuditTrailService],

})
export class BankModule { }
