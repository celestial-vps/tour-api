import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from '../models/bank.entity';
import { BankController } from '../controllers/bank.controller';
import { BankService } from '../services/bank.service';
import { BankRepository } from '../repositories/bank.repository'; 
import { ResponseService } from '../common/build.response';  
import { BankMapping } from '../mappings/bank-vm';

@Module({
    imports: [TypeOrmModule.forFeature([Bank])],
    controllers: [BankController],
    providers: [BankService,ResponseService, BankRepository,BankMapping],

})
export class BankModule {}
