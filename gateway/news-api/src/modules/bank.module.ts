import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { BankController } from '../controllers/bank.controller';
import { BankService } from '../services/bank.service';
import { BankRepository } from '../repositories/bank.repository';
import { BankMapping } from '../mappings/bank-vm';
import { ResponseService } from '../common/build.response'; 
import { UserModule } from './user.module';
import { Bank } from '../models/bank.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Bank]) ,UserModule],
    controllers: [BankController],
    providers: [BankService,ResponseService, BankRepository,BankMapping],

})
export class BankModule {}
