import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryController } from '../controllers/country.controller';
import { ResponseService } from '../common/build.response';
import { UserModule } from './user.module';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { AuditTrailModule } from './audit-trail.module';
import { GeoCacheCountryService } from '../services/geo-cache-country.service';

@Module({
    imports: [  UserModule, AuditTrailModule],
    controllers: [CountryController],
    providers: [AuditTrailService, GeoCacheCountryService, ResponseService],
    exports: [AuditTrailService],

})
export class CountryModule { }
