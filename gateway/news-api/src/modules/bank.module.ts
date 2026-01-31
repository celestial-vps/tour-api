import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from '../models/bank.entity';
import { BankController } from '../controllers/bank.controller';
import { BankService } from '../services/bank.service';
import { BankRepository } from '../repositories/bank.repository';
import { ResponseService } from '../common/build.response';
import { BankMapping } from '../mappings/bank-vm';
import { UserModule } from './user.module';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { AuditTrailModule } from './audit-trail.module';
import { RequestHandlerService } from '../services/request-handler.service';

@Module({
    imports: [TypeOrmModule.forFeature([Bank]), UserModule, AuditTrailModule],
    controllers: [BankController],
    providers: [AuditTrailService, BankService, RequestHandlerService, ResponseService, BankRepository, BankMapping],
    exports: [AuditTrailService],

})
export class BankModule { }
