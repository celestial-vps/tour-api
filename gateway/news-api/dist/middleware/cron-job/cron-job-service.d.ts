import { GeoCacheCountryService } from '../../services/geo-cache-country.service';
export declare class CronJobService {
    private readonly geoCacheService;
    private readonly logger;
    constructor(geoCacheService: GeoCacheCountryService);
    handleCron(): Promise<void>;
}
